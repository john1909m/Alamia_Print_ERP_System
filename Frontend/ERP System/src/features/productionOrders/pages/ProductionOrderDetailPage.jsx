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
  
  // متغيرات الحساب
  const [maxLeaflets, setMaxLeaflets] = useState(0);
  const [bestFit, setBestFit] = useState(null);
  const [allAttempts, setAllAttempts] = useState([]);
  const [mixedAttempts, setMixedAttempts] = useState([]);
  const [leafletWidth, setLeafletWidth] = useState(0);
  const [leafletHeight, setLeafletHeight] = useState(0);
  const [paperWidth, setPaperWidth] = useState(0);
  const [paperHeight, setPaperHeight] = useState(0);

  // دالة حساب عدد النشرات في صف/عمود
  const calculateFit = (available, size) => {
    if (size <= 0) return 0;
    return Math.floor(available / size);
  };

  // ✅ دالة حساب التوزيع الذكي (زي المثال 27×8)
  const calculateSmartLayout = (leafletW, leafletH, paperW, paperH, margin = 0.4) => {
    const usableW = paperW - (margin * 2);
    const usableH = paperH - (margin * 2);
    
    if (usableW <= 0 || usableH <= 0) return { count: 0, layouts: [] };
    
    const layouts = [];
    let bestCount = 0;
    let bestLayout = null;
    
    // ✅ 1. التوزيع العادي (نشرة واقفة)
    const normalCols = Math.floor(usableW / leafletW);
    const normalRows = Math.floor(usableH / leafletH);
    const normalCount = normalCols * normalRows;
    
    layouts.push({
      type: 'عادي (واقفة)',
      cols: normalCols,
      rows: normalRows,
      count: normalCount,
      usedW: normalCols * leafletW,
      usedH: normalRows * leafletH,
      description: `${normalCols} × ${normalRows} = ${normalCount}`
    });
    
    if (normalCount > bestCount) {
      bestCount = normalCount;
      bestLayout = layouts[layouts.length - 1];
    }
    
    // ✅ 2. التوزيع العادي (نشرة نائمة - مدورة)
    const rotatedCols = Math.floor(usableW / leafletH);
    const rotatedRows = Math.floor(usableH / leafletW);
    const rotatedCount = rotatedCols * rotatedRows;
    
    layouts.push({
      type: 'عادي (نائمة)',
      cols: rotatedCols,
      rows: rotatedRows,
      count: rotatedCount,
      usedW: rotatedCols * leafletH,
      usedH: rotatedRows * leafletW,
      description: `${rotatedCols} × ${rotatedRows} = ${rotatedCount}`
    });
    
    if (rotatedCount > bestCount) {
      bestCount = rotatedCount;
      bestLayout = layouts[layouts.length - 1];
    }
    
    // ✅ 3. التوزيع الذكي (واقفة + نائمة في المساحة المتبقية)
    
    // 3.1: واقفة في النصف الأول + نائمة في النصف المتبقي (عمودي)
    const normalCols1 = Math.floor(usableW / leafletW);
    const normalRows1 = Math.floor(usableH / leafletH);
    const normalCount1 = normalCols1 * normalRows1;
    
    const remainingW = usableW - (normalCols1 * leafletW);
    
    if (remainingW > 0) {
      const rotatedCols1 = Math.floor(remainingW / leafletH);
      const rotatedRows1 = Math.floor(usableH / leafletW);
      const rotatedCount1 = rotatedCols1 * rotatedRows1;
      const total1 = normalCount1 + rotatedCount1;
      
      layouts.push({
        type: 'ذكي (واقفة في اليسار + نائمة في اليمين)',
        cols: normalCols1 + rotatedCols1,
        rows: Math.max(normalRows1, rotatedRows1),
        count: total1,
        usedW: (normalCols1 * leafletW) + (rotatedCols1 * leafletH),
        usedH: Math.max(normalRows1 * leafletH, rotatedRows1 * leafletW),
        description: `${normalCols1}×${normalRows1} (واقفة) + ${rotatedCols1}×${rotatedRows1} (نائمة) = ${total1}`,
        details: `النصف الأيسر: ${normalCols1}×${normalRows1} = ${normalCount1} | النصف الأيمن: ${rotatedCols1}×${rotatedRows1} = ${rotatedCount1}`
      });
      
      if (total1 > bestCount) {
        bestCount = total1;
        bestLayout = layouts[layouts.length - 1];
      }
    }
    
    // 3.2: واقفة في النصف الأول + نائمة في النصف المتبقي (أفقي)
    const normalRows2 = Math.floor(usableH / leafletH);
    const normalCols2 = Math.floor(usableW / leafletW);
    const normalCount2 = normalCols2 * normalRows2;
    
    const remainingH = usableH - (normalRows2 * leafletH);
    
    if (remainingH > 0) {
      const rotatedCols2 = Math.floor(usableW / leafletH);
      const rotatedRows2 = Math.floor(remainingH / leafletW);
      const rotatedCount2 = rotatedCols2 * rotatedRows2;
      const total2 = normalCount2 + rotatedCount2;
      
      layouts.push({
        type: 'ذكي (واقفة في الأعلى + نائمة في الأسفل)',
        cols: Math.max(normalCols2, rotatedCols2),
        rows: normalRows2 + rotatedRows2,
        count: total2,
        usedW: Math.max(normalCols2 * leafletW, rotatedCols2 * leafletH),
        usedH: (normalRows2 * leafletH) + (rotatedRows2 * leafletW),
        description: `${normalCols2}×${normalRows2} (واقفة) + ${rotatedCols2}×${rotatedRows2} (نائمة) = ${total2}`,
        details: `النصف العلوي: ${normalCols2}×${normalRows2} = ${normalCount2} | النصف السفلي: ${rotatedCols2}×${rotatedRows2} = ${rotatedCount2}`
      });
      
      if (total2 > bestCount) {
        bestCount = total2;
        bestLayout = layouts[layouts.length - 1];
      }
    }
    
    // ✅ 4. التوزيع الذكي (العكس: نائمة أولاً ثم واقفة)
    // 4.1: نائمة في النصف الأول + واقفة في النصف المتبقي (عمودي)
    const rotatedCols3 = Math.floor(usableW / leafletH);
    const rotatedRows3 = Math.floor(usableH / leafletW);
    const rotatedCount3 = rotatedCols3 * rotatedRows3;
    
    const remainingW2 = usableW - (rotatedCols3 * leafletH);
    
    if (remainingW2 > 0) {
      const normalCols3 = Math.floor(remainingW2 / leafletW);
      const normalRows3 = Math.floor(usableH / leafletH);
      const normalCount3 = normalCols3 * normalRows3;
      const total3 = rotatedCount3 + normalCount3;
      
      layouts.push({
        type: 'ذكي (نائمة في اليسار + واقفة في اليمين)',
        cols: rotatedCols3 + normalCols3,
        rows: Math.max(rotatedRows3, normalRows3),
        count: total3,
        usedW: (rotatedCols3 * leafletH) + (normalCols3 * leafletW),
        usedH: Math.max(rotatedRows3 * leafletW, normalRows3 * leafletH),
        description: `${rotatedCols3}×${rotatedRows3} (نائمة) + ${normalCols3}×${normalRows3} (واقفة) = ${total3}`,
        details: `النصف الأيسر: ${rotatedCols3}×${rotatedRows3} = ${rotatedCount3} | النصف الأيمن: ${normalCols3}×${normalRows3} = ${normalCount3}`
      });
      
      if (total3 > bestCount) {
        bestCount = total3;
        bestLayout = layouts[layouts.length - 1];
      }
    }
    
    // 4.2: نائمة في النصف الأول + واقفة في النصف المتبقي (أفقي)
    const rotatedRows4 = Math.floor(usableH / leafletW);
    const rotatedCols4 = Math.floor(usableW / leafletH);
    const rotatedCount4 = rotatedCols4 * rotatedRows4;
    
    const remainingH2 = usableH - (rotatedRows4 * leafletW);
    
    if (remainingH2 > 0) {
      const normalCols4 = Math.floor(usableW / leafletW);
      const normalRows4 = Math.floor(remainingH2 / leafletH);
      const normalCount4 = normalCols4 * normalRows4;
      const total4 = rotatedCount4 + normalCount4;
      
      layouts.push({
        type: 'ذكي (نائمة في الأعلى + واقفة في الأسفل)',
        cols: Math.max(rotatedCols4, normalCols4),
        rows: rotatedRows4 + normalRows4,
        count: total4,
        usedW: Math.max(rotatedCols4 * leafletH, normalCols4 * leafletW),
        usedH: (rotatedRows4 * leafletW) + (normalRows4 * leafletH),
        description: `${rotatedCols4}×${rotatedRows4} (نائمة) + ${normalCols4}×${normalRows4} (واقفة) = ${total4}`,
        details: `النصف العلوي: ${rotatedCols4}×${rotatedRows4} = ${rotatedCount4} | النصف السفلي: ${normalCols4}×${normalRows4} = ${normalCount4}`
      });
      
      if (total4 > bestCount) {
        bestCount = total4;
        bestLayout = layouts[layouts.length - 1];
      }
    }
    
    // ترتيب المحاولات حسب العدد (تنازلياً)
    layouts.sort((a, b) => b.count - a.count);
    
    return {
      count: bestCount,
      layout: bestLayout,
      allLayouts: layouts
    };
  };

  // ✅ دالة توليد كل الاحتمالات مع التقليل (0.2 سم)
  const generateAllPossibilities = (leafletW, leafletH, paperW, paperH, margin = 0.4) => {
    const usableW = paperW - (margin * 2);
    const usableH = paperH - (margin * 2);
    
    if (usableW <= 0 || usableH <= 0) return [];
    
    const possibilities = [];
    let id = 0;
    
    // التقليل من 0 إلى 0.2 سم بخطوة 0.02 سم
    const reductions = [];
    for (let r = 0; r <= 0.2; r += 0.02) {
      reductions.push(Math.round(r * 100) / 100);
    }
    
    for (const reductionW of reductions) {
      for (const reductionH of reductions) {
        const newW = Math.max(leafletW - reductionW, 0.1);
        const newH = Math.max(leafletH - reductionH, 0.1);
        
        if (newW > usableW || newH > usableH) continue;
        
        // ✅ استخدام الخوارزمية الذكية مع الأبعاد الجديدة
        const result = calculateSmartLayout(newW, newH, paperW, paperH, margin);
        
        // إضافة جميع النتائج من الخوارزمية الذكية
        for (const layout of result.allLayouts) {
          if (layout.count > 0) {
            id++;
            possibilities.push({
              id,
              leafletW: newW,
              leafletH: newH,
              reductionW: reductionW,
              reductionH: reductionH,
              type: layout.type,
              count: layout.count,
              cols: layout.cols,
              rows: layout.rows,
              usedW: layout.usedW,
              usedH: layout.usedH,
              description: layout.description,
              details: layout.details || '',
              isOverallBest: false
            });
          }
        }
      }
    }
    
    // ترتيب حسب العدد (تنازلياً)
    possibilities.sort((a, b) => b.count - a.count);
    
    // وضع علامة على الأفضل
    if (possibilities.length > 0) {
      possibilities[0].isOverallBest = true;
    }
    
    return possibilities;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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

          if (productData && paperData) {
            const pWidth = productData.width || 0;
            const pHeight = productData.height || 0;
            const papWidth = paperData.width || 0;
            const papHeight = paperData.height || 0;
            
            setLeafletWidth(pWidth);
            setLeafletHeight(pHeight);
            setPaperWidth(papWidth);
            setPaperHeight(papHeight);
            
            // ✅ توليد كل الاحتمالات بالخوارزمية الذكية
            const allPossibilities = generateAllPossibilities(pWidth, pHeight, papWidth, papHeight);
            
            setAllAttempts(allPossibilities);
            
            if (allPossibilities.length > 0) {
              setMaxLeaflets(allPossibilities[0].count);
              setBestFit(allPossibilities[0]);
            }
            
            // ✅ أفضل النتائج حسب النوع
            const types = ['عادي (واقفة)', 'عادي (نائمة)', 'ذكي (واقفة في اليسار + نائمة في اليمين)', 'ذكي (واقفة في الأعلى + نائمة في الأسفل)', 'ذكي (نائمة في اليسار + واقفة في اليمين)', 'ذكي (نائمة في الأعلى + واقفة في الأسفل)'];
            const typeCounts = types.map(type => ({
              method: type,
              count: allPossibilities.filter(p => p.type === type).reduce((max, p) => Math.max(max, p.count), 0)
            }));
            
            setMixedAttempts(typeCounts);
          }

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
                {product.width && <div><span className="font-medium">العرض: </span>{product.width}</div>}
                {product.height && <div><span className="font-medium">الارتفاع: </span>{product.height}</div>}
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

      {/* كارد حساب النشرات المتقدم */}
      <Card>
        <CardHeader>
          <CardTitle>🧮 حساب النشرات المتقدم (خوارزمية ذكية)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">📐 المدخلات:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">حجم النشرة:</span></div>
                <div>{leafletWidth} × {leafletHeight} سم</div>
                <div><span className="font-medium">حجم الورقة:</span></div>
                <div>{paperWidth} × {paperHeight} سم</div>
                <div><span className="font-medium">عدد الاحتمالات:</span></div>
                <div>{allAttempts.length} حالة</div>
                <div><span className="font-medium">أقصى تقليل:</span></div>
                <div>0.2 سم</div>
                <div><span className="font-medium">الكمية المطلوبة:</span></div>
                <div>{order.quantity}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">📊 أفضل النتائج حسب النوع:</h4>
              <div className="space-y-2">
                {mixedAttempts.map((item, index) => (
                  <div key={index} className={`p-2 rounded-lg border ${item.count === maxLeaflets ? 'bg-green-100 border-green-400 font-bold' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.method}</span>
                      <span className={`font-bold ${item.count === maxLeaflets ? 'text-green-700 text-lg' : 'text-gray-600'}`}>
                        {item.count} نشرة
                        {item.count === maxLeaflets && ' ✅ (الأفضل)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ✅ أفضل حل متبروز */}
          {bestFit && (
            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border-2 border-green-500 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-2xl text-green-700">🏆 أفضل حل متبروز</h4>
                  <p className="text-sm text-gray-600 mt-1">هذا هو الحل الأمثل من بين {allAttempts.length} احتمال</p>
                </div>
                <div className="text-center bg-white px-6 py-3 rounded-lg shadow">
                  <div className="text-4xl font-bold text-green-600">{bestFit.count}</div>
                  <div className="text-xs text-gray-500">نشرة في الورقة</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">الأبعاد المثالية</div>
                  <div className="font-bold text-sm">{bestFit.leafletW.toFixed(2)} × {bestFit.leafletH.toFixed(2)} سم</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">التقليل</div>
                  <div className="font-bold text-sm text-red-500">-{bestFit.reductionW.toFixed(2)} × -{bestFit.reductionH.toFixed(2)} سم</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">التوزيع</div>
                  <div className="font-bold text-sm">{bestFit.cols} × {bestFit.rows}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">النوع</div>
                  <div className="font-bold text-sm">{bestFit.type}</div>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-white rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-700">📝 التفاصيل:</div>
                <div className="text-sm text-gray-600 mt-1">{bestFit.description}</div>
                {bestFit.details && (
                  <div className="text-xs text-gray-500 mt-1">{bestFit.details}</div>
                )}
              </div>
            </div>
          )}

          {/* ✅ تفاصيل تنفيذية للتوزيع النهائي */}
          {bestFit && (
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-blue-300 shadow-md">
              <h4 className="font-bold text-blue-700 mb-3">📐 تفاصيل تنفيذية للتوزيع النهائي</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-50 p-2 rounded text-center">
                  <div className="text-xs text-gray-500">الأبعاد النهائية</div>
                  <div className="font-bold text-sm">{bestFit.leafletW.toFixed(2)} × {bestFit.leafletH.toFixed(2)} سم</div>
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <div className="text-xs text-gray-500">التوزيع</div>
                  <div className="font-bold text-sm">{bestFit.cols} × {bestFit.rows}</div>
                </div>
                <div className="bg-purple-50 p-2 rounded text-center">
                  <div className="text-xs text-gray-500">المساحة المستخدمة</div>
                  <div className="font-bold text-sm">
                    {((bestFit.usedW * bestFit.usedH) / ((paperWidth - 0.8) * (paperHeight - 0.8)) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-orange-50 p-2 rounded text-center">
                  <div className="text-xs text-gray-500">المساحة المتبقية</div>
                  <div className="font-bold text-sm">
                    {(100 - ((bestFit.usedW * bestFit.usedH) / ((paperWidth - 0.8) * (paperHeight - 0.8)) * 100)).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border rounded-lg p-3">
                  <div className="font-medium text-sm text-blue-600 mb-2">📏 توزيع الأعمدة:</div>
                  <div className="space-y-1 text-sm">
                    <div>• عدد الأعمدة: <span className="font-bold">{bestFit.cols}</span></div>
                    <div>• عرض كل عمود: <span className="font-bold">{bestFit.leafletW.toFixed(2)} سم</span></div>
                    <div>• إجمالي العرض المستخدم: <span className="font-bold text-green-600">{bestFit.usedW.toFixed(2)} سم</span></div>
                    <div>• العرض المتبقي: <span className="font-bold text-red-500">{(paperWidth - 0.8 - bestFit.usedW).toFixed(2)} سم</span></div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="font-medium text-sm text-purple-600 mb-2">📏 توزيع الصفوف:</div>
                  <div className="space-y-1 text-sm">
                    <div>• عدد الصفوف: <span className="font-bold">{bestFit.rows}</span></div>
                    <div>• ارتفاع كل صف: <span className="font-bold">{bestFit.leafletH.toFixed(2)} سم</span></div>
                    <div>• إجمالي الارتفاع المستخدم: <span className="font-bold text-green-600">{bestFit.usedH.toFixed(2)} سم</span></div>
                    <div>• الارتفاع المتبقي: <span className="font-bold text-red-500">{(paperHeight - 0.8 - bestFit.usedH).toFixed(2)} سم</span></div>
                  </div>
                </div>
              </div>
              
              {bestFit.details && (
                <div className="mt-2 p-3 bg-gray-50 rounded border">
                  <div className="text-sm font-medium text-gray-700">📌 تفاصيل التوزيع:</div>
                  <div className="text-sm text-gray-600 mt-1">{bestFit.details}</div>
                </div>
              )}
              
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm font-medium text-yellow-700">📋 ملخص سريع للتنفيذ:</div>
                <div className="text-xs text-gray-600 mt-1">
                  • اقطع الورقة إلى {bestFit.cols} × {bestFit.rows} = {bestFit.count} نشرة
                  <br />
                  • الأبعاد النهائية للنشرة: {bestFit.leafletW.toFixed(2)} × {bestFit.leafletH.toFixed(2)} سم
                  <br />
                  • إجمالي النشرات: {bestFit.count} نشرة في الورقة الواحدة
                  <br />
                  • عدد الأوراق المطلوبة للكمية {order.quantity}: {Math.ceil(order.quantity / bestFit.count)} ورقة
                </div>
              </div>
            </div>
          )}

          {/* ✅ جدول كل الاحتمالات */}
          {allAttempts.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-3">
                📋 جميع الاحتمالات ({allAttempts.length} حالة) 
                <span className="text-xs text-gray-400 mr-2">- مرتبة من الأفضل للأسوأ</span>
              </h4>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto border rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr className="border-b">
                      <th className="px-2 py-2 text-right">#</th>
                      <th className="px-2 py-2 text-right">النوع</th>
                      <th className="px-2 py-2 text-right">الأبعاد</th>
                      <th className="px-2 py-2 text-right">التقليل</th>
                      <th className="px-2 py-2 text-right">التوزيع</th>
                      <th className="px-2 py-2 text-right">العدد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAttempts.map((attempt, index) => (
                      <tr 
                        key={attempt.id} 
                        className={`border-t text-xs ${index === 0 ? 'bg-green-100 font-bold border-2 border-green-400' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-2 py-1.5 text-center">{index + 1}</td>
                        <td className="px-2 py-1.5">
                          {attempt.type}
                          {attempt.type.includes('نائمة') && ' 🔄'}
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          {attempt.leafletW.toFixed(2)} × {attempt.leafletH.toFixed(2)}
                        </td>
                        <td className="px-2 py-1.5 text-center text-red-500">
                          -{attempt.reductionW.toFixed(2)} × -{attempt.reductionH.toFixed(2)}
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          {attempt.cols} × {attempt.rows}
                        </td>
                        <td className="px-2 py-1.5 text-center font-bold text-green-600">
                          {attempt.count}
                          {attempt.isOverallBest && ' 🏆'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* الأوراق المطلوبة */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700">أقصى عدد في الورقة:</span>
                <div className="font-bold text-xl text-blue-600">{maxLeaflets}</div>
              </div>
              <div>
                <span className="font-medium text-blue-700">الأوراق المطلوبة (محسوبة):</span>
                <div className="font-bold text-xl text-blue-600">
                  {maxLeaflets > 0 ? Math.ceil(order.quantity / maxLeaflets) : 'غير محدد'}
                </div>
              </div>
              <div>
                <span className="font-medium text-blue-700">الأوراق المطلوبة (النظام):</span>
                <div className="font-bold text-xl text-orange-600">{order.requiredSheets || 0}</div>
              </div>
              <div>
                <span className="font-medium text-blue-700">التوفير:</span>
                <div className="font-bold text-xl text-green-600">
                  {order.requiredSheets && maxLeaflets > 0 ? 
                    `${Math.round(((order.requiredSheets - Math.ceil(order.quantity / maxLeaflets)) / order.requiredSheets) * 100)}%` 
                    : '0%'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="font-medium">عدد الأوراق في المونتاج: </span>{order.numberInMontage || 1}</div>
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