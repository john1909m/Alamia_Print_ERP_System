import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productionOrderService } from '@/features/productionOrders/services/productionOrderService';
import { companyService } from '@/features/companies/services/companyService';
import { productService } from '@/features/products/services/productService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, MapPin, Truck, Loader2, Check, Users, Edit } from 'lucide-react';
import { ar } from '@/constants/ar';
import { Separator } from '@/components/ui/separator';

export default function ProductionOrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const orderData = await productionOrderService.getById(id);
        if (orderData) {
          setOrder(orderData);
          const [companyData, productData] = await Promise.all([
            orderData.companyId ? companyService.getById(orderData.companyId) : Promise.resolve(null),
            orderData.productId ? productService.getById(orderData.productId) : Promise.resolve(null),
          ]);
          setCompany(companyData);
          setProduct(productData);
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
  if (!order) return <div className="text-center py-12">{ar.common.notFound}</div>;

  // Define the workflow stages
  const workflowStages = [
    { id: 1, label: 'Pending', value: 'pending' },
    { id: 2, label: 'Approved', value: 'approved' },
    { id: 3, label: 'Montage', value: 'montage' },
    { id: 4, label: 'Printing', value: 'printing' },
    { id: 5, label: 'Finishing', value: 'finishing' },
    { id: 6, label: 'Completed', value: 'completed' },
    { id: 7, label: 'Shipped', value: 'shipped' },
    { id: 8, label: 'Delivered', value: 'delivered' },
  ];

  // Find current stage index
  const currentStageIndex = workflowStages.findIndex(
    (stage) => stage.value === order.status
  );
  const isCompleted = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  // Calculate progress percentage
  const progressPercent = ((currentStageIndex + 1) / workflowStages.length) * 100;

  // Determine if we can move to next stage
  const canMoveToNextStage =
    !isCompleted &&
    !isCancelled &&
    currentStageIndex < workflowStages.length - 1 &&
    order.status !== 'pending'; // Actually, we can move from pending to approved, etc.

  // Define status colors (we'll use the badge variants)
  const statusVariants = {
    pending: 'secondary',
    approved: 'warning',
    montage: 'info',
    printing: 'primary',
    finishing: 'info',
    completed: 'success',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'destructive',
  };

  return (
    <div className="space-y-8">
      {/* Order Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant={statusVariants[order.status] || 'secondary'}>
              {order.status}
            </Badge>
          </div>
        </div>
        <div className="text-right space-x-4">
          <Button
            onClick={() => navigate(`/production-orders/edit/${id}`)}
            variant="outline"
          >
            <Edit className="h-4 w-4 mr-2" />
            {ar.common.edit}
          </Button>
          {(!isCompleted && !isCancelled) && (
            <Button
              onClick={() => {
                if (window.confirm(`${ar.productionOrders.confirmCancel}`)) {
                  // TODO: Implement cancel
                  alert('Cancel functionality not implemented yet');
                }
              }}
              variant="destructive"
            >
              {ar.common.cancel}
            </Button>
          )}
        </div>
      </div>

      {/* Separator */}
      <Separator className="my-6" />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Info, Company, Product */}
        <div className="space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle>{ar.common.orderInformation}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="font-medium">{ar.productionOrders.orderDate}:</span>
                  <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium">{ar.productionOrders.dueDate}:</span>
                  <span>{new Date(order.expectedDeliveryDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium">{ar.productionOrders.quantity}:</span>
                  <span>{order.quantity.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium">{ar.common.notes}:</span>
                  <span>{order.notes || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          {company && (
            <Card>
              <CardHeader>
                <CardTitle>{ar.common.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">{ar.common.name}:</span>
                    <span>{company.name}</span>
                  </div>
                  <div>
                    <span className="font-medium">{ar.common.email}:</span>
                    <span>{company.email}</span>
                  </div>
                  <div>
                    <span className="font-medium">{ar.common.phone}:</span>
                    <span>{company.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium">{ar.common.city}:</span>
                    <span>{company.city}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Information */}
          {product && (
            <Card>
              <CardHeader>
                <CardTitle>{ar.common.product}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">{ar.common.name}:</span>
                    <span>{product.name}</span>
                  </div>
                  <div>
                    <span className="font-medium">{ar.common.sku}:</span>
                    <span>{product.sku}</span>
                  </div>
                  <div>
                    <span className="font-medium">{ar.common.category}:</span>
                    <span>{product.category}</span>
                  </div>
                  <div>
                    <span className="font-medium">{ar.common.status}:</span>
                    <span>{product.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle Column: Status Timeline and Progress */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{ar.productionOrders.statusTimeline}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflowStages.map((stage) => (
                <div key={stage.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full">
                    {status === stage.value ? (
                      <div className="w-4 h-4 bg-primary-600 rounded-full" />
                    ) : (
                      <>
                        {status === 'delivered' && stage.value === 'delivered' ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-dashed border-gray-300 rounded-full" />
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{stage.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {status === stage.value
                        ? 'Current stage'
                        : compareStatusOrder(status, stage.value) < 0
                        ? 'Completed'
                        : 'Upcoming'}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>{ar.common.progress}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-200">
                  {currentStageIndex + 1}/{workflowStages.length}
                </div>
                <div>
                  <p className="font-medium">
                    {`Step ${currentStageIndex + 1} of ${workflowStages.length}`}
                  </p>
                  <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                    <div
                      className={`bg-primary-600 h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Ticket Preview and Activity */}
        <div className="space-y-6">
          {/* Ticket Preview */}
          <Card>
            <CardHeader>
              <CardTitle>{ar.productionOrders.ticketPreview}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="border border-dashed p-6 rounded-lg">
                  <div className="space-y-3">
                    <div className="font-bold text-xl">{order.orderNumber}</div>
                    <div>
                      <span className="font-medium">{ar.common.company}:</span>
                      <span>{company?.name || '-'}</span>
                    </div>
                    <div>
                      <span className="font-medium">{ar.common.product}:</span>
                      <span>{product?.name || '-'}</span>
                    </div>
                    <div>
                      <span className="font-medium">{ar.productionOrders.quantity}:</span>
                      <span>{order.quantity.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">{ar.common.status}:</span>
                      <span>{order.status}</span>
                    </div>
                    <div>
                      <span className="font-medium">{ar.productionOrders.orderDate}:</span>
                      <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity History */}
          <Card>
            <CardHeader>
              <CardTitle>{ar.common.activityHistory}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mock activity data */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-200">
                    <Clock className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">{`${ar.common.orderCreated}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-200">
                    <CheckCircle className="w-4 h-4 text-success-500" />
                  </div>
                  <div>
                    <p className="font-medium">{`${ar.common.statusChanged} to ${order.status}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {order.notes && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-200">
                      <Edit className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">{`${ar.common.notesUpdated}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Actions */}
      {!isCompleted && !isCancelled && (
        <Card>
          <CardHeader>
            <CardTitle>{ar.productionOrders.statusActions}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => {
                  // Move to next status
                  const nextStage = workflowStages[currentStageIndex + 1];
                  if (nextStage) {
                    // TODO: Implement status update via service
                    alert(
                      `Moving to ${nextStage.label} - functionality not implemented yet`
                    );
                  }
                }}
                variant="primary"
                disabled={currentStageIndex >= workflowStages.length - 1}
              >
                {`${ar.productionOrders.moveToNextStage} (${
                  workflowStages[currentStageIndex + 1]?.label
                })`}
              </Button>
              {currentStageIndex > 0 && (
                <Button
                  onClick={() => {
                    // Here we would implement going back, but per requirements we don't allow moving backwards
                    alert(
                      `${ar.productionOrders.cannotMoveBack}: ${workflowStages[
                        currentStageIndex - 1
                      ].label}`
                    );
                  }}
                  variant="outline"
                >
                  {ar.common.goToPreviousStage}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to compare status order
function compareStatusOrder(statusA, statusB) {
  const order = [
    'pending',
    'approved',
    'montage',
    'printing',
    'finishing',
    'completed',
    'shipped',
    'delivered',
    'cancelled',
  ];
  return order.indexOf(statusA) - order.indexOf(statusB);
}