import { EntityCrudPage } from '@/features/shared/components/EntityCrudPage'
import { useEntityCrud } from '@/features/shared/hooks/useEntityCrud'
import { companyService } from '@/features/companies/services/companyService'
import { CompanyForm } from '@/features/companies/components/CompanyForm'
import { ar } from '@/constants/ar'

const columns = [
  { key: 'name', header: ar.companies.name, sortable: true },
  { key: 'email', header: ar.common.email, sortable: true },
  { key: 'address', header: ar.common.address },
  { key: 'managerName', header: ar.shared.managerName, sortable: true },
]

export default function CompaniesPage() {
  const { data, loading, create, update, remove } = useEntityCrud(companyService)

  return (
    <EntityCrudPage
      title={ar.companies.title}
      description={ar.companies.description}
      breadcrumb={[{ label: ar.nav.companies }]}
      addLabel={ar.companies.add}
      formTitles={{ add: ar.companies.addForm, edit: ar.companies.editForm }}
      deleteLabels={{
        title: ar.companies.deleteTitle,
        description: ar.companies.deleteDescription,
      }}
      viewTitle={ar.companies.viewTitle}
      viewLabels={{
        name: ar.companies.name,
        email: ar.common.email,
        address: ar.common.address,
        managerName: ar.shared.managerName,
        phone: ar.common.phone,
        notes: ar.common.notes,
        productsCount: ar.companies.productsCount,
        createdAt: ar.common.created,
      }}
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder={ar.companies.search}
      searchKeys={['name', 'email', 'address', 'managerName', 'phone']}
      FormComponent={CompanyForm}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}