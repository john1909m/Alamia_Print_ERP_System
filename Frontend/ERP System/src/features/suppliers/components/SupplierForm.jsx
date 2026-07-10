import { forwardRef } from 'react'
import { ContactEntityForm } from '@/features/shared/components/ContactEntityForm'
import { ar } from '@/constants/ar'

export const SupplierForm = forwardRef(function SupplierForm(props, ref) {
  return (
    <ContactEntityForm
      ref={ref}
      {...props}
      nameLabel={ar.suppliers.name}
      namePlaceholder={ar.suppliers.namePlaceholder}
    />
  )
})
