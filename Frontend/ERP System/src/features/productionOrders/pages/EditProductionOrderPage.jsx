import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productionOrderService } from '@/features/productionOrders/services/productionOrderService';
import { ProductionOrderForm } from '@/features/productionOrders/components/ProductionOrderForm';
import { PageHeader } from '@/features/shared/components/PageHeader';
import { Button } from '@/components/ui/button';
import { ar } from '@/constants/ar';

export default function EditProductionOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const order = await productionOrderService.getById(id);
        if (order) {
          // Convert dates to YYYY-MM-DD format for the input type="date"
          const formattedOrder = {
            ...order,
            orderDate: order.orderDate.split('T')[0],
            expectedDeliveryDate: order.expectedDeliveryDate.split('T')[0],
          };
          setInitialData(formattedOrder);
        } else {
          alert(ar.common.notFound);
          navigate('/production-orders');
        }
      } catch (error) {
        console.error('Error fetching production order:', error);
        alert(ar.common.errorOccurred);
        navigate('/production-orders');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-12">{ar.common.loading}</div>;
  if (!initialData) return <div className="text-center py-12">{ar.common.notFound}</div>;

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await productionOrderService.update(id, data);
      await productionOrderService.getAll(); // Refresh list
      alert(ar.common.updatedSuccessfully);
      navigate(`/production-orders/${id}`);
    } catch (error) {
      console.error('Error updating production order:', error);
      alert(ar.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={ar.productionOrders.editTitle}
        description={ar.productionOrders.editDescription}
        breadcrumb=[
          { label: ar.nav.productionOrders, href: '/production-orders' },
          { label: `${ar.productionOrders.editTitle} #${initialData.orderNumber}` }
        ]
        actions={
          <>
            <Button onClick={() => navigate(`/production-orders/${id}`)} variant="outline">
              {ar.common.view}
            </Button>
            <Button onClick={() => navigate('/production-orders')} variant="outline">
              {ar.common.backToList}
            </Button>
          </>
        }
      />
      <ProductionOrderForm onSubmit={handleSubmit} defaultValues={initialData} />
    </div>
  );
}