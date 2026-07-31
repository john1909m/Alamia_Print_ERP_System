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
import { paperService } from '@/features/papers/services/paperService';
import { materialService } from '@/features/materials/services/materialService';
import { ar } from '@/constants/ar';

const statusOptions = [
  { value: 'pending', label: ar.STATUS_LABELS.pending },
  { value: 'approved', label: ar.STATUS_LABELS.approved },
  { value: 'montage', label: ar.STATUS_LABELS.montage },
  { value: 'printing', label: ar.STATUS_LABELS.printing },
  { value: 'finishing', label: ar.STATUS_LABELS.finishing },
  { value: 'completed', label: ar.STATUS_LABELS.completed },
  { value: 'shipped', label: ar.STATUS_LABELS.shipped },
  { value: 'delivered', label: ar.STATUS_LABELS.delivered },
];

const productStatusOptions = [
  { value: 'design', label: 'التصميم' },
  { value: 'printing', label: 'الطباعة' },
  { value: 'finishing', label: 'التشطيب' },
  { value: 'completed', label: 'مكتمل' },
];

const statusMap = {
  pending: 'pending',
  approved: 'approved',
  montage: 'montage',
  printing: 'printing',
  finishing: 'finishing',
  completed: 'completed',
  shipped: 'shipped',
  delivered: 'delivered',
};

const productStatusMap = {
  design: 'design',
  printing: 'printing',
  finishing: 'finishing',
  completed: 'completed',
};

export default function ProductionOrderForm({
  order,
  onSubmit,
  loading,
  companies,
  products,
  papers,
  materials,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(
      z.object({
        companyId: z.number().positive(),
        productIds: z.array(z.number().positive()).nonempty(),
        paperId: z.number().positive(),
        materialIds: z.array(z.number().positive()).nonempty(),
        requiredSheets: z.number().nonnegative().optional(),
        quantity: z.number().positive(),
        status: z.enum([
          'pending',
          'approved',
          'montage',
          'printing',
          'finishing',
          'completed',
          'shipped',
          'delivered',
        ]),
        description: z.string().max(500).optional(),
      })
    ),
    defaultValues: {
      companyId: order?.companyId ?? '',
      productIds: order?.productIds?.map(String) ?? [],
      paperId: order?.paperId ?? '',
      materialIds: order?.materialIds?.map(String) ?? [],
      requiredSheets: order?.requiredSheets ?? 0,
      quantity: order?.quantity ?? 1,
      status: order?.status ?? 'pending',
      description: order?.description ?? '',
    },
  });

  const [companyOptions, setCompanyOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [paperOptions, setPaperOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);

  useEffect(() => {
    const loadCompanies = async () => {
      const data = await companyService.getAll();
      setCompanyOptions(
        data.map((company) => ({
          value: company.id,
          label: company.name,
        }))
      );
    };
    loadCompanies();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productService.getAll();
      setProductOptions(
        data.map((product) => ({
          value: product.id,
          label: product.name,
        }))
      );
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const loadPapers = async () => {
      const data = await paperService.getAll();
      setPaperOptions(
        data.map((paper) => ({
          value: paper.id,
          label: paper.name,
        }))
      );
    };
    loadPapers();
  }, []);

  useEffect(() => {
    const loadMaterials = async () => {
      const data = await materialService.getAll();
      setMaterialOptions(
        data.map((material) => ({
          value: material.id,
          label: material.name,
        }))
      );
    };
    loadMaterials();
  }, []);

  const handleFormSubmit = (data) => {
    const status = statusMap[data.status] || 'pending';
    const productIds = data.productIds.map(Number);
    const materialIds = data.materialIds.map(Number);
    onSubmit({
      ...data,
      status,
      productIds,
      materialIds,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="companyId">{ar.common.company}</Label>
          <Controller
            control={control}
            name="companyId"
          >
            {({ field }) => (
              <Select
                id="companyId"
                value={field.value ? String(field.value) : ''}
                onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                placeholder={ar.common.selectCompany}
              >
                <option value="">{`--- ${ar.common.selectCompany} ---`}</option>
                {companyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Controller>
          {errors.companyId && (
            <span className="text-sm text-red-600">{errors.companyId.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="paperId">{ar.common.paper}</Label>
          <Controller
            control={control}
            name="paperId"
          >
            {({ field }) => (
              <Select
                id="paperId"
                value={field.value ? String(field.value) : ''}
                onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                placeholder={ar.common.selectPaper}
              >
                <option value="">{`--- ${ar.common.selectPaper} ---`}</option>
                {paperOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Controller>
          {errors.paperId && (
            <span className="text-sm text-red-600">{errors.paperId.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="productIds">{ar.common.product}</Label>
          <Controller
            control={control}
            name="productIds"
          >
            {({ field }) => (
              <Select
                id="productIds"
                multiple
                value={Array.isArray(field.value) ? field.value.map(String) : []}
                onValueChange={(values) => field.onChange(values.map(Number))}
                placeholder={ar.common.selectProduct}
              >
                <option value="">{`--- ${ar.common.selectProduct} ---`}</option>
                {productOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Controller>
          {errors.productIds && (
            <span className="text-sm text-red-600">{errors.productIds.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="materialIds">{ar.common.material}</Label>
          <Controller
            control={control}
            name="materialIds"
          >
            {({ field }) => (
              <Select
                id="materialIds"
                multiple
                value={Array.isArray(field.value) ? field.value.map(String) : []}
                onValueChange={(values) => field.onChange(values.map(Number))}
                placeholder={ar.common.selectMaterial}
              >
                <option value="">{`--- ${ar.common.selectMaterial} ---`}</option>
                {materialOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Controller>
          {errors.materialIds && (
            <span className="text-sm text-red-600">{errors.materialIds.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="requiredSheets">الأوراق المطلوبة</Label>
          <Input
            id="requiredSheets"
            type="number"
            placeholder="أدخل عدد الأوراق المطلوبة (اختياري)"
            {...register('requiredSheets')}
          />
          {errors.requiredSheets && (
            <span className="text-sm text-red-600">{errors.requiredSheets.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="quantity">{ar.productionOrders.quantity}</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="أدخل الكمية"
            {...register('quantity')}
          />
          {errors.quantity && (
            <span className="text-sm text-red-600">{errors.quantity.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="status">{ar.common.status}</Label>
          <Controller
            control={control}
            name="status"
          >
            {({ field }) => (
              <Select
                id="status"
                value={field.value}
                onValueChange={field.onChange}
                placeholder={ar.common.selectStatus}
              >
                <option value="">{`--- ${ar.common.selectStatus} ---`}</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Controller>
          {errors.status && (
            <span className="text-sm text-red-600">{errors.status.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="description">{ar.common.notes}</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="أدخل الملاحظات (اختياري)"
            {...register('description')}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'جاري التحميل...' : ar.common.save}
      </Button>
    </form>
  );
}