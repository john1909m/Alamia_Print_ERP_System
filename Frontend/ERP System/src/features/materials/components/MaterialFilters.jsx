import { FilterBar } from '@/components/ui/filter-bar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ar } from '@/constants/ar'
import { MATERIAL_TYPES } from '@/features/materials/utils/constants'

export function MaterialFilters({
  typeFilter,
  onTypeChange,
  filterTypes, // prop passed from parent
}) {
  // Default filterTypes if not provided (for safety)
  const defaultFilterTypes = [
    { value: 'all', label: ar.materials.allTypes },
    ...MATERIAL_TYPES.map((t) => ({
      value: t.value.toLowerCase(),
      label: t.label,
    })),
  ]
  const types = filterTypes || defaultFilterTypes

  return (
    <FilterBar>
      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder={ar.materials.filterType} />
        </SelectTrigger>
        <SelectContent>
          {types.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FilterBar>
  )
}