// src/pages/production-orders/ProductionOrderDetailPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productionOrderService } from '@/features/productionOrders/services/productionOrderService';
import { companyService } from '@/features/companies/services/companyService';
import { productService } from '@/features/products/services/productService';
import { paperService } from '@/features/materials/services/paperService';
import { materialService } from '@/features/materials/services/materialService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/PageHeader';
import { ar } from '@/constants/ar';
import { PRODUCTION_STATUS, statusLabels, statusColors } from '@/features/productionOrders/components/ProductionOrderForm';

export default function ProductionOrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const [paper, setPaper] = useState(null);
  const [inks, setInks] = useState([]);
  const [chemicals, setChemicals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // اتأكد إن الـ id رقم مش كلمة "create"
        if (isNaN(id) || id === 'create' || id === 'edit') {
          navigate('/production-orders');
          return;
        }

        const orderData = await productionOrderService.getById(id);
        if (orderData) {
          setOrder(orderData);

          const [companyData, productData, paperData, allMaterials] = await Promise.all([
            orderData.companyId ? companyService.getById(orderData.companyId) : Promise.resolve(null),
            orderData.productId ? productService.getById(orderData.productId) : Promise.resolve(null),
            orderData.paperId ? paperService.getById(orderData.paperId) : Promise.resolve(null),
            materialService.getAll(),
          ]);

          setCompany(companyData);
          setProduct(productData);
          setPaper(paperData);

          const allInks = allMaterials.filter(m => m.type === 'INK');
          const allChemicals = allMaterials.filter(m => m.type === 'CHEMICAL');

          const filteredInks = orderData.inkIds?.length
            ? allInks.filter(i => orderData.inkIds.includes(i.id))
            : [];
          const filteredChemicals = orderData.chemicalIds?.length
            ? allChemicals.filter(c => orderData.chemicalIds.includes(c.id))
            : [];

          setInks(filteredInks);
          setChemicals(filteredChemicals);
        } else {
          alert('أمر الإنتاج غير موجود');
          navigate('/production-orders');
        }
      } catch (error) {
        console.error('Error fetching production order:', error);
        alert('حدث خطأ أثناء جلب البيانات');
        navigate('/production-orders');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) return <div className="text-center py-12">{ar.common.loading}</div>;
  if (!order) return <div className="text-center py-12">أمر الإنتاج غير موجود</div>;

  const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800';
  const statusLabel = statusLabels[order.status] || order.status;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`تفاصيل أمر الإنتاج #${order.id}`}
        description={`الحالة: ${statusLabel}`}
        breadcrumb={[
          { label: 'أوامر الإنتاج', href: '/production-orders' },
          { label: `#${order.id}` }
        ]}
        actions={
          <Button onClick={() => navigate('/production-orders')} variant="outline">
            العودة للقائمة
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات أساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><span className="font-medium">رقم الأمر: </span>#{order.id}</div>
            <div><span className="font-medium">الكمية: </span>{order.quantity}</div>
            <div>
              <span className="font-medium">الحالة: </span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <div><span className="font-medium">تاريخ الإنشاء: </span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</div>
            <div><span className="font-medium">آخر تحديث: </span>{order.updatedAt ? new Date(order.updatedAt).toLocaleString() : '-'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الشركة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {company ? (
              <>
                <div><span className="font-medium">الاسم: </span>{company.name}</div>
                {company.email && <div><span className="font-medium">البريد الإلكتروني: </span>{company.email}</div>}
                {company.phone && <div><span className="font-medium">الهاتف: </span>{company.phone}</div>}
              </>
            ) : <span className="text-gray-500">لا توجد بيانات</span>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المنتج</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {product ? (
              <>
                <div><span className="font-medium">الاسم: </span>{product.productName}</div>
                {product.productCode && <div><span className="font-medium">الكود: </span>{product.productCode}</div>}
                {product.category && <div><span className="font-medium">التصنيف: </span>{product.category}</div>}
              </>
            ) : <span className="text-gray-500">لا توجد بيانات</span>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الورق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paper ? (
              <>
                <div><span className="font-medium">النوع: </span>{paper.paperType || paper.name || '-'}</div>
                {paper.width && <div><span className="font-medium">العرض: </span>{paper.width}</div>}
                {paper.height && <div><span className="font-medium">الارتفاع: </span>{paper.height}</div>}
                {paper.weight && <div><span className="font-medium">الوزن: </span>{paper.weight}</div>}
              </>
            ) : <span className="text-gray-500">لا توجد بيانات</span>}
          </CardContent>
        </Card>
      </div>

      {inks.length > 0 && (
        <Card>
          <CardHeader><CardTitle>الأحبار</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {inks.map((ink) => (
                <li key={ink.id} className="border-b pb-2">
                  <div className="font-medium">{ink.name || ink.inkType}</div>
                  {ink.inkType && Array.isArray(ink.inkType) && (
                    <div className="text-sm text-gray-600">الأنواع: {ink.inkType.join(', ')}</div>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {chemicals.length > 0 && (
        <Card>
          <CardHeader><CardTitle>المواد الكيميائية</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {chemicals.map((chemical) => (
                <li key={chemical.id} className="border-b pb-2">
                  <div className="font-medium">{chemical.name || chemical.chemicalType}</div>
                  {chemical.chemicalType && Array.isArray(chemical.chemicalType) && (
                    <div className="text-sm text-gray-600">الأنواع: {chemical.chemicalType.join(', ')}</div>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>الكميات المطلوبة</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><span className="font-medium">الأوراق المطلوبة: </span>{order.requiredSheets || 0}</div>
            <div><span className="font-medium">المواد الكيميائية المطلوبة: </span>{order.requiredChemicals || 0}</div>
            <div><span className="font-medium">الأحبار المطلوبة: </span>{order.requiredInks || 0}</div>
          </div>
        </CardContent>
      </Card>

      {order.description && (
        <Card>
          <CardHeader><CardTitle>الوصف</CardTitle></CardHeader>
          <CardContent><p className="whitespace-pre-wrap">{order.description}</p></CardContent>
        </Card>
      )}
    </div>
  );
}