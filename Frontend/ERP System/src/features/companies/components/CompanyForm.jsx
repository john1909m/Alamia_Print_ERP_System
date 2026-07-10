import { forwardRef } from 'react'
import { ContactEntityForm } from '@/features/shared/components/ContactEntityForm'
import { ar } from '@/constants/ar'

export const CompanyForm = forwardRef(function CompanyForm(props, ref) {
  return (
    <ContactEntityForm
      ref={ref}
      {...props}
      nameLabel={ar.companies.name}
      namePlaceholder={ar.companies.namePlaceholder}
    />
  )
})
