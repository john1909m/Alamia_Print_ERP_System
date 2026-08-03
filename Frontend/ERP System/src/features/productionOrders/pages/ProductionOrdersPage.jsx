// src/pages/production-orders/ProductionOrdersPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productionOrderService } from '@/features/productionOrders/services/productionOrderService';
import { companyService } from '@/features/companies/services/companyService';
import { productService } from '@/features/products/services/productService';
import { paperService } from '@/features/materials/services/paperService';
import { materialService } from '@/features/materials/services/materialService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/features/shared/components/PageHeader';
import { ar } from '@/constants/ar';
import ProductionOrderForm from '@/features/productionOrders/components/ProductionOrderForm';
import { PRODUCTION_STATUS, statusLabels, statusColors } from '@/features/productionOrders/components/ProductionOrderForm';

// ✅ نفس الخوارزمية الموجودة في الـ Detail Page بالضبط
const calculateFit = (available, size) => {
  if (size <= 0) return 0;
  return Math.floor(available / size);
};

// ✅ دالة حساب التوزيع الذكي (نفس الـ Detail Page)
const calculateSmartLayout = (leafletW, leafletH, paperW, paperH, margin = 0.4) => {
  const usableW = paperW - (margin * 2);
  const usableH = paperH - (margin * 2);
  
  if (usableW <= 0 || usableH <= 0) return { count: 0, layouts: [] };
  
  const layouts = [];
  let bestCount = 0;
  let bestLayout = null;
  
  // 1. التوزيع العادي (واقفة)
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
  
  // 2. التوزيع العادي (نائمة)
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
  
  // 3. ذكي (واقفة في اليسار + نائمة في اليمين)
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
  
  // 4. ذكي (نائمة في اليسار + واقفة في اليمين)
  const rotatedCols2 = Math.floor(usableW / leafletH);
  const rotatedRows2 = Math.floor(usableH / leafletW);
  const rotatedCount2 = rotatedCols2 * rotatedRows2;
  const remainingW2 = usableW - (rotatedCols2 * leafletH);
  
  if (remainingW2 > 0) {
    const normalCols2 = Math.floor(remainingW2 / leafletW);
    const normalRows2 = Math.floor(usableH / leafletH);
    const normalCount2 = normalCols2 * normalRows2;
    const total2 = rotatedCount2 + normalCount2;
    
    layouts.push({
      type: 'ذكي (نائمة في اليسار + واقفة في اليمين)',
      cols: rotatedCols2 + normalCols2,
      rows: Math.max(rotatedRows2, normalRows2),
      count: total2,
      usedW: (rotatedCols2 * leafletH) + (normalCols2 * leafletW),
      usedH: Math.max(rotatedRows2 * leafletW, normalRows2 * leafletH),
      description: `${rotatedCols2}×${rotatedRows2} (نائمة) + ${normalCols2}×${normalRows2} (واقفة) = ${total2}`,
      details: `النصف الأيسر: ${rotatedCols2}×${rotatedRows2} = ${rotatedCount2} | النصف الأيمن: ${normalCols2}×${normalRows2} = ${normalCount2}`
    });
    
    if (total2 > bestCount) {
      bestCount = total2;
      bestLayout = layouts[layouts.length - 1];
    }
  }
  
  // 5. ذكي (واقفة في الأعلى + نائمة في الأسفل)
  const normalRows3 = Math.floor(usableH / leafletH);
  const normalCols3 = Math.floor(usableW / leafletW);
  const normalCount3 = normalCols3 * normalRows3;
  const remainingH = usableH - (normalRows3 * leafletH);
  
  if (remainingH > 0) {
    const rotatedCols3 = Math.floor(usableW / leafletH);
    const rotatedRows3 = Math.floor(remainingH / leafletW);
    const rotatedCount3 = rotatedCols3 * rotatedRows3;
    const total3 = normalCount3 + rotatedCount3;
    
    layouts.push({
      type: 'ذكي (واقفة في الأعلى + نائمة في الأسفل)',
      cols: Math.max(normalCols3, rotatedCols3),
      rows: normalRows3 + rotatedRows3,
      count: total3,
      usedW: Math.max(normalCols3 * leafletW, rotatedCols3 * leafletH),
      usedH: (normalRows3 * leafletH) + (rotatedRows3 * leafletW),
      description: `${normalCols3}×${normalRows3} (واقفة) + ${rotatedCols3}×${rotatedRows3} (نائمة) = ${total3}`,
      details: `النصف العلوي: ${normalCols3}×${normalRows3} = ${normalCount3} | النصف السفلي: ${rotatedCols3}×${rotatedRows3} = ${rotatedCount3}`
    });
    
    if (total3 > bestCount) {
      bestCount = total3;
      bestLayout = layouts[layouts.length - 1];
    }
  }
  
  // 6. ذكي (نائمة في الأعلى + واقفة في الأسفل)
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

// ✅ دالة توليد كل الاحتمالات مع التقليل (نفس الـ Detail Page)
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
      
      // استخدام الخوارزمية الذكية مع الأبعاد الجديدة
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

export default function ProductionOrdersPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // بيانات التأكيد
  const [confirmData, setConfirmData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [companiesRes, productsRes, papersRes, ordersRes] = await Promise.all([
        companyService.getAll(),
        productService.getAll(),
        paperService.getAll(),
        productionOrderService.getAll()
      ]);

      setCompanies(companiesRes || []);
      setProducts(productsRes || []);
      setPapers(papersRes || []);

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
    setConfirmData(null);
    setShowConfirmModal(false);
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

  // ✅ دالة حساب التفاصيل باستخدام نفس خوارزمية الـ Detail Page
  const calculateOrderDetails = (formData) => {
    // جلب المنتج والورق المختارين
    const selectedProduct = products.find(p => p.id === formData.productId);
    const selectedPaper = papers.find(p => p.id === formData.paperId);
    
    if (!selectedProduct || !selectedPaper) {
      alert('يجب اختيار المنتج والورق أولاً');
      return null;
    }
    
    // حساب عدد النشرات في الورقة
    const leafletW = selectedProduct.width || 0;
    const leafletH = selectedProduct.height || 0;
    const paperW = selectedPaper.width || 0;
    const paperH = selectedPaper.height || 0;
    
    console.log('📐 Modal Calculation:', {
      leafletW, leafletH,
      paperW, paperH,
      productName: selectedProduct.productName,
      paperName: selectedPaper.name || selectedPaper.paperType
    });
    
    if (leafletW === 0 || leafletH === 0 || paperW === 0 || paperH === 0) {
      alert('تأكد من وجود أبعاد للمنتج والورق');
      return null;
    }
    
    // ✅ استخدام نفس الخوارزمية من الـ Detail Page
    const allPossibilities = generateAllPossibilities(leafletW, leafletH, paperW, paperH);
    const leafletsPerSheet = allPossibilities.length > 0 ? allPossibilities[0].count : 0;
    const bestLayout = allPossibilities.length > 0 ? allPossibilities[0] : null;
    const quantity = formData.quantity || 1;
    
    // حساب عدد الأوراق المطلوبة
    const totalSheets = Math.ceil(quantity / leafletsPerSheet);
    const sheetsPerPackage = 500;
    const packages = Math.ceil(totalSheets / sheetsPerPackage);
    
    // تفاصيل Layout
    let layoutDetails = '';
    let layoutType = 'غير محدد';
    let leafletWFinal = leafletW;
    let leafletHFinal = leafletH;
    let reductionW = 0;
    let reductionH = 0;
    
    if (bestLayout) {
      layoutType = bestLayout.type;
      layoutDetails = `${bestLayout.cols} × ${bestLayout.rows} = ${bestLayout.count} نشرة`;
      leafletWFinal = bestLayout.leafletW || leafletW;
      leafletHFinal = bestLayout.leafletH || leafletH;
      reductionW = bestLayout.reductionW || 0;
      reductionH = bestLayout.reductionH || 0;
    }
    
    return {
      leafletsPerSheet,
      totalSheets,
      sheetsPerPackage,
      packages,
      quantity,
      productName: selectedProduct.productName,
      paperName: selectedPaper.name || selectedPaper.paperType || 'ورق',
      leafletW,
      leafletH,
      paperW,
      paperH,
      leafletWFinal,
      leafletHFinal,
      reductionW,
      reductionH,
      layoutType,
      layoutDetails,
      allPossibilities
    };
  };

  // ✅ عند إرسال الفورم
  const handleFormSubmit = async (data) => {
    // حساب التفاصيل
    const details = calculateOrderDetails(data);
    if (!details) return;
    
    // حفظ البيانات وعرض Modal التأكيد
    setConfirmData({
      formData: data,
      details: details
    });
    setShowConfirmModal(true);
  };

  // ✅ تأكيد إنشاء الأمر
  const handleConfirmCreate = async () => {
    if (!confirmData) return;
    
    setFormLoading(true);
    try {
      const { formData, details } = confirmData;
      
      // إضافة الحقول المحسوبة للـ payload
      const payload = {
        ...formData,
        requiredSheets: details.totalSheets,
        numberInMontage: details.leafletsPerSheet
      };
      
      if (editingOrder) {
        await productionOrderService.update(editingOrder.id, payload);
      } else {
        await productionOrderService.create(payload);
      }
      
      await loadData();
      handleCloseModal();
      alert(`تم إنشاء أمر الإنتاج بنجاح!\nعدد الأوراق المطلوبة: ${details.totalSheets}\nعدد الرزم: ${details.packages}`);
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
              onSubmit={handleFormSubmit}
              loading={formLoading}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}

      {/* ✅ Modal التأكيد - يعرض نفس الرقم من الـ Detail Page */}
      {showConfirmModal && confirmData && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowConfirmModal(false)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-2xl p-6 m-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-blue-700">📋 تأكيد أمر الإنتاج</h2>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            
            {/* التفاصيل */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <div className="text-sm text-gray-500">المنتج</div>
                  <div className="font-bold">{confirmData.details.productName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">الورق</div>
                  <div className="font-bold">{confirmData.details.paperName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">الكمية المطلوبة</div>
                  <div className="font-bold">{confirmData.details.quantity.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">نشرة في الورقة</div>
                  <div className="font-bold text-green-600 text-lg">{confirmData.details.leafletsPerSheet}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-center">
                  <div className="text-sm text-gray-500">أبعاد النشرة الأصلية</div>
                  <div className="font-bold">{confirmData.details.leafletW} × {confirmData.details.leafletH} سم</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">الأبعاد بعد التقليل</div>
                  <div className="font-bold text-green-600">
                    {confirmData.details.leafletWFinal.toFixed(2)} × {confirmData.details.leafletHFinal.toFixed(2)} سم
                  </div>
                  <div className="text-xs text-red-500">
                    -{confirmData.details.reductionW.toFixed(2)} × -{confirmData.details.reductionH.toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">طريقة التوزيع</div>
                  <div className="font-bold text-sm">{confirmData.details.layoutType}</div>
                  <div className="text-xs text-gray-500">{confirmData.details.layoutDetails}</div>
                </div>
              </div>

              {/* ✅ عرض أفضل 5 توزيعات زي الـ Detail Page */}
              {confirmData.details.allPossibilities && confirmData.details.allPossibilities.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="text-sm font-medium text-gray-700 mb-2">📊 أفضل التوزيعات:</div>
                  <div className="space-y-1">
                    {confirmData.details.allPossibilities.slice(0, 5).map((item, idx) => (
                      <div key={idx} className={`text-xs flex justify-between ${idx === 0 ? 'font-bold text-green-600' : 'text-gray-600'}`}>
                        <span>{item.type}</span>
                        <span>{item.cols} × {item.rows} = {item.count} نشرة</span>
                      </div>
                    ))}
                    {confirmData.details.allPossibilities.length > 5 && (
                      <div className="text-xs text-gray-400">... و {confirmData.details.allPossibilities.length - 5} توزيعات أخرى</div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-center">
                  <div className="text-sm text-gray-500">الأوراق المطلوبة</div>
                  <div className="font-bold text-2xl text-blue-600">{confirmData.details.totalSheets.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">ورق / رزمة</div>
                  <div className="font-bold">{confirmData.details.sheetsPerPackage}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">عدد الرزم</div>
                  <div className="font-bold text-2xl text-orange-600">{confirmData.details.packages.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg border text-center text-sm text-gray-600">
                <span className="font-medium">طريقة الحساب:</span>
                الكمية ({confirmData.details.quantity.toLocaleString()}) ÷ عدد النشرات في الورقة ({confirmData.details.leafletsPerSheet}) = {confirmData.details.totalSheets.toLocaleString()} ورقة
                <br />
                {confirmData.details.totalSheets.toLocaleString()} ÷ {confirmData.details.sheetsPerPackage} = {confirmData.details.packages.toLocaleString()} رزمة
              </div>
            </div>
            
            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button 
                type="button"
                onClick={handleConfirmCreate}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={formLoading}
              >
                {formLoading ? 'جاري الحفظ...' : '✅ تأكيد وإنشاء الأمر'}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}