# MultiStepForm Component

O `MultiStepForm` é o motor principal de formulários da aplicação. Ele é **config-driven** (orientado a configuração), o que significa que toda a UI, validação, fluxo e lógica reativa são definidos através de um objeto JSON/TypeScript, sem a necessidade de escrever JSX manualmente.

Construído sobre o `react-hook-form` e `react-imask`, ele oferece suporte nativo a máscaras, formatação monetária/percentual, renderização condicional complexa, modais embutidos, buscas tabulares e em árvore, além de um DevTools integrado.

## Integração Básica

```tsx
import MultiStepForm from '@core/components/multiStepForm';
import type { FormConfig } from '@core/components/multiStepForm/types';

const myFormConfig: FormConfig = {
  formStyle: 'simple',
  steps: [
    {
      id: 'step-1',
      title: 'Informações Básicas',
      actions: [
        { actionType: 'next', label: 'Próximo', variant: 'contained' }
      ],
      groups: [
        {
          title: 'Dados Pessoais',
          gridColumns: 2,
          fields: [
            { name: 'fullName', label: 'Nome Completo', type: 'text', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: true }
          ]
        }
      ]
    }
  ]
};

const MyPage = () => {
  const defaultData = {
    fullName: 'João Silva',
    email: 'joao@email.com'
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log(data);
  };

  return (
    <MultiStepForm
      config={myFormConfig}
      initialData={defaultData}
      onSubmit={handleSubmit}
    />
  );
};
```

## Propriedades do Componente (MultiStepFormProps)

| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `config` | `FormConfig` | `-` | Objeto de configuração principal contendo steps, grupos e campos. |
| `onSubmit` | `(data: Record<string, unknown>) => void` | `-` | Função disparada ao executar uma ação do tipo `submit`. |
| `initialData` | `Record<string, unknown>` | `{}` | Objeto opcional para pré-preenchimento (valores default) dos campos do formulário. |

## Estrutura de Configuração

### FormConfig
| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `steps` | `FormStep[]` | `-` | Array de etapas do formulário. |
| `fieldPreSets` | `Record<string, Partial<FormField>>` | `undefined` | Dicionário de configurações pré-definidas para reutilização nos campos usando a prop `preSet`. |
| `formStyle` | `'simple' \| 'collapsed'` | `'simple'` | Define o estilo de renderização dos grupos de campos. |

### FormStep
| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `-` | Identificador único da etapa. |
| `title` | `string` | `-` | Título exibido no indicador de progresso (Stepper). |
| `groups` | `FormGroup[]` | `-` | Agrupamentos lógicos de campos dentro desta etapa. |
| `actions` | `FormAction[]` | `-` | Botões de ação exibidos no final da etapa (ex: Próximo, Voltar, Enviar). |
| `conditionalRender` | `(context: ActionContext) => boolean` | `() => true` | Função que determina se a etapa inteira deve ser exibida. |
| `testData` | `Record<string, unknown>` | `undefined` | Dados mockados utilizados pelo DevTools para preenchimento automático. |

### FormGroup
| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `undefined` | Título do grupo de campos. |
| `fields` | `FormField[]` | `-` | Lista de campos que compõem este grupo. |
| `subGroups` | `FormGroup[]` | `undefined` | Subdivisões aninhadas dentro do grupo principal. |
| `gridColumns` | `number` | `Auto` | Número de colunas no grid (padrão responsivo se não informado). |
| `highlight` | `boolean` | `false` | Se `true`, adiciona um estilo de destaque (borda tracejada) ao grupo (apenas estilo `simple`). |
| `collapsible` | `boolean` | `true` | Permite expandir/recolher o grupo (apenas estilo `collapsed`). |
| `seamless` | `boolean` | `false` | Remove bordas do subgrupo (apenas em `subGroups`). |
| `conditionalRender` | `(context: ActionContext) => boolean` | `() => true` | Função que determina se o grupo deve ser exibido. |

### FormField (O Coração do Formulário)
Define o comportamento, aparência e regras de cada input.

| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `-` | Nome do campo no objeto de estado do `react-hook-form`. |
| `label` | `string` | `undefined` | Rótulo exibido para o usuário. |
| `type` | `string` | `'text'` | Tipo: `'text' \| 'number' \| 'email' \| 'select' \| 'autocomplete' \| 'info' \| 'date' \| 'button' \| 'table' \| 'currency' \| 'percentage' \| 'divider' \| 'file'`. |
| `required` | `boolean \| Function` | `false` | Torna o preenchimento obrigatório (suporta callback condicional). |
| `disabled` | `boolean \| Function` | `false` | Desabilita a interação com o campo. |
| `readOnly` | `boolean \| Function` | `false` | Torna o campo apenas leitura (útil para campos auto-preenchidos). |
| `colSpan` | `number` | `1` | Quantidade de colunas que o campo ocupa no grid do grupo. |
| `newRow` | `boolean` | `false` | Força a quebra de linha no grid. |
| `preSet` | `string` | `undefined` | Chave referenciando um objeto em `FormConfig.fieldPreSets` para herdar configurações. |
| `mask` | `string \| RegExp` | `undefined` | Padrão de máscara usando `react-imask` (ex: `'000.000.000-00'`). |
| `options` | `FieldOption[] \| Function`| `[]` | Usado quando `type: 'select'` ou `'autocomplete'`. Array contendo `{ label: string, value: string }`. |
| `multiple` | `boolean` | `false` | Habilita seleção múltipla em `select` ou `autocomplete`. |
| `freeSolo` | `boolean` | `false` | Permite digitação livre não atrelada às opções em `autocomplete`. |
| `validation` | `FieldValidation` | `undefined` | Objeto contendo `pattern` (Regex string) e `message` para validação customizada. |
| `icon` | `string` | `undefined` | Nome de um ícone do Material UI para exibir no campo (ex: `'Search'`). |
| `tooltip` | `string` | `undefined` | Ícone de "i" com popover explicativo ao lado da label. |
| `disableFuture` | `boolean` | `false` | Impede seleção de datas futuras (usado apenas se `type: 'date'`). |
| `disablePast` | `boolean` | `false` | Impede seleção de datas passadas (usado apenas se `type: 'date'`). |
| `minDate` | `string` | `undefined` | Data mínima permitida (formato YYYY-MM-DD). |
| `maxDate` | `string` | `undefined` | Data máxima permitida (formato YYYY-MM-DD). |
| `buttonVariant` | `string` | `'contained'` | Variante do botão (`'contained' \| 'outlined' \| 'text'`) quando `type: 'button'`. |
| `onButtonClick` | `(context: ActionContext) => void` | `undefined` | Ação executada quando `type: 'button'`. |
| `onChange` | `(value: unknown, ctx: ActionContext) => void`| `undefined` | Hook acionado na alteração do valor. Ideal para atualizar outros campos dinamicamente. |
| `conditionalRender` | `(context: ActionContext) => boolean` | `() => true` | Função que determina se o campo específico deve ser renderizado. |
| `searchConfig` | `SearchConfig` | `undefined` | Configuração para abrir um Modal de Busca associado ao campo. |
| `formModalConfig` | `FormModalConfig` | `undefined` | Configuração de formulário aninhado (geralmente usado em botões). |
| `tableColumns` | `TableColumn[]` | `undefined` | Usado quando `type: 'table'`. Define as colunas da tabela interna. |
| `tableData` | `Record<string, unknown>[]` | `[]` | Dados estáticos da tabela (ignorado se o campo já tiver dados no state). |
| `tableActions` | `TableAction[]` | `undefined` | Ações por linha da tabela (gera um menu "MoreVert"). |
| `renderRowDetail` | `Function` | `undefined` | Função que retorna ReactNode para expandir linhas da tabela. |
| `tableRowFilter`| `Function` | `undefined` | Função para filtrar localmente os dados exibidos na tabela. |

### SearchConfig (Modal de Busca)
Configuração para campos que abrem um modal de pesquisa ao clicar na lupa ou pressionar Enter.

| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `-` | Título exibido no topo do modal. |
| `fields` | `FormField[]` | `-` | Campos de filtro renderizados no topo do modal de busca. |
| `columns` | `SearchResultColumn[]` | `-` | Configuração das colunas exibidas na listagem (quando `viewMode: 'table'`). |
| `viewMode` | `'table' \| 'tree'` | `'table'` | Define se a exibição dos resultados será em tabela convencional ou em estrutura de árvore. |
| `pagination` | `boolean` | `false` | Habilita a paginação na visualização em tabela. |
| `autoSearchOnOpen` | `boolean` | `true` | Se `true`, executa a busca automaticamente ao abrir o modal, mesmo sem filtros iniciais. |
| `treeConfig` | `TreeConfig` | `undefined` | Obrigatório se `viewMode: 'tree'`. Configura as chaves de leitura da árvore. |
| `initialFilterName` | `string` | `undefined` | Nome do campo de filtro que receberá o valor inicialmente digitado no input antes de abrir o modal. |
| `onSearch` | `(filters: Record<string, unknown>) => Promise<Record<string, unknown>[]>` | `-` | Função que realiza a busca na API e retorna os dados. |
| `onSelect` | `(item: Record<string, unknown>, context: ActionContext) => void` | `-` | Ação executada ao selecionar um item na lista de resultados. |

### TreeConfig (Para SearchConfig com viewMode 'tree')
| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `valueKey` | `string` | `-` | Chave no objeto de dados que representa o ID/Valor do nó. |
| `labelKey` | `string` | `-` | Chave no objeto de dados que representa o texto/nome a ser exibido. |
| `childrenKey` | `string` | `-` | Chave no objeto de dados que contém o array de filhos recursivos. |

