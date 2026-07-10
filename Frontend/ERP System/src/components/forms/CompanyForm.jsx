import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ar } from '@/constants/ar'
import { formatStatus } from '@/utils/formatStatus'

const companySchema = z.object({
  name: z.string().min(2, ar.companies.validation.nameMin),
  email: z.string().email(ar.companies.validation.emailInvalid),
  phone: z.string().min(5, ar.companies.validation.phoneRequired),
  city: z.string().min(2, ar.companies.validation.cityMin),
  status: z.enum(['active', 'inactive']),
})

export function CompanyForm({ defaultValues }) {
  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: defaultValues || {
      name: '',
      email: '',
      phone: '',
      city: '',
      status: 'active',
    },
  })

  return (
    <div className="space-y-4">
      <FormField label={ar.companies.name} error={errors.name?.message} required>
        <Input {...register('name')} placeholder={ar.companies.namePlaceholder} />
      </FormField>
      <FormField label={ar.common.email} error={errors.email?.message} required>
        <Input {...register('email')} type="email" placeholder={ar.companies.emailPlaceholder} />
      </FormField>
      <FormField label={ar.common.phone} error={errors.phone?.message} required>
        <Input {...register('phone')} placeholder="+966 11 234 5678" />
      </FormField>
      <FormField label={ar.common.city} error={errors.city?.message} required>
        <Input {...register('city')} placeholder={ar.companies.cityPlaceholder} />
      </FormField>
      <FormField label={ar.common.status} error={errors.status?.message}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={ar.common.selectStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{formatStatus('active')}</SelectItem>
                <SelectItem value="inactive">{formatStatus('inactive')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
    </div>
  )
}
