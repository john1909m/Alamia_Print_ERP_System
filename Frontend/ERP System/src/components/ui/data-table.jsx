import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SearchInput } from '@/components/ui/search-input'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { TableSkeleton } from '@/components/ui/skeleton'
import { DEFAULT_PAGE_SIZE } from '@/constants/app'
import { ar } from '@/constants/ar'
import { cn } from '@/utils/cn'

export function DataTable({
  columns = [],
  data = [],
  loading = false,
  searchable = true,
  searchPlaceholder = ar.common.search,
  searchKeys = [],
  pagination = true,
  pageSize: initialPageSize = DEFAULT_PAGE_SIZE,
  stickyHeader = false,
  showPageSizeSelector = true,
  emptyTitle = ar.common.noData,
  emptyDescription = ar.common.noDataDescription,
  actions,
  className,
}) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const filteredData = useMemo(() => {
    if (!search.trim()) return data
    const query = search.toLowerCase()
    return data.filter((row) =>
      searchKeys.length > 0
        ? searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(query))
        : Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(query)),
    )
  }, [data, search, searchKeys])

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {(searchable || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {searchable && (
            <SearchInput
              placeholder={searchPlaceholder}
              value={search}
              onChange={handleSearchChange}
              className="sm:max-w-xs"
            />
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={5} columns={columns.length || 4} />
            </div>
          ) : paginatedData.length === 0 ? (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          ) : (
            <div className={cn('overflow-x-auto', stickyHeader && 'max-h-[520px] overflow-y-auto')}>
              <table className="w-full text-sm">
                <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>
                  <tr className="border-b bg-muted/50">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={cn(
                          'px-4 py-3 text-start font-medium text-muted-foreground',
                          col.sortable && 'cursor-pointer select-none hover:text-foreground',
                          col.className,
                        )}
                        onClick={() => col.sortable && handleSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.header}
                          {col.sortable && <SortIcon columnKey={col.key} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, rowIndex) => (
                    <tr key={row.id ?? rowIndex} className="border-b transition-colors hover:bg-muted/30">
                      {columns.map((col) => (
                        <td key={col.key} className={cn('px-4 py-3', col.className)}>
                          {col.render ? col.render(row) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {pagination && !loading && paginatedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={showPageSizeSelector ? handlePageSizeChange : undefined}
        />
      )}
    </div>
  )
}