### TableColumn & TableAction (Para type 'table')
| Entidade | Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `TableColumn` | `header` | `string` | `-` | Título da coluna. |
| `TableColumn` | `key` | `string` | `-` | Chave de leitura no objeto de dados. |
| `TableColumn` | `format` | `Function` | `undefined` | Função opcional para formatar a célula `(row, contextData) => ReactNode`. |
| `TableAction` | `label` | `string` | `-` | Rótulo da ação. |
| `TableAction` | `icon` | `string` | `undefined` | Ícone do Material UI. |
| `TableAction` | `onClick` | `Function` | `-` | Ação executada ao clicar no item do menu da tabela. |

### FormModalConfig (Modais Internos)
| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `-` | Título do modal. |
| `fields` | `FormField[]` | `-` | Campos renderizados dentro do modal. |
| `gridColumns` | `number` | `2` | Número de colunas CSS Grid no modal. |
| `getInitialValues`| `Function` | `undefined` | `(context) => Record`: Injeta valores iniciais no modal baseado no estado global. |
| `onConfirm` | `Function` | `-` | `(values, context) => void`: Ação ao salvar o modal. |
| `onCancel` | `Function` | `undefined` | `(context) => void`: Ação opcional ao cancelar o modal. |

### FormAction
Botões renderizados no rodapé do Step.

| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `-` | Texto do botão. |
| `actionType` | `'next' \| 'prev' \| 'submit' \| 'custom'` | `-` | Comportamento nativo do botão (Avançar step, recuar, submeter form). |
| `variant` | `'contained' \| 'outlined' \| 'text'` | `'contained'` | Estilo visual do botão (MUI). |
| `disabled` | `boolean \| Function` | `false` | Permite desativar o botão (suporta callback com ActionContext). |
| `onClick` | `(context: ActionContext) => Promise<boolean \| void>` | `undefined` | Ação customizada. Se retornar `false`, interrompe a execução do `actionType`. |

### ActionContext
Este objeto é injetado em todas as funções de callback (`conditionalRender`, `onChange`, `onClick`, `onSelect`). Ele permite interagir com o estado global do formulário de forma isolada e segura.

| Método / Propriedade | Descrição |
| :--- | :--- |
| `data` | Objeto contendo todos os valores atuais do formulário (reativo no `conditionalRender`). |
| `getValues` | `(payload?: string \| string[]) => unknown` - Retorna valores sem causar re-render. |
| `getParentValues` | `(payload?) => unknown` - (Apenas dentro de FormModal) Obtém os valores do formulário pai. |
| `setValue` | `(name: string, value: unknown) => void` - Define o valor de um campo específico. |
| `setMultipleValues` | `(values: Record<string, unknown>, clearErrors?: boolean) => void` - Atualiza vários campos simultaneamente. |
| `setError` | Força um erro de validação em um campo. |
| `clearErrors` | Limpa erros de validação de um ou mais campos. |

## Recursos Avançados e Comportamentos

### Renderização Condicional Inteligente (Auto-clear)
Qualquer Step, Group, SubGroup ou Field possui a função `conditionalRender?: (context) => boolean`.

Se um campo/grupo oculto possuía dados preenchidos, o sistema **automaticamente**:
1. Remove o valor do campo do estado interno.
2. Limpa quaisquer erros de validação residuais atrelados a ele.

Isso garante que lixo computacional não seja enviado para a API.

### Interceptando Fluxos de Navegação
Use a função `onClick` na configuração de `actions`. Se for necessário validar uma API externa antes de avançar para a próxima etapa ou submeter o formulário, retorne `false` para impedir o avanço:

```tsx
actions: [
  {
    actionType: 'next',
    label: 'Avançar',
    onClick: async (ctx) => {
      const isDisponivel = await api.checkDocument(ctx.getValues('cpf'));
      if (!isDisponivel) {
        ctx.setError('cpf', { type: 'manual', message: 'CPF inválido ou já existe' });
        return false; // Cancela a transição
      }
      return true;
    }
  }
]
```

### Upload de Arquivos (FileUpload)
Quando o `type: 'file'` for utilizado, o componente exibe uma interface interativa que aceita anexos (com validação de `required` visual). Ele permite ao usuário inserir uma `description` adicional para o arquivo e armazena no estado do formulário um objeto do tipo: `{ file: File, description: string }`.

### DevTools Integrado
Pressione as teclas `Ctrl` + `Shift` + `Q` em qualquer tela contendo o componente para ativar as ferramentas de desenvolvedor embutidas.

- **Preenchimento Automático:** Injeta dados definidos na propriedade `testData` dos Steps para acelerar os testes.
- **Limpeza Rápida:** Botões para zerar o estado global ou de etapas específicas.
- **Inspeção JSON:** Permite visualizar o payload atual em tempo real e o Schema tipado esperado de todo o formulário.