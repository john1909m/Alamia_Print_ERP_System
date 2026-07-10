import { FilterBar } from '@/components/ui/filter-bar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ar, MATERIAL_TYPE_LABELS, STATUS_LABELS } from '@/constants/ar'

export function MaterialFilters({ typeFilter, statusFilter, onTypeChange, onStatusChange }) {
  return (
    <FilterBar>
      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder={ar.materials.filterType} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{ar.materials.allTypes}</SelectItem>
          {Object.entries(MATERIAL_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder={ar.materials.filterStatus} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{ar.materials.allStatuses}</SelectItem>
          <SelectItem value="in-stock">{STATUS_LABELS['in-stock']}</SelectItem>
          <SelectItem value="low-stock">{STATUS_LABELS['low-stock']}</SelectItem>
          <SelectItem value="out-of-stock">{STATUS_LABELS['out-of-stock']}</SelectItem>
        </SelectContent>
      </Select>
    </FilterBar>
  )
}
