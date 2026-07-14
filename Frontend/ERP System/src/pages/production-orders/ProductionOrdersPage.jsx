import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productionOrderService } from '@/features/productionOrders/services/productionOrderService';
import { SearchBar } from '@/features/shared/components/SearchBar';
import { DataTable } from '@/features/shared/components/DataTable';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/features/shared/components/PageHeader';
import { ar, STATUS_LABELS } from '@/constants/ar';

const columns = [
  { key: 'orderNumber', header: ar.productionOrders.orderNumber, sortable: true },
  { key: 'companyName', header: ar.common.company, sortable: true },
  { key: 'productName', header: ar.common.product, sortable: true },
  { key: 'quantity', header: ar.productionOrders.quantity, sortable: true },
  { key: 'status', header: ar.common.status, sortable: true },
  { key: 'orderDate', header: ar.productionOrders.orderDate, sortable: true },
  { key: 'expectedDeliveryDate', header: ar.productionOrders.dueDate, sortable: true },
  { key: 'actions', header: ar.common.actions, className: 'w-[120px]' },
];

const statusOptions = [
  { value: 'pending', label: STATUS_LABELS.pending },
  { value: 'approved', label: STATUS_LABELS.approved },
  { value: 'montage', label: STATUS_LABELS.montage },
  { value: 'printing', label: STATUS_LABELS.printing },
  { value: 'finishing', label: STATUS_LABELS.finishing },
  { value: 'completed', label: STATUS_LABELS.completed },
  { value: 'shipped', label: STATUS_LABELS.shipped },
  { value: 'delivered', label: STATUS_LABELS.delivered },
  { value: 'cancelled', label: STATUS_LABELS.cancelled },
];

export default function ProductionOrdersPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    company: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await productionOrderService.getAll();
      setData(result);
    } catch (error) {
      console.error('Error fetching production orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredData = data
    .filter((order) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(term) ||
          order.companyName.toLowerCase().includes(term) ||
          order.productName.toLowerCase().includes(term)
        );
      }
      return true;
    })
    .filter((order) => {
      if (filters.status && order.status !== filters.status) return false;
      if (filters.company && order.companyId !== Number(filters.company)) return false;
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        const orderDate = new Date(order.orderDate);
        if (orderDate < fromDate) return false;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        const orderDate = new Date(order.orderDate);
        if (orderDate > toDate) return false;
      }
      return true;
    });

  const renderActions = (order) => (
    <div className="flex space-x-2">
      <button
        onClick={() => navigate(`/production-orders/${order.id}`)}
        className="text-sm text-primary-600 hover:text-primary-800"
      >
        {ar.common.view}
      </button>
      <button
        onClick={() => navigate(`/production-orders/edit/${order.id}`)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        {ar.common.edit}
      </button>
      <button
        onClick={() => {
          if (window.confirm(`هل أنت متأكد من حذف أمر الإنتاج ${order.orderNumber}؟`)) {
            productionOrderService.delete(order.id).then(() => {
              alert(ar.common.deletedSuccessfully);
              loadData();
            });
          }
        }}
        className="text-sm text-red-600 hover:text-red-800"
      >
        {ar.common.delete}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={ar.productionOrders.title}
        description={ar.productionOrders.description}
        breadcrumb={[{ label: ar.nav.productionOrders }]}
        actions={
          <Button onClick={() => navigate('/production-orders/create')}>
            {ar.productionOrders.add}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SearchBar
          placeholder={ar.productionOrders.search}
          onSearch={handleSearch}
        />
        <div>
          <label className="block text-sm font-medium mb-1">{ar.productionOrders.filterStatus}</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{ar.common.all}</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{ar.productionOrders.filterCompany}</label>
          <select
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{ar.common.all}</option>
            {/* We would need to fetch companies here, but for now we'll leave it empty or hardcode a few */}
            {/* In a real app, we would load companies from companyService */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{ar.productionOrders.filterDateRange}</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {loading && data.length === 0 ? (
        <div className="text-center py-12">
          {ar.common.loading}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          loading={loading}
          searchable={false} // We have our own search
        />
      )}
    </div>
  );
}