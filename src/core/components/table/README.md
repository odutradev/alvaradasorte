# Table Component

O `Table` é o motor principal de listagens de dados da aplicação. Projetado com flexibilidade e padronização visual, ele atua como um *facade* inteligente, operando em dois modos arquiteturais: **Manual** (onde a interface consome propriedades estritas de estado controladas externamente) e **Auto** (onde a tabela assume o ciclo de vida completo de requisição, paginação e filtros através do hook `usePagination`).

Ele oferece suporte nativo a menus de ações contextuais por linha, cabeçalhos ricos em funcionalidades, estados vazios e de carregamento padronizados, além de integração direta com o `MultiStepForm` para renderização de Filtros Avançados automáticos.

## Integração Básica (Modo Manual)

No modo manual, você fornece os dados, meta-informações de paginação e lida com os eventos de troca de página ou filtro explicitamente.

```tsx
import type { TableColumn, TableAction } from '@core/components/table/types'
import Table from '@core/components/table'

const MyManualPage = () => {
  const columns: TableColumn<UserData>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nome do Usuário' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span>{row.status}</span>
    }
  ]

  const actions: TableAction<UserData>[] = [
    {
      label: 'Editar',
      onClick: (row) => console.log(row.id)
    }
  ]

  const data = [{ id: 1, name: 'João Silva', status: 'Ativo' }]

  const meta = { total: 1, perPage: 10, currentPage: 1, lastPage: 1 }

  return (
    <Table
      onLimitChange={(limit) => handleLimit(limit)}
      onPageChange={(page) => handlePage(page)}
      headerTitle="Usuários do Sistema"
      isLoading={false}
      columns={columns}
      actions={actions}
      data={data}
      meta={meta}
    />
  )
}
```

## Integração Automática (Modo Auto)

O modo Auto exige apenas a configuração da propriedade `paginationProps`. A tabela instancia o `usePagination` internamente, conectando-se a uma `action` (criada via `createAction`), extraindo automaticamente os dados, meta-informações, estado de carregamento e assinando os eventos de mudança.

```tsx
import { listUsers } from '@shareds/iam/actions/users'
import Table from '@core/components/table'

const MyAutoPage = () => {
  const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'E-mail' }
  ]

  return (
    <Table
      paginationProps={{
        action: listUsers,
        initialLimit: 10
      }}
      headerTitle="Listagem Automática"
      columns={columns}
    />
  )
}
```

## Propriedades Base do Componente (BaseTableProps)

Estas propriedades estão disponíveis em **ambos** os modos (Auto e Manual).

| Propriedade | Tipo | Padrão | Descrição | 
| :--- | :--- | :--- | :--- | 
| `columns` | `TableColumn<T>[]` | **Obrigatório** | Definição das colunas, chaves de leitura e funções de formatação. | 
| `actions` | `TableAction<T>[]` | `undefined` | Ações de linha gerando um menu *MoreVert* ao final de cada registro. | 
| `headerTitle` | `string` | `'Registros'` | Título principal exibido no cabeçalho da tabela. | 
| `headerButtons` | `TableButton[]` | `undefined` | Botões de ação globais renderizados no canto superior direito. | 
| `filtersConfig` | `TableFiltersConfig` | `undefined` | Configuração (via `FormGroup[]`) gerando um formulário de filtro em modal. | 
| `totalItems` | `number` | `undefined` | Força a exibição de um total específico no *badge* ao lado do título. | 
| `disableHeader` | `boolean` | `false` | Remove completamente o cabeçalho superior (título, filtros, botões). | 
| `headerContent` | `ReactNode` | `undefined` | Slot para injeção de componentes customizados no cabeçalho. | 
| `footerContent` | `ReactNode` | `undefined` | Slot para injeção de componentes customizados no rodapé. | 
| `footerPosition` | `'left' \| 'right'` | `'left'` | Posição de alinhamento do `footerContent`. | 

## Propriedades Exclusivas (Modo Manual vs Auto)

A tabela utiliza *Discriminated Unions* no TypeScript. Você deve respeitar as chaves de um modo específico. O uso da propriedade `paginationProps` converte automaticamente a tabela para o modo **Auto**.

### Modo Manual (ManualTableProps)

| Propriedade | Tipo | Descrição | 
| :--- | :--- | :--- | 
| `data` | `T[]` | Array de registros a serem listados. | 
| `meta` | `PaginatedMeta` | Dados de paginação contendo total, página atual e limite. | 
| `isLoading` | `boolean` | Alterna a opacidade da listagem e exibe indicador de progresso. | 
| `onPageChange` | `(page: number) => void` | Evento disparado pela navegação da paginação. | 
| `onLimitChange` | `(limit: number) => void` | Evento disparado ao alterar os itens por página. | 
| `onFilterChange` | `(filters: FiltersRecord) => void` | Disparado ao aplicar resultados no modal de Filtros. | 
| `onReload` | `() => void` | Habilita o ícone de atualização no cabeçalho e define sua ação. | 
| `activeFilters` | `FiltersRecord` | Dicionário de filtros atualmente ativos (controla o badge visual). | 

### Modo Auto (AutoTableProps)

| Propriedade | Tipo | Descrição | 
| :--- | :--- | :--- | 
| `paginationProps` | `UsePaginationProps<T>` | Propriedades injetadas no hook genérico de requisição. A tabela resolve os dados e eventos automaticamente conectando-se à `action`. | 

## Estrutura de Configuração (Objetos e Interfaces)

### UsePaginationProps (Para o Modo Auto)

Quando operando no modo automático, a propriedade `paginationProps` recebe este objeto para orquestrar o estado e as chamadas de API.

| Campo | Tipo | Padrão | Descrição | 
| :--- | :--- | :--- | :--- | 
| `action` | `Function` | **Obrigatório** | Função de requisição assíncrona, preferencialmente gerada pelo `createAction`. Deve estar preparada para receber filtros e retornar um payload paginado. | 
| `initialFilters` | `FiltersRecord` | `{}` | Estado inicial para os filtros aplicados à tabela antes da primeira requisição. | 
| `fetchOnMount` | `boolean` | `true` | Determina se a tabela deve buscar os dados automaticamente ao ser renderizada na tela. | 
| `initialLimit` | `number` | `10` | Quantidade de itens carregados por página na primeira requisição. | 
| `initialPage` | `number` | `1` | Índice da página inicial no momento da montagem do componente. | 

### TableColumn

Define como os dados são extraídos e renderizados.

| Campo | Tipo | Padrão | Descrição | 
| :--- | :--- | :--- | :--- | 
| `key` | `keyof T \| string` | **Obrigatório** | Chave de leitura no objeto da linha (ex: `'status'`). | 
| `header` | `string` | **Obrigatório** | Título exibido no `<TableHead>`. | 
| `render` | `(row: T) => ReactNode` | `undefined` | Ignora a exibição padrão por string e renderiza JSX customizado. | 

### TableAction

Define as opções que aparecem ao clicar nos três pontos (MoreVert) de cada linha.

| Campo | Tipo | Padrão | Descrição | 
| :--- | :--- | :--- | :--- | 
| `label` | `string` | **Obrigatório** | Texto exibido no item de menu. | 
| `onClick` | `(row: T) => void` | **Obrigatório** | Função acionada ao clicar na ação. A linha correspondente é injetada. | 
| `icon` | `ReactNode` | `undefined` | Ícone a ser posicionado à esquerda do *label*. | 
| `disabled` | `(row: T) => boolean` | `undefined` | Permite desativar a ação com base em regras de negócio dos dados da linha. | 

### TableButton

Botões de cabeçalho global (ex: "Novo Registro", "Exportar").

| Campo | Tipo | Padrão | Descrição | 
| :--- | :--- | :--- | :--- | 
| `label` | `string` | **Obrigatório** | Texto do botão. | 
| `onClick` | `() => void` | **Obrigatório** | Ação global executada. | 
| `variant` | `'text' \| 'outlined' \| 'contained'` | `'outlined'` | Variante do MUI Button. | 
| `color` | `ColorOptions` | `'primary'` | Cor padrão do MUI Button. | 
| `disabled` | `boolean` | `false` | Desabilita o botão. | 
| `icon` | `ReactNode` | `undefined` | Ícone interno (injetado via `startIcon`). | 

## Recursos Avançados

### Integração de Filtros (TableFiltersConfig)

O componente possui o subcomponente estritamente integrado `TableFilters`. Quando você fornece a prop `filtersConfig` contendo um array de `FormGroup[]` (do `MultiStepForm`), um botão de funil aparece automaticamente no cabeçalho.
Ao ser clicado, ele renderiza dinamicamente um *Modal* com o formulário de pesquisa complexo. Ao ser submetido, emite dados higienizados para `onFilterChange` (Modo Manual) ou refaz a busca ativamente atualizando estados internos (Modo Auto).

#### Configurando Filtros (FormGroup)

A tipagem `TableFiltersConfig` é um *alias* para `FormGroup[]`. Isso significa que a declaração dos filtros segue a mesma arquitetura orientada a configuração (JSON/TypeScript) do motor de formulários da aplicação, garantindo padronização visual e reaproveitamento.

```tsx
import type { TableFiltersConfig } from '@core/components/table/types'

const userFilters: TableFiltersConfig = [
  {
    title: 'Dados Principais',
    gridColumns: 2,
    fields: [
      { name: 'search', label: 'Busca Textual', type: 'text' },
      {
        name: 'role',
        label: 'Perfil',
        type: 'select',
        options: [
          { label: 'Administrador', value: 'admin' },
          { label: 'Usuário', value: 'user' }
        ]
      }
    ]
  },
  {
    title: 'Período',
    gridColumns: 2,
    fields: [
      { name: 'startDate', label: 'Data Inicial', type: 'date' },
      { name: 'endDate', label: 'Data Final', type: 'date' }
    ]
  }
]
```

A propriedade `name` de cada campo inserido (`search`, `role`, `startDate`, etc.) torna-se exatamente a chave de envio para a API no objeto de paginação. O componente `TableFilters` também possui higienização automática: se um usuário limpar o formulário e enviar, chaves vazias ou com valor `undefined` são descartadas.

---

### Referência Completa da API de Filtros

Para que você não precise consultar outras documentações, abaixo estão os detalhes completos de configuração do `FormGroup` e seus atributos aninhados, projetados para a construção de filtros estáticos ou reativos.

#### 1. FormGroup
| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `undefined` | Título que agrupa uma seção de filtros. |
| `fields` | `FormField[]` | `-` | **Obrigatório.** Lista de inputs pertencentes a este grupo. |
| `gridColumns` | `number` | `Auto` | Define a quantidade de colunas do grid CSS deste grupo. |
| `conditionalRender`| `(ctx: ActionContext) => boolean` | `undefined` | Oculta o grupo de filtros inteiro baseado em outras seleções. O auto-clear removerá os dados deste grupo caso seja ocultado. |

#### 2. FormField (Os inputs de filtro)
| Campo | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `-` | **Obrigatório.** Nome do filtro. Será a chave enviada no JSON da requisição. |
| `label` | `string` | `undefined` | Rótulo (Label) do campo. |
| `type` | `string` | `'text'` | Tipos comuns para filtros: `'text' \| 'number' \| 'select' \| 'autocomplete' \| 'date'`. |
| `colSpan` | `number` | `1` | Espaço ocupado no grid. Ex: em um grid de 2 colunas, `colSpan: 2` ocupa a linha inteira. |
| `options` | `FieldOption[] \| Function`| `[]` | Opções de preenchimento obrigatórias se `type: 'select'` ou `'autocomplete'`. Array contendo `{ label: string, value: string }`. |
| `multiple` | `boolean` | `false` | Permite selecionar vários itens em um filtro tipo `'select'` ou `'autocomplete'`. |
| `icon` | `string` | `undefined` | Nome do ícone Material UI (ex: `'Search'`). |
| `disableFuture` | `boolean` | `false` | (Apenas em Datas) Impede seleção no futuro. |
| `onChange` | `(value, ctx: ActionContext) => void`| `undefined` | Callback disparado na mudança do filtro. Excelente para limpar "Filtro B" quando "Filtro A" muda. |
| `conditionalRender`| `(ctx: ActionContext) => boolean`| `() => true` | Renderiza condicionalmente o campo. Se retornar falso, o campo some e o valor é removido do state. |
| `searchConfig` | `SearchConfig` | `undefined` | Abre um Modal Complexo de Busca ao invés de um select simples (ideal para buscar em APIs grandes). |

#### 3. ActionContext (Reatividade)
Ao utilizar funções como `conditionalRender` ou `onChange`, o componente injeta a interface `ActionContext`, permitindo ler ou alterar o estado em tempo real dos filtros antes da submissão.

| Método / Propriedade | Descrição |
| :--- | :--- |
| `data` | Variável reativa com o estado atual. Use exclusivamente dentro do `conditionalRender`. |
| `getValues` | `(field?: string) => unknown`. Retorna os valores atuais para leitura (sem causar re-render, use dentro do `onChange`). |
| `setValue` | `(name: string, value: unknown) => void`. Força a alteração de um campo (Ex: apagar um campo filho se o pai for alterado). |
| `setMultipleValues`| `(values: Record<string, unknown>) => void`. Força a atualização em lote de vários campos do filtro. |