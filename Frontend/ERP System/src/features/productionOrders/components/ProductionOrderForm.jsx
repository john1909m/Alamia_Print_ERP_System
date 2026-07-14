import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { companyService } from '@/features/companies/services/companyService';
import { productService } from '@/features/products/services/productService';
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
  orderNumber: z.string().min(1, { message: ar.common.orderNumberRequired }),
  companyId: z.number().int().positive({ message: ar.common.companyRequired }),
  productId: z.number().int().positive({ message: ar.common.productRequired }),
  quantity: z.number().int().positive({ message: ar.common.quantityRequired }),
  orderDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: ar.common.orderDateInvalid,
  }),
  expectedDeliveryDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: ar.common.expectedDeliveryDateInvalid,
  }),
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
  notes: z.string().optional(),
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
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: '',
      companyId: '',
      productId: '',
      quantity: '',
      orderDate: '',
      expectedDeliveryDate: '',
      status: 'pending',
      notes: '',
      ...defaultValues,
    },
  });

  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
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
      } catch (error) {
        console.error('Failed to load reference data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReferenceData();
  }, []);

  // Prepare options for company and product selects
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  if (loading) {
    // Return a simplified form or show loading state
    // For now, we'll return the form with empty options
    // In a real app, you might want to show a skeleton loader
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="orderNumber">{ar.productionOrders.orderNumber}</Label>
          <Input
            id="orderNumber"
            placeholder="أدخل رقم الطلب"
            {...register('orderNumber')}
          />
          {errors.orderNumber && (
            <span className="text-sm text-red-600">{errors.orderNumber.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="companyId">{ar.common.company}</Label>
          <Select
            id="companyId"
            placeholder="اختر الشركة"
            {...register('companyId')}
          >
            <option value="">{`--- ${ar.common.selectCompany} ---`}</option>
            {companyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              }
            ))}
          </Select>
          {errors.companyId && (
            <span className="text-sm text-red-600">{errors.companyId.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="productId">{ar.common.product}</Label>
          <Select
            id="productId"
            placeholder="اختر المنتج"
            {...register('productId')}
          >
            <option value="">{`--- ${ar.common.selectProduct} ---`}</option>
            {productOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              }
            ))}
          </Select>
          {errors.productId && (
            <span className="text-sm text-red-600">{errors.productId.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="quantity">{ar.productionOrders.quantity}</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
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
          <Label htmlFor="orderDate">{ar.productionOrders.orderDate}</Label>
          <input
            id="orderDate"
            type="date"
            className="border rounded px-3 py-2 w-full"
            {...register('orderDate')}
          />
          {errors.orderDate && (
            <span className="text-sm text-red-600">{errors.orderDate.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="expectedDeliveryDate">{ar.productionOrders.dueDate}</Label>
          <input
            id="expectedDeliveryDate"
            type="date"
            className="border rounded px-3 py-2 w-full"
            {...register('expectedDeliveryDate')}
          />
          {errors.expectedDeliveryDate && (
            <span className="text-sm text-red-600">{errors.expectedDeliveryDate.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-col-2">
        <div>
          <Label htmlFor="status">{ar.common.status}</Label>
          <Select
            id="status"
            {...register('status')}
          >
            <option value="">{`--- ${ar.common.selectStatus} ---`}</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              }
            ))}
          </Select>
          {errors.status && (
            <span className="text-sm text-red-600">{errors.status.message}</span>
          )}
        </div>
        <div>
          <Label htmlFor="notes">{ar.common.notes}</Label>
          <Textarea
            id="notes"
            rows={4}
            placeholder="أدخل الملاحظات (اختياري)"
            {...register('notes')}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'جاري التحميل...' : ar.common.save}
      </Button>
    </form>
  );
}