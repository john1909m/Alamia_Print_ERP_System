import { useMemo, useState } from 'react'
import { Package, TrendingDown, AlertTriangle, ShoppingCart, X } from 'lucide-react'
import { useFetchData } from '@/hooks/useFetchData'
import { inventoryService } from '@/features/inventory/services/inventoryService'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { FilterBar } from '@/components/ui/filter-bar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ar, TRANSACTION_TYPE_LABELS } from '@/constants/ar'

const transactionTypeVariants = {
  purchase: 'success',
  consumption: 'default',
  adjustment: 'warning',
  return: 'secondary',
}

export default function InventoryPage() {
  const { data: transactions, loading } = useFetchData(inventoryService.getAll)
  const [materialFilter, setMaterialFilter] = useState('all')
  const [transactionFilter, setTransactionFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  const materialInventory = useMemo(() => {
    const map = new Map()
    transactions.forEach((item) => {
      if (!map.has(item.materialName)) {
        map.set(item.materialName, {
          id: item.materialId,
          materialName: item.materialName,
          currentStock: item.currentStock,
          minStock: item.minStock,
          lastUpdated: item.date,
          type: item.materialType,
        })
      }
    })
    return Array.from(map.values())
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      if (materialFilter !== 'all' && item.materialName !== materialFilter) return false
      if (transactionFilter !== 'all' && item.transactionType !== transactionFilter) return false
      if (dateFrom && item.date < dateFrom) return false
      if (dateTo && item.date > dateTo) return false
      return true
    })
  }, [transactions, materialFilter, transactionFilter, dateFrom, dateTo])

  const lowStockCount = materialInventory.filter((item) => item.currentStock > 0 && item.currentStock <= item.minStock).length
  const outOfStockCount = materialInventory.filter((item) => item.currentStock <= 0).length
  const recentPurchases = transactions.filter((item) => item.transactionType === 'purchase').length
  const selectedMaterialTransactions = selectedMaterial
    ? transactions.filter((item) => item.materialName === selectedMaterial.materialName).slice(0, 5)
    : []

  const clearFilters = () => {
    setMaterialFilter('all')
    setTransactionFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  const columns = [
    {
      key: 'date',
      header: ar.inventory.date,
      sortable: true,
      render: (row) => row.date,
    },
    {
      key: 'materialName',
      header: ar.inventory.material,
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedMaterial(row)}
          className="text-start font-medium text-primary hover:underline"
        >
          {row.materialName}
        </button>
      ),
    },
    {
      key: 'transactionType',
      header: ar.inventory.transactionType,
      sortable: true,
      render: (row) => (
        <Badge variant={transactionTypeVariants[row.transactionType] || 'secondary'}>
          {TRANSACTION_TYPE_LABELS[row.transactionType] || row.transactionType}
        </Badge>
      ),
    },
    {
      key: 'quantity',
      header: ar.inventory.quantity,
      sortable: true,
      render: (row) => `${row.quantity}`,
    },
    { key: 'unit', header: ar.inventory.unit },
    { key: 'reference', header: ar.inventory.reference, sortable: true },
    { key: 'notes', header: ar.common.notes },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={ar.inventory.title}
        description={ar.inventory.description}
        breadcrumb={[{ label: ar.nav.inventory }]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title={ar.inventory.totalMaterials} value={materialInventory.length.toLocaleString('ar-SA')} icon={Package} />
        <StatsCard title={ar.inventory.lowStock} value={lowStockCount.toLocaleString('ar-SA')} icon={TrendingDown} changeType="warning" />
        <StatsCard title={ar.inventory.outOfStock} value={outOfStockCount.toLocaleString('ar-SA')} icon={AlertTriangle} changeType="negative" />
        <StatsCard title={ar.inventory.recentPurchases} value={recentPurchases.toLocaleString('ar-SA')} icon={ShoppingCart} changeType="positive" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <FilterBar className="flex-col items-stretch md:flex-row md:items-center">
                <Select value={materialFilter} onValueChange={setMaterialFilter}>
                  <SelectTrigger className="w-full md:w-55">
                    <SelectValue placeholder={ar.inventory.filterMaterial} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{ar.inventory.allMaterials}</SelectItem>
                    {materialInventory.map((item) => (
                      <SelectItem key={item.materialName} value={item.materialName}>
                        {item.materialName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                  <SelectTrigger className="w-full md:w-55">
                    <SelectValue placeholder={ar.inventory.filterType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{ar.inventory.allTypes}</SelectItem>
                    <SelectItem value="purchase">{TRANSACTION_TYPE_LABELS.purchase}</SelectItem>
                    <SelectItem value="consumption">{TRANSACTION_TYPE_LABELS.consumption}</SelectItem>
                    <SelectItem value="adjustment">{TRANSACTION_TYPE_LABELS.adjustment}</SelectItem>
                    <SelectItem value="return">{TRANSACTION_TYPE_LABELS.return}</SelectItem>
                  </SelectContent>
                </Select>

                <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="w-full md:w-45" />
                <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="w-full md:w-45" />
                <Button type="button" variant="outline" onClick={clearFilters}>
                  {ar.common.cancel}
                </Button>
              </FilterBar>
            </CardContent>
          </Card>

          <DataTable
            columns={columns}
            data={filteredTransactions}
            loading={loading}
            searchPlaceholder={ar.inventory.search}
            searchKeys={['materialName', 'reference', 'notes']}
            stickyHeader
            showPageSizeSelector={false}
            pageSize={8}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{ar.inventory.recentActivity}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredTransactions.slice(0, 5).map((item) => (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{item.materialName}</p>
                    <Badge variant={transactionTypeVariants[item.transactionType] || 'secondary'}>{TRANSACTION_TYPE_LABELS[item.transactionType] || item.transactionType}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-black/45">
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-background shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{ar.inventory.materialDetails}</p>
                <h2 className="mt-1 text-xl font-semibold">{selectedMaterial.materialName}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedMaterial(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">{ar.materials.currentStock}</p>
                  <p className="mt-2 text-2xl font-semibold">{selectedMaterial.currentStock}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">{ar.materials.minStock}</p>
                  <p className="mt-2 text-2xl font-semibold">{selectedMaterial.minStock}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{ar.inventory.recentTransactions}</h3>
                  <span className="text-sm text-muted-foreground">{selectedMaterialTransactions.length} {ar.common.units}</span>
                </div>
                <div className="mt-4 space-y-3">
                  {selectedMaterialTransactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{ar.common.noDataDescription}</p>
                  ) : (
                    selectedMaterialTransactions.map((item) => (
                      <div key={item.id} className="rounded-md border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{TRANSACTION_TYPE_LABELS[item.transactionType] || item.transactionType}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>
                        <p className="mt-2 text-sm font-medium">{item.quantity} {item.unit}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
