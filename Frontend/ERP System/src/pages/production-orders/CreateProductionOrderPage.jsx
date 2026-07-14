import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productionOrderService } from '@/features/productionOrders/services/productionOrderService';
import { ProductionOrderForm } from '@/features/productionOrders/components/ProductionOrderForm';
import { PageHeader } from '@/features/shared/components/PageHeader';
import { Button } from '@/components/ui/button';
import { ar } from '@/constants/ar';

export default function CreateProductionOrderPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await productionOrderService.create(data);
      await productionOrderService.getAll(); // Refresh list
      alert(ar.productionOrders.createdSuccessfully);
      navigate('/production-orders');
    } catch (error) {
      console.error('Error creating production order:', error);
      alert(ar.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={ar.productionOrders.createTitle}
        description={ar.productionOrders.createDescription}
        breadcrumb={[
          { label: ar.nav.productionOrders, href: '/production-orders' },
          { label: ar.productionOrders.createTitle }
        ]}
        actions={
          <Button onClick={() => navigate('/production-orders')}>
            {ar.common.backToList}
          </Button>
        }
      />
      <ProductionOrderForm onSubmit={handleSubmit} />
    </div>
  );
}