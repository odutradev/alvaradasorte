export type UserFiltersProps = {
  search: string
  role: string
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
  onClearFilters: () => void
}
