import { StatusBadge } from '@/components/common/ListPage'
import { TableActions } from '@/components/common/TableActions'
import { ar } from '@/constants/ar'

export function DashboardTable({ orders }) {
  const columns = [
    { key: 'orderNumber', label: ar.productionOrders.orderNumber },
    { key: 'company', label: ar.productionOrders.company },
    { key: 'product', label: ar.productionOrders.product },
    { key: 'quantity', label: ar.productionOrders.quantity },
    { key: 'status', label: ar.common.status },
    { key: 'createdAt', label: ar.dashboard.createdDate },
    { key: 'actions', label: ar.common.actions },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-start text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b transition-colors last:border-0 hover:bg-muted/20"
            >
              <td className="px-4 py-3.5 font-medium">{order.orderNumber}</td>
              <td className="px-4 py-3.5 text-muted-foreground">{order.company}</td>
              <td className="px-4 py-3.5">{order.product}</td>
              <td className="px-4 py-3.5 tabular-nums">
                {order.quantity.toLocaleString('ar-SA')}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3.5 text-muted-foreground tabular-nums">
                {order.createdAt}
              </td>
              <td className="px-4 py-3.5">
                <TableActions onEdit={() => {}} onDelete={() => {}} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
