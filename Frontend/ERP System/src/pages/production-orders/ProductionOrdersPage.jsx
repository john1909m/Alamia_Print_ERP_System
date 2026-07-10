import { ListPage, StatusBadge } from '@/components/common/ListPage'
import { useFetchData } from '@/hooks/useFetchData'
import { productionService } from '@/services/productionService'
import { ar } from '@/constants/ar'

const columns = [
  { key: 'orderNumber', header: ar.productionOrders.orderNumber, sortable: true },
  { key: 'product', header: ar.productionOrders.product, sortable: true },
  { key: 'company', header: ar.productionOrders.company, sortable: true },
  { key: 'quantity', header: ar.productionOrders.quantity, sortable: true },
  {
    key: 'status',
    header: ar.common.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'dueDate', header: ar.productionOrders.dueDate, sortable: true },
]

export default function ProductionOrdersPage() {
  const { data, loading } = useFetchData(productionService.getAll)

  return (
    <ListPage
      title={ar.productionOrders.title}
      description={ar.productionOrders.description}
      breadcrumb={[{ label: ar.nav.productionOrders }]}
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder={ar.productionOrders.search}
      searchKeys={['orderNumber', 'product', 'company']}
      addLabel={ar.productionOrders.add}
    />
  )
}
