// src/features/productionOrders/components/ProductionOrderForm.jsx
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { companyService } from '@/features/companies/services/companyService';
import { productService } from '@/features/products/services/productService';
import { paperService } from '@/features/materials/services/paperService';
import { inkService } from '@/features/materials/services/inkService';
import { chemicalService } from '@/features/materials/services/chemicalService';
import { ar } from '@/constants/ar';

const PRODUCTION_STATUS = [
  'SENT_PO',
  'BROVA',
  'EDITING',
  'APPROVED',
  'UNDER_MONTAGE',
  'PREPARE_ZINC',
  'ZINC_ARRIVED',
  'PRINTING',
  'CUTTING',
  'WRAPPING',
  'SHIPPED',
  'DELIVERED',
  'INVOICE_DONE'
];

const statusLabels = {
  SENT_PO: 'تم إرسال أمر الشراء',
  BROVA: 'بروفا',
  EDITING: 'قيد التحرير',
  APPROVED: 'تم الموافقة',
  UNDER_MONTAGE: 'تحت التركيب',
  PREPARE_ZINC: 'تحضير الزنك',
  ZINC_ARRIVED: 'الزنك وصل',
  PRINTING: 'طباعة',
  CUTTING: 'تقطيع',
  WRAPPING: 'تغليف',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التسليم',
  INVOICE_DONE: 'تم إصدار الفاتورة'
};

const statusColors = {
  SENT_PO: 'bg-blue-100 text-blue-800',
  BROVA: 'bg-purple-100 text-purple-800',
  EDITING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  UNDER_MONTAGE: 'bg-indigo-100 text-indigo-800',
  PREPARE_ZINC: 'bg-orange-100 text-orange-800',
  ZINC_ARRIVED: 'bg-pink-100 text-pink-800',
  PRINTING: 'bg-red-100 text-red-800',
  CUTTING: 'bg-gray-100 text-gray-800',
  WRAPPING: 'bg-teal-100 text-teal-800',
  SHIPPED: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  INVOICE_DONE: 'bg-amber-100 text-amber-800'
};

// دوال العرض
const getPaperDisplayLabel = (paper) => {
  if (!paper) return '';
  const parts = [];
  if (paper.paperType) parts.push(`📄 ${paper.paperType}`);
  if (paper.width) parts.push(`عرض: ${paper.width}`);
  if (paper.height) parts.push(`ارتفاع: ${paper.height}`);
  if (paper.weight) parts.push(`وزن: ${paper.weight}`);
  if (paper.stock !== null && paper.stock !== undefined) parts.push(`📦 مخزون: ${paper.stock}`);
  return parts.join(' | ') || paper.name || `ورق ${paper.id}`;
};

const getInkDisplayLabel = (ink) => {
  if (!ink) return '';
  const parts = [];
  if (ink.name) parts.push(`🖨️ ${ink.name}`);
  if (ink.inkType) {
    const types = Array.isArray(ink.inkType) ? ink.inkType.join(', ') : ink.inkType;
    if (types) parts.push(`نوع: ${types}`);
  }
  const stock = ink.stock !== null && ink.stock !== undefined ? ink.stock : 0;
  parts.push(`📦 مخزون: ${stock}`);
  return parts.join(' | ') || `حبر ${ink.id}`;
};

const getChemicalDisplayLabel = (chemical) => {
  if (!chemical) return '';
  const parts = [];
  if (chemical.name) parts.push(`🧪 ${chemical.name}`);
  if (chemical.chemicalType) {
    const types = Array.isArray(chemical.chemicalType) ? chemical.chemicalType.join(', ') : chemical.chemicalType;
    if (types) parts.push(`نوع: ${types}`);
  }
  const stock = chemical.stock !== null && chemical.stock !== undefined ? chemical.stock : 0;
  parts.push(`📦 مخزون: ${stock}`);
  return parts.join(' | ') || `مادة كيميائية ${chemical.id}`;
};

const getProductDisplayLabel = (product) => {
  if (!product) return '';
  const parts = [];
  if (product.productName) parts.push(`📦 ${product.productName}`);
  if (product.productCode) parts.push(`[${product.productCode}]`);
  if (product.category) parts.push(`- ${product.category}`);
  return parts.join(' ') || `منتج ${product.id}`;
};

// ✅ Schema من غير requiredSheets و numberInMontage
const productionOrderSchema = z.object({
  companyId: z.coerce.number().positive('الشركة مطلوبة'),
  productId: z.coerce.number().positive('المنتج مطلوب'),
  paperId: z.coerce.number().positive('الورق مطلوب'),
  quantity: z.coerce.number().positive('الكمية مطلوبة'),
  inkIds: z.array(z.coerce.number()).optional().default([]),
  chemicalIds: z.array(z.coerce.number()).optional().default([]),
  requiredChemicals: z.coerce.number().nonnegative().optional(),
  requiredInks: z.coerce.number().nonnegative().optional(),
  status: z.enum(PRODUCTION_STATUS).default('SENT_PO'),
  description: z.string().max(500).optional(),
});

export default function ProductionOrderForm({
  order,
  onSubmit,
  loading,
  onCancel,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(productionOrderSchema),
    defaultValues: {
      companyId: order?.companyId ?? '',
      productId: order?.productId ?? '',
      paperId: order?.paperId ?? '',
      quantity: order?.quantity ?? 1,
      inkIds: order?.inkIds ?? [],
      chemicalIds: order?.chemicalIds ?? [],
      requiredChemicals: order?.requiredChemicals ?? 0,
      requiredInks: order?.requiredInks ?? 0,
      status: order?.status ?? 'SENT_PO',
      description: order?.description ?? '',
    },
  });

  const [companyOptions, setCompanyOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [paperOptions, setPaperOptions] = useState([]);
  const [inkOptions, setInkOptions] = useState([]);
  const [chemicalOptions, setChemicalOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [companies, products, papers, inks, chemicals] = await Promise.all([
          companyService.getAll(),
          productService.getAll(),
          paperService.getAll(),
          inkService.getAll(),
          chemicalService.getAll(),
        ]);

        setCompanyOptions(companies || []);
        setProductOptions(products || []);
        setPaperOptions(papers || []);
        setInkOptions(inks || []);
        setChemicalOptions(chemicals || []);
      } catch (error) {
        console.error('❌ Failed to load options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  if (loadingOptions) {
    return <div className="text-center py-8 text-gray-500">جاري تحميل البيانات...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* الشركة */}
        <div>
          <Label htmlFor="companyId" className="font-medium">
            الشركة <span className="text-red-500">*</span>
          </Label>
          <Controller
            control={control}
            name="companyId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(value) => {
                  field.onChange(value ? Number(value) : '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الشركة" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((company) => (
                    <SelectItem key={company.id} value={String(company.id)}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.companyId && (
            <span className="text-sm text-red-600">{errors.companyId.message}</span>
          )}
        </div>

        {/* المنتج */}
        <div>
          <Label htmlFor="productId" className="font-medium">
            المنتج <span className="text-red-500">*</span>
          </Label>
          <Controller
            control={control}
            name="productId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(value) => {
                  field.onChange(value ? Number(value) : '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنتج" />
                </SelectTrigger>
                <SelectContent>
                  {productOptions.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {getProductDisplayLabel(product)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.productId && (
            <span className="text-sm text-red-600">{errors.productId.message}</span>
          )}
        </div>

        {/* الورق */}
        <div>
          <Label htmlFor="paperId" className="font-medium">
            نوع الورق <span className="text-red-500">*</span>
          </Label>
          <Controller
            control={control}
            name="paperId"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(value) => {
                  field.onChange(value ? Number(value) : '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الورق" />
                </SelectTrigger>
                <SelectContent>
                  {paperOptions.map((paper) => (
                    <SelectItem key={paper.id} value={String(paper.id)}>
                      {getPaperDisplayLabel(paper)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.paperId && (
            <span className="text-sm text-red-600">{errors.paperId.message}</span>
          )}
        </div>

        {/* الكمية */}
        <div>
          <Label htmlFor="quantity" className="font-medium">
            الكمية <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            placeholder="أدخل الكمية"
            {...register('quantity')}
            min="1"
            step="1"
            className="w-full"
          />
          {errors.quantity && (
            <span className="text-sm text-red-600">{errors.quantity.message}</span>
          )}
        </div>

        {/* الأحبار */}
        <div>
          <Label className="font-medium">نوع الحبر</Label>
          <Controller
            control={control}
            name="inkIds"
            render={({ field }) => {
              const currentValue = Array.isArray(field.value) ? field.value : [];
              
              return (
                <select
                  multiple
                  value={currentValue.map(String)}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                    field.onChange(values);
                  }}
                  className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {inkOptions.length === 0 ? (
                    <option value="" disabled>لا توجد أحبار متاحة</option>
                  ) : (
                    inkOptions.map((ink) => (
                      <option key={ink.id} value={String(ink.id)}>
                        {getInkDisplayLabel(ink)}
                      </option>
                    ))
                  )}
                </select>
              );
            }}
          />
          {errors.inkIds && (
            <span className="text-sm text-red-600">{errors.inkIds.message}</span>
          )}
          <div className="text-xs text-gray-400 mt-1">
            عدد الأحبار المتاحة: {inkOptions.length}
          </div>
        </div>

        {/* المواد الكيميائية */}
        <div>
          <Label className="font-medium">نوع المادة الكيميائية</Label>
          <Controller
            control={control}
            name="chemicalIds"
            render={({ field }) => {
              const currentValue = Array.isArray(field.value) ? field.value : [];
              
              return (
                <select
                  multiple
                  value={currentValue.map(String)}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                    field.onChange(values);
                  }}
                  className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {chemicalOptions.length === 0 ? (
                    <option value="" disabled>لا توجد مواد كيميائية متاحة</option>
                  ) : (
                    chemicalOptions.map((chemical) => (
                      <option key={chemical.id} value={String(chemical.id)}>
                        {getChemicalDisplayLabel(chemical)}
                      </option>
                    ))
                  )}
                </select>
              );
            }}
          />
          {errors.chemicalIds && (
            <span className="text-sm text-red-600">{errors.chemicalIds.message}</span>
          )}
          <div className="text-xs text-gray-400 mt-1">
            عدد المواد الكيميائية المتاحة: {chemicalOptions.length}
          </div>
        </div>

        {/* ✅ كمية المواد الكيميائية المطلوبة */}
        <div>
          <Label htmlFor="requiredChemicals" className="font-medium">
            كمية المواد الكيميائية المطلوبة
          </Label>
          <Input
            id="requiredChemicals"
            type="number"
            placeholder="أدخل كمية المواد الكيميائية المطلوبة"
            {...register('requiredChemicals')}
            min="0"
            step="0.01"
            className="w-full"
          />
          {errors.requiredChemicals && (
            <span className="text-sm text-red-600">{errors.requiredChemicals.message}</span>
          )}
        </div>

        {/* ✅ كمية الأحبار المطلوبة */}
        <div>
          <Label htmlFor="requiredInks" className="font-medium">
            كمية الأحبار المطلوبة
          </Label>
          <Input
            id="requiredInks"
            type="number"
            placeholder="أدخل كمية الأحبار المطلوبة"
            {...register('requiredInks')}
            min="0"
            step="0.01"
            className="w-full"
          />
          {errors.requiredInks && (
            <span className="text-sm text-red-600">{errors.requiredInks.message}</span>
          )}
        </div>

        {/* ✅ تم حذف requiredSheets و numberInMontage */}

        {/* الحالة */}
        <div>
          <Label htmlFor="status" className="font-medium">
            الحالة
          </Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTION_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${statusColors[status]}`}>
                        {statusLabels[status]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <span className="text-sm text-red-600">{errors.status.message}</span>
          )}
        </div>

        {/* الوصف */}
        <div className="col-span-2">
          <Label htmlFor="description" className="font-medium">
            ملاحظات
          </Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="أدخل الملاحظات (اختياري)"
            {...register('description')}
            className="w-full"
          />
          {errors.description && (
            <span className="text-sm text-red-600">{errors.description.message}</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'جاري التحميل...' : 'حفظ'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            إلغاء
          </Button>
        )}
      </div>
    </form>
  );
}

export { PRODUCTION_STATUS, statusLabels, statusColors };