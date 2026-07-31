// src/pages/production-orders/ProductionOrdersPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productionOrderService } from '@/features/productionOrders/services/productionOrderService';
import { companyService } from '@/features/companies/services/companyService';
import { productService } from '@/features/products/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/features/shared/components/PageHeader';
import { ar } from '@/constants/ar';
import ProductionOrderForm from '@/features/productionOrders/components/ProductionOrderForm';
import { PRODUCTION_STATUS, statusLabels, statusColors } from '@/features/productionOrders/components/ProductionOrderForm';

export default function ProductionOrdersPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [companiesRes, productsRes, ordersRes] = await Promise.all([
        companyService.getAll(),
        productService.getAll(),
        productionOrderService.getAll()
      ]);

      setCompanies(companiesRes || []);
      setProducts(productsRes || []);

      const mappedOrders = (ordersRes || []).map(order => ({
        ...order,
        companyName: order.companyId
          ? (companiesRes || []).find(c => c.id === order.companyId)?.name || ''
          : '',
        productName: order.productId
          ? (productsRes || []).find(p => p.id === order.productId)?.productName || ''
          : ''
      }));

      setData(mappedOrders);
    } catch (error) {
      console.error('Error fetching production orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((order) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(order.id).includes(term) ||
      order.companyName.toLowerCase().includes(term) ||
      order.productName.toLowerCase().includes(term)
    );
  });

  const handleCreate = () => {
    setEditingOrder(null);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOrder(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`هل أنت متأكد من حذف أمر الإنتاج رقم ${id}؟`)) {
      try {
        await productionOrderService.delete(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting production order:', error);
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingOrder) {
        await productionOrderService.update(editingOrder.id, data);
      } else {
        await productionOrderService.create(data);
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving production order:', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={ar.productionOrders?.title || 'أوامر الإنتاج'}
        description={ar.productionOrders?.description || 'إدارة أوامر الإنتاج'}
        breadcrumb={[{ label: ar.nav?.productionOrders || 'أوامر الإنتاج' }]}
        actions={
          <Button 
            type="button"
            onClick={handleCreate}
          >
            {ar.productionOrders?.add || 'إضافة أمر إنتاج'}
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="relative w-full sm:w-64">
        <Input
          type="search"
          placeholder={ar.productionOrders?.search || 'بحث في أوامر الإنتاج...'}
          value={searchTerm}
          onChange={handleSearch}
          className="pl-9"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-right">#ID</th>
                <th className="px-4 py-3 text-right">{ar.common.company}</th>
                <th className="px-4 py-3 text-right">{ar.common.product}</th>
                <th className="px-4 py-3 text-right">{ar.productionOrders.quantity}</th>
                <th className="px-4 py-3 text-right">{ar.common.status}</th>
                <th className="px-4 py-3 text-right">{ar.common.created}</th>
                <th className="px-4 py-3 text-center">{ar.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    {ar.common.loading}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد أوامر إنتاج'}
                  </td>
                </tr>
              ) : (
                filteredData.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3">{order.companyName || '-'}</td>
                    <td className="px-4 py-3">{order.productName || '-'}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/production-orders/${order.id}`)}
                        >
                          عرض
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(order)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDelete(order.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">
                {editingOrder ? 'تعديل أمر إنتاج' : 'إضافة أمر إنتاج جديد'}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <ProductionOrderForm
              order={editingOrder}
              onSubmit={handleSubmit}
              loading={formLoading}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}