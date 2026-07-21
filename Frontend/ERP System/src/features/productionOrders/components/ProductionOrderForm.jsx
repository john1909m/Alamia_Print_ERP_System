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
  { value: 'cancelled', label: ar.STATUS_LABELS.cancelled },
];

const formSchema = z.object({
  companyId: z.number().int().positive({ message: ar.common.companyRequired }),
  productIds: z.array(z.number().int().positive()).min(1, { message: ar.common.productRequired }),
  paperId: z.number().int().positive({ message: 'يرجى اختيار ورق' }), // Custom message since no key in ar.js
  quantity: z.number().positive({ message: ar.common.quantityRequired }), // Allow decimals
  requiredSheets: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  status: z.enum([
    'pending',
    'approved',
    'montage',
    'printing',
    'finishing',
    'completed',
    'shipped',
    'delivered',
    'cancelled',
  ]),
  description: z.string().optional(),
});

export default function ProductionOrderForm({
  onSubmit,
  defaultValues,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: '',
      productIds: [],
      paperId: '',
      quantity: '',
      requiredSheets: '',
      status: 'pending',
      description: '',
      ...defaultValues,
    },
  });

  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [papers, setPapers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        setLoading(true);
        // Fetch companies
        const companiesResponse = await companyService.getAll();
        setCompanies(companiesResponse);

        // Fetch products
        const productsResponse = await productService.getAll();
        setProducts(productsResponse);

        // Fetch papers
        const papersResponse = await paperService.getAll();
        setPapers(papersResponse);

        // Fetch materials
        const materialsResponse = await materialService.getAll();
        setMaterials(materialsResponse);
      } catch (error) {
        console.error('Failed to load reference data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReferenceData();
  }, []);

  // Prepare options for selects
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  const paperOptions = papers.map((paper) => ({
    value: paper.id,
    label: paper.name,
  }));

  const materialOptions = materials.map((material) => ({
    value: material.id,
    label: material.name,
  }));

  if (loading) {
    // Return a simplified form or show loading state
    // For now, we'll return the form with empty options
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="companyId">{ar.common.company}</Label>
          <Controller
            control={control}
            name="companyId"
            render={({ field }) => (
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
          />
          {errors.companyId && (
            <span className="text-sm text-red-600">{errors.companyId.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="paperId">{ar.common.paper}</Label>
          <Controller
            control={control}
            name="paperId"
            render({ ({ field }) => (
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
            ))}
          />
          {errors.paperId && (
            <span className="text-sm text-red-600">{errors.paperId.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="productIds">{ar.common.product}</Label>
          <Controller
            control={control}
            name="productIds"
            render({ ({ field }) => (
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
            ))}
          />
          {errors.productIds && (
            <span className="text-sm text-red-600">{errors.productIds.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="materialIds">{ar.common.material}</Label>
          <Controller
            control={control}
            name="materialIds"
            render({ ({ field }) => (
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
            ))}
          />
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
            render({ ({ field }) => (
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
          )}
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