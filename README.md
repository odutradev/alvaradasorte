# 🍀 Alvará da Sorte

> Plataforma completa e moderna para gerenciamento, acompanhamento e apuração automatizada de bolões de loterias, com conferência de dezenas e notificação por e-mail para cotistas.

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Arquitetura da Solução](#-arquitetura-da-solução)
- [Backend (API)](#-backend-api)
  - [Stack Tecnológica](#stack-tecnológica-api)
  - [Estrutura de Diretórios](#estrutura-de-diretórios-api)
  - [Autenticação e Permissões](#autenticação-e-permissões)
  - [Rotas e Endpoints REST](#rotas-e-endpoints-rest)
  - [Serviços e Rotinas Automáticas](#serviços-e-rotinas-automáticas)
  - [Documentação da API (Swagger / Postman)](#documentação-da-api)
- [Frontend (UI)](#-frontend-ui)
  - [Stack Tecnológica](#stack-tecnológica-ui)
  - [Estrutura de Diretórios](#estrutura-de-diretórios-ui)
  - [Páginas e Fluxos do Usuário](#páginas-e-fluxos-do-usuário)
  - [Sistema de Temas e Design](#sistema-de-temas-e-design)
  - [Gerenciamento de Estado e Cliente HTTP](#gerenciamento-de-estado-e-cliente-http)
- [Configuração de Ambiente (.env)](#-configuração-de-ambiente-env)
- [Como Executar Localmente](#-como-executar-localmente)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Execução em Desenvolvimento](#execução-em-desenvolvimento)
- [Deploy com Docker e Dokploy](#-deploy-com-docker-e-dokploy)

---

## 🌟 Visão Geral

O **Alvará da Sorte** foi projetado para simplificar e profissionalizar a gestão de bolões entre amigos, equipes e comunidades de apostadores. Ele unifica em um único monorepo:

1. **Gestão de Bolões e Cotas:** Criação flexível de bolões com base em modelos predefinidos (*Presets*) ou parâmetros manuais, controle de cotas disponíveis, valor por cota, premiação estimada e arrecadação total.
2. **Conferência Automatizada:** Consulta automática às APIs de loterias (Loterias Caixa) após o sorteio, cálculo de acertos em cada cartão/aposta e atualização em tempo real.
3. **Disparo de E-mails com Resultados:** Notificação formatada via Nodemailer para os cotistas com o extrato individual de sua participação e acertos alcançados.
4. **Painel de Controle e Auditoria:** Registro detalhado de logs do sistema, tentativas de sincronização com a Caixa, ações administrativas e histórico de transações.

---

## 🏗 Arquitetura da Solução

O projeto é estruturado em um monorepo composto por duas aplicações principais:

```mermaid
graph TD
    User([Usuário / Navegador]) -->|HTTPS / SPA| UI[Frontend React / Vite]
    UI -->|Firebase Auth SDK| FirebaseAuth[Firebase Authentication]
    UI -->|REST API + Bearer JWT| API[Backend Node.js / Express]
    
    subgraph Backend
        API -->|CRUD & Realtime State| FirebaseDB[(Firebase Realtime DB)]
        API -->|Envio de Resultados| SMTP[Servidor SMTP / Nodemailer]
        API -->|Consulta Resultados / Dezenas| CaixaAPI[APIs Loterias Caixa / Fallbacks]
        API -->|Cron a cada 1m| AutoSync[Rotina Auto Result Sync]
    end
```

---

## ⚙️ Backend (API)

Localizado no diretório `api/`, o backend é um serviço REST construído em **Node.js** com **TypeScript** e **Express**, focado em performance, tipagem estrita e arquitetura modular.

### Stack Tecnológica (API)

- **Runtime & Linguagem:** Node.js (v18+) e TypeScript 5.7
- **Framework Web:** Express 4.21
- **Empacotamento & Build:** `tsup`
- **Validação de Schemas:** `zod` e `@asteasolutions/zod-to-openapi`
- **Banco de Dados & Autenticação:** Firebase Admin SDK 13.9 (Realtime Database, Firebase Auth, Storage)
- **Comunicação por E-mail:** Nodemailer 10.2 + `marked` (renderização de templates Markdown para HTML)
- **Documentação:** Swagger UI Express e OpenAPI 3.0
- **Cliente HTTP:** Axios (com suporte a fallback e proxies)

### Estrutura de Diretórios (API)

```text
api/
├── src/
│   ├── core/                    # Núcleo da aplicação
│   │   ├── config/              # Configurações de CORS, app e variáveis de ambiente
│   │   ├── database/            # Inicialização e conexão do Firebase Admin
│   │   ├── docs/                # Gerador OpenAPI/Swagger e definições de schemas
│   │   ├── error/               # Classes e handlers globais de erro (AppError)
│   │   ├── middlewares/         # Middlewares globais (auth, admin, error-handler)
│   │   ├── routes/              # Registro de rotas globais (/health, /ping, /docs)
│   │   ├── utils/               # Utilitários (logger customizado, sanitizadores)
│   │   ├── app.ts               # Instância e configuração do Express
│   │   └── server.ts            # Entrypoint do servidor HTTP
│   ├── email/                   # Módulo de e-mails
│   │   ├── templates/           # Templates (resultado do bolão, etc.)
│   │   ├── connect.ts           # Configuração do transporte SMTP (Nodemailer)
│   │   └── markdownPlugin.ts    # Conversão de Markdown para HTML responsivo
│   ├── module/                  # Módulo principal de negócio (IAM & Bolões)
│   │   ├── actions/             # Controllers divididos por domínio (auth, sweepstake, etc.)
│   │   ├── middlewares/         # Middlewares de autorização específicos do módulo
│   │   ├── repositories/        # Camada de acesso a dados (Firebase Realtime Database)
│   │   ├── routes/              # Definição das rotas REST (/...)
│   │   └── services/            # Regras de negócio e rotinas em background
│   │       ├── autoResultSync/  # Rotina autônoma de sincronização pós-sorteio
│   │       ├── caixa/           # Integração resiliente com loterias Caixa
│   │       └── sweepstakeResultNotifier/ # Notificação por e-mail dos resultados
│   └── scripts/                 # Scripts de geração estática de Swagger e Postman
├── Dockerfile                   # Build multi-stage para produção
├── package.json
└── tsup.config.ts
```

### Autenticação e Permissões

- **Fluxo Híbrido:** O cliente autentica via Firebase Authentication no frontend e envia seu Firebase ID Token para a rota `POST /auth/sync`. O backend valida o token, sincroniza o usuário no banco de dados e emite um token JWT de sessão.
- **Controle de Acesso (RBAC):**
  - `authMiddleware`: Valida a presença e integridade do token JWT de sessão.
  - `adminMiddleware`: Garante que apenas usuários com `role: 'admin'` acessem recursos privilegiados (criar bolões, gerenciar cotistas, cadastrar jogos, alterar presets e usuários).

### Rotas e Endpoints REST

Todas as rotas de negócio são servidas sob o prefixo ``:

#### 1. Sistema e Health Check
| Método | Endpoint | Autenticação | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/ping` | Pública | Retorna `pong` (usado no healthcheck do Docker) |
| `GET` | `/health` | Pública | Status da API, modo de execução e versão |
| `GET` | `/docs` | Pública | Interface interativa do Swagger UI |

#### 2. Autenticação e Perfil
| Método | Endpoint | Autenticação | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/sync` | Pública (Firebase Token) | Sincroniza usuário autenticado e gera JWT de sessão |
| `GET` | `/auth/me` | Usuário | Obtém dados do usuário logado |
| `PATCH` | `/auth/me` | Usuário | Atualiza perfil (nome, telefone, dados pix) |

#### 3. Gestão de Bolões (`/sweepstakes`)
| Método | Endpoint | Permissão | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/sweepstakes` | Usuário | Lista bolões disponíveis e status de participação |
| `POST` | `/sweepstakes` | Admin | Cria um novo bolão |
| `GET` | `/sweepstakes/:id/details` | Admin | Detalhes completos, participantes, cotas e jogos |
| `POST` | `/sweepstakes/:id/join` | Usuário | Participa adquirindo cotas de um bolão |
| `POST` | `/sweepstakes/:id/participations/manual` | Admin | Adiciona participação manual (off-line / Pix direto) |
| `PATCH` | `/sweepstakes/:id/participations/:participationId` | Admin | Atualiza cota ou status de pagamento |
| `DELETE` | `/sweepstakes/:id/participations/:participationId` | Admin | Remove uma participação |
| `POST` | `/sweepstakes/:id/participations/:participationId/send-result-email` | Admin | Reenvia e-mail de resultado individual |
| `PATCH` | `/sweepstakes/:id/games` | Admin | Cadastra ou atualiza os jogos/dezenas do bolão |
| `PATCH` | `/sweepstakes/:id/result` | Admin | Define manualmente o resultado/dezenas sorteadas |
| `PATCH` | `/sweepstakes/:id` | Admin | Edita informações gerais do bolão |
| `DELETE` | `/sweepstakes/:id` | Admin | Remove o bolão e suas participações |

#### 4. Modelos e Predefinições (`/presets`)
| Método | Endpoint | Permissão | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/presets` | Admin | Lista modelos pré-configurados de bolões |
| `POST` | `/presets` | Admin | Cria novo preset |
| `PATCH` | `/presets/:id` | Admin | Edita um preset |
| `DELETE` | `/presets/:id` | Admin | Remove um preset |

#### 5. Usuários e Administração (`/users`)
| Método | Endpoint | Permissão | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | Admin | Lista todos os usuários cadastrados |
| `PATCH` | `/users/:id` | Admin | Atualiza permissão (`admin`/`user`) e status |
| `DELETE` | `/users/:id` | Admin | Remove cadastro de usuário |

#### 6. Loterias Caixa (`/lotteries`)
| Método | Endpoint | Permissão | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/lotteries` | Admin | Lista todas as modalidades suportadas |
| `GET` | `/lotteries/:type` | Admin | Consulta concurso atual ou específico de uma loteria |

#### 7. Logs e Auditoria (`/logs`)
| Método | Endpoint | Permissão | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/logs` | Usuário/Admin | Auditoria de eventos do sistema, erros e ações |

### Serviços e Rotinas Automáticas

#### Sincronização Automática de Resultados (`autoResultSync`)
- Executada automaticamente a cada **1 minuto** em segundo plano.
- Identifica bolões com sorteio já ocorrido (com tolerância de 15 minutos).
- Consulta a API da Caixa para obter as dezenas apuradas.
- Em caso de indisponibilidade ou resultado ainda não homologado, realiza até **6 tentativas** automáticas com intervalos de **10 minutos**, registrando o histórico de cada tentativa no banco de dados.
- Ao obter as dezenas, salva o resultado oficial no bolão e dispara automaticamente a rotina de envio de e-mails para todos os participantes.

#### Provedores de Loterias e Resiliência (`caixa`)
- Suporta 9 modalidades oficiais: Mega-Sena, Lotofácil, Quina, Lotomania, Dupla Sena, Timemania, Dia de Sorte, +Milionária e Federal.
- Sistema multi-provedor com fallback automático:
  1. `loteriascaixa` (API primária rápida)
  2. `caixa` (API oficial da CEF)
  3. `guidi` (Provedor alternativo de contingência)
- Cache em memória de **5 minutos** para evitar requisições redundantes.
- Suporte a servidores Proxy (`CAIXA_PROXY` / `HTTPS_PROXY`) para contornar restrições de IP e bloqueios de infraestrutura.

#### Notificador de Resultados (`sweepstakeResultNotifier`)
- Gera e-mails dinâmicos com a tabela de jogos apostados, destacando as dezenas acertadas por jogo, quantidade de cotas adquiridas pelo usuário, valor investido, total arrecadado e premiação apurada.

### Documentação da API

- **Swagger UI:** Acesse `http://localhost:80/docs` (ou porta configurada) no navegador.
- **Gerar especificações offline:**
  ```bash
  npm run docs:swagger --prefix api   # Gera swagger.json
  npm run docs:postman --prefix api   # Gera coleção Postman v2.1
  ```

---

## 💻 Frontend (UI)

Localizado no diretório `ui/`, o frontend é uma Single Page Application (SPA) moderna, ágil e responsiva, desenvolvida com **React 19**, **TypeScript** e **Vite**.

### Stack Tecnológica (UI)

- **Framework & Build:** React 19 + TypeScript + Vite 6
- **Interface e Componentes:** Material UI (MUI v7) + Emotion / Styled Components
- **Gerenciamento de Estado:** Zustand 5
- **Roteamento:** React Router DOM 7 (`createBrowserRouter`)
- **Formulários e Máscaras:** React Hook Form 7 + React IMask
- **Datas:** Dayjs + `@mui/x-date-pickers`
- **Feedback & Toasts:** React Toastify
- **Autenticação:** Firebase SDK 12 (Google Auth e Email/Senha)

### Estrutura de Diretórios (UI)

```text
ui/
├── src/
│   ├── assets/              # Logos, ícones e ilustrações
│   ├── components/          # Componentes reutilizáveis
│   │   ├── emptyState/      # Exibição de listas vazias
│   │   ├── gridBackground/  # Fundo animado com grade moderna
│   │   ├── header/          # Barra de navegação superior e perfil
│   │   ├── modal/           # Modal padrão estilizado
│   │   ├── pageContainer/   # Layout base com espaçamento padronizado
│   │   ├── protectedRoute/  # Controle de acesso por rotas
│   │   ├── quotaProgress/   # Barra de progresso de preenchimento de cotas
│   │   ├── sweepstakeTimeline/ # Linha do tempo visual do bolão
│   │   ├── table/           # Tabelas estilizadas com ordenação e paginação
│   │   └── themeToggle/     # Botão seletor de tema Dark/Light
│   ├── config/              # Variáveis e configurações padrão
│   ├── hooks/               # Custom hooks globais
│   ├── lib/                 # Integrações externas (Firebase Client SDK)
│   ├── pages/               # Páginas da aplicação
│   │   ├── adminLogs/       # Central de auditoria e logs do sistema
│   │   ├── home/            # Painel do usuário e bolões ativos
│   │   ├── login/           # Tela de autenticação e registro
│   │   ├── presets/         # Gerenciamento de presets (Admin)
│   │   ├── sweepstakeDetails/ # Detalhes do bolão, jogos e participantes
│   │   ├── sweepstakes/     # Listagem e gestão de bolões (Admin)
│   │   ├── userLogs/        # Histórico de atividades do usuário
│   │   └── users/           # Gerenciamento de usuários e permissões (Admin)
│   ├── router.tsx           # Configuração de rotas e proteção
│   ├── services/            # Serviços de integração HTTP com a API
│   │   ├── api/             # Instância Axios com fila de reautenticação
│   │   ├── auth/            # Sincronização e perfil
│   │   ├── sweepstakes/     # Operações de bolões
│   │   └── ...
│   ├── stores/              # Stores globais Zustand (auth, system)
│   ├── theme/               # Tema Material UI, paleta de cores e modo escuro
│   └── types/               # Tipagens TypeScript compartilhadas
├── nginx.conf               # Configuração Nginx com fallback SPA para Docker
├── Dockerfile               # Build multi-stage com Nginx
├── package.json
└── vite.config.ts
```

### Páginas e Fluxos do Usuário

1. **Autenticação (`/login`):** Login e cadastro via e-mail e senha ou login social com o Google.
2. **Dashboard / Home (`/`):**
   - Resumo do perfil do usuário e atalho para completar informações pendentes (como chave Pix e WhatsApp).
   - Carrossel de bolões em andamento com modal interativo para aquisição de cotas.
3. **Gestão de Bolões (`/sweepstakes` - Admin):**
   - Criação assistida de novos bolões a partir de dados da Caixa ou preenchimento manual.
   - Listagem com chips de status (aberto, encerrado, aguardando apuração, finalizado).
4. **Detalhes do Bolão (`/sweepstakes/:id`):**
   - Card resumo com datas de encerramento, sorteio, valor de cota e arrecadação.
   - Gerenciamento de jogos (cadastro e conferência das dezenas apostadas).
   - Tabela de participantes com controle de cotas, pagamentos e reenvio de e-mails de apuração.
   - Painel de status da sincronização com a Caixa Econômica Federal.
5. **Modelos de Bolão (`/presets` - Admin):** Criação de formatos padronizados para criação ágil de bolões recorrentes.
6. **Usuários (`/users` - Admin):** Listagem de membros e alteração de privilégios (`user` / `admin`).
7. **Auditoria (`/admin/logs` e `/my-logs`):** Acompanhamento de eventos do sistema, tentativas de consulta de loteria e transações.

### Sistema de Temas e Design

O sistema possui uma identidade visual personalizada com suporte nativo a **Light Mode** e **Dark Mode** (com detecção automática da preferência do sistema operacional e alternância manual):

| Nome da Cor | Hex | Uso Principal |
| :--- | :--- | :--- |
| **Deep Lilac** | `#624CAB` | Cor Primária Main |
| **Cornflower Blue** | `#7189FF` | Primária Light / Estados de Hover |
| **Wisteria Blue** | `#758ECD` | Secundária Main |
| **Icy Blue** | `#A0DDFF` | Secundária Light |
| **Periwinkle** | `#C1CEFE` | Secundária Dark |

### Gerenciamento de Estado e Cliente HTTP

- **Zustand:** Armazena o estado do usuário logado e o token JWT de forma reativa.
- **Axios Interceptor com Fila de Espera:** Em caso de expiração do token (HTTP 401), o cliente intercepta a requisição, renova silenciosamente as credenciais junto ao Firebase Auth e reexecuta todas as requisições enfileiradas (`processQueue`), sem interromper a navegação do usuário.

---

## 🔐 Configuração de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto (ou utilize variáveis injetadas na VPS/Dokploy). O arquivo `.env.example` traz os valores de referência:

```bash
# ========================================================
# Configurações Gerais & Rede (API)
# ========================================================
PORT=80
NODE_ENV=production
ENV=production
CORS_ORIGIN=https://alvaradasorte.odutra.com
CORS_ALLOWED_ORIGINS=https://alvaradasorte.odutra.com
JWT_SECRET=sua-chave-secreta-jwt-para-producao

# ========================================================
# Firebase Admin SDK (Backend)
# ========================================================
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://seu-projeto-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com

# ========================================================
# Serviço de E-mail (Nodemailer / SMTP)
# ========================================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_FROM="Alvará da Sorte <no-reply@alvaradasorte.odutra.com>"

# ========================================================
# Consulta de Loterias e Proxy (Caixa)
# ========================================================
LOTTERY_API_PROVIDER=loteriascaixa
LOTTERY_DISABLE_PROXY=true
# CAIXA_PROXY=http://10.0.1.32:3128
# HTTPS_PROXY=http://10.0.1.32:3128

# ========================================================
# Frontend (Vite Build Arguments)
# ========================================================
VITE_BASE_URL=https://api.alvaradasorte.odutra.com
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-firebase
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- **Node.js** v18 ou superior instalado.
- **npm** instalado.
- Projeto configurado no **Firebase Console** (com Authentication e Realtime Database habilitados).

### Instalação

Na raiz do repositório, instale as dependências de todo o monorepo:

```bash
# Instala dependências da API e da UI
npm --prefix api install
npm --prefix ui install
```

### Execução em Desenvolvimento

Você pode rodar a API e o Frontend simultaneamente em paralelo a partir da raiz com um único comando:

```bash
# Executa API e UI em paralelo com prefixos e cores formatadas
npm run dev
```

Caso prefira rodar os serviços em terminais separados:

```bash
# Terminal 1: Iniciar a API em modo watch
npm run dev:api

# Terminal 2: Iniciar a UI (Vite dev server)
npm run dev:ui
```

Ou navegando até a pasta de cada módulo:

- **API:** `cd api && npm run dev` (disponível em `http://localhost:3000` ou porta configurada)
- **UI:** `cd ui && npm run dev` (disponível em `http://localhost:5173`)

### Comandos Úteis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia Backend e Frontend simultaneamente via `concurrently` |
| `npm run dev:api` | Inicia apenas o servidor de desenvolvimento da API |
| `npm run dev:ui` | Inicia apenas o servidor de desenvolvimento da UI |
| `npm run build` | Executa o build de produção da API e da UI |
| `npm run build:api` | Compila o backend com `tsup` para `api/dist` |
| `npm run build:ui` | Checa tipos com `tsc` e gera os estáticos da UI em `ui/dist` |
| `npm run docs:swagger` | Atualiza o arquivo Swagger OpenAPI da API |
| `npm run check --prefix ui` | Valida tipagem TypeScript do frontend |
| `npm run lint --prefix ui` | Executa análise de lint do frontend |

---

## 🐳 Deploy com Docker e Dokploy

O projeto está totalmente preparado para deploy contínuo em VPS utilizando o **Dokploy** ou **Docker Compose** padrão.

O arquivo `docker-compose.yml` na raiz gerencia os dois serviços:

1. **`api`:**
   - Baseado na imagem `node:18-alpine` com build multi-stage.
   - Expõe a porta interna `80`.
   - Possui healthcheck automatizado verificando `http://localhost:80/ping`.
   - Servidores DNS públicos configurados (`8.8.8.8` e `1.1.1.1`) para garantir conectividade estável com as APIs da Caixa.

2. **`ui`:**
   - Build estático do Vite injetando variáveis de ambiente em tempo de compilação (`ARG VITE_*`).
   - Servido por uma imagem leve `nginx:stable-alpine` com suporte completo a roteamento SPA (`try_files $uri /index.html;`).
   - Dependência com verificação de integridade da API (`condition: service_healthy`).

### Executando com Docker Compose

```bash
# Subir toda a infraestrutura em segundo plano
docker compose up -d --build

# Acompanhar os logs
docker compose logs -f

# Parar os serviços
docker compose down
```

---

## 📄 Licença e Autoria

Desenvolvido por **[odutradev](https://github.com/odutradev)**.
Distribuído sob licença proprietária. Todos os direitos reservados.

