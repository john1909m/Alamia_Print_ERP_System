import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { FilterBar } from '@/components/ui/filter-bar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFetchData } from '@/hooks/useFetchData'
import { purchaseService } from '@/features/purchases/services/purchaseService'
import { PurchaseForm } from '@/features/purchases/components/PurchaseForm'
import { PurchaseStatusBadge } from '@/features/purchases/components/PurchaseStatusBadge'
import { PurchaseInformationCard } from '@/features/purchases/components/PurchaseInformationCard'
import { SupplierCard } from '@/features/purchases/components/SupplierCard'
import { PurchaseSummary } from '@/features/purchases/components/PurchaseSummary'
import { suppliersMockData } from '@/features/purchases/mock/purchasesData'
import { ar } from '@/constants/ar'

export default function PurchasesPage() {
  const navigate = useNavigate()
  const { purchaseId } = useParams()
  const { data, loading, refetch } = useFetchData(purchaseService.getAll)
  const [statusFilter, setStatusFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [saving, setSaving] = useState(false)

  const suppliers = suppliersMockData

  const filteredData = useMemo(() => {
    return data.filter((purchase) => {
      if (statusFilter !== 'all' && purchase.status !== statusFilter) return false
      if (supplierFilter !== 'all' && purchase.supplierId !== Number(supplierFilter)) return false
      if (dateFilter && purchase.purchaseDate !== dateFilter) return false
      return true
    })
  }, [data, dateFilter, statusFilter, supplierFilter])

  const selectedPurchaseDetails = useMemo(() => {
    return data.find((purchase) => purchase.id === Number(purchaseId)) || null
  }, [data, purchaseId])

  const openCreate = () => {
    setSelectedPurchase(null)
    setModalOpen(true)
  }

  const openEdit = (purchase) => {
    setSelectedPurchase(purchase)
    setModalOpen(true)
  }

  const handleSubmit = async (values) => {
    setSaving(true)
    try {
      if (selectedPurchase) {
        await purchaseService.update(selectedPurchase.id, values)
      } else {
        await purchaseService.create(values)
      }
      await refetch()
      setModalOpen(false)
      setSelectedPurchase(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPurchase) return
    await purchaseService.delete(selectedPurchase.id)
    await refetch()
    setDeleteOpen(false)
    setSelectedPurchase(null)
  }

  const columns = [
    { key: 'purchaseNumber', header: ar.purchases.orderNumber, sortable: true },
    { key: 'supplierName', header: ar.purchases.supplier, sortable: true },
    { key: 'purchaseDate', header: ar.purchases.date, sortable: true },
    { key: 'items', header: ar.purchases.items, sortable: true, render: (row) => row.items?.length || 0 },
    {
      key: 'grandTotal',
      header: ar.purchases.total,
      sortable: true,
      render: (row) => (row.items || []).reduce((sum, item) => sum + Number(item.totalPrice || 0), 0).toLocaleString('ar-SA'),
    },
    {
      key: 'status',
      header: ar.common.status,
      render: (row) => <PurchaseStatusBadge status={row.status} />,
    },
    { key: 'createdAt', header: ar.common.created, sortable: true },
    {
      key: 'actions',
      header: ar.common.actions,
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate(`/purchases/${row.id}`)}>
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => { setSelectedPurchase(row); setDeleteOpen(true) }}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  if (purchaseId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Purchase Details"
          description="Detailed view of the selected purchase order"
          breadcrumb={[{ label: ar.nav.purchases }, { label: selectedPurchaseDetails?.purchaseNumber || 'Purchase' }]}
        />
        {selectedPurchaseDetails ? (
          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <PurchaseInformationCard purchase={selectedPurchaseDetails} />
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="py-2">Material</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2">Unit</th>
                            <th className="py-2">Unit Price</th>
                            <th className="py-2">Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedPurchaseDetails.items || []).map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="py-3">{item.materialName}</td>
                              <td className="py-3">{item.quantity}</td>
                              <td className="py-3">{item.unit}</td>
                              <td className="py-3">{item.unitPrice?.toLocaleString('ar-SA')}</td>
                              <td className="py-3">{item.totalPrice?.toLocaleString('ar-SA')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <SupplierCard supplier={suppliers.find((supplier) => supplier.id === selectedPurchaseDetails.supplierId)} />
                <PurchaseSummary items={selectedPurchaseDetails.items || []} />
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{selectedPurchaseDetails.notes || 'No notes available.'}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">No purchase selected.</CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={ar.purchases.title}
        description={ar.purchases.description}
        breadcrumb={[{ label: ar.nav.purchases }]}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {ar.purchases.add}
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4 sm:p-6">
          <FilterBar className="flex-col items-stretch md:flex-row md:items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-full md:w-55">
                <SelectValue placeholder="Filter by supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All suppliers</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id.toString()}>{supplier.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full md:w-45" />
          </FilterBar>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        searchPlaceholder={ar.purchases.search}
        searchKeys={['purchaseNumber', 'supplierName']}
        stickyHeader
        showPageSizeSelector={false}
        pageSize={8}
      />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete purchase"
        description="Are you sure you want to delete this purchase?"
        onConfirm={handleDelete}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
          <div className="mx-auto max-w-6xl rounded-xl bg-background p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedPurchase ? 'Edit Purchase' : 'Create Purchase'}</h2>
                <p className="text-sm text-muted-foreground">{selectedPurchase ? 'Update purchase details and items.' : 'Create a new purchase order for your materials.'}</p>
              </div>
              <Button variant="outline" onClick={() => { setModalOpen(false); setSelectedPurchase(null) }}>
                Close
              </Button>
            </div>
            <PurchaseForm defaultValues={selectedPurchase} onSubmit={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  )
}
