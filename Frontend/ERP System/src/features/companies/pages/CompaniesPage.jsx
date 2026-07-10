import { EntityCrudPage } from '@/features/shared/components/EntityCrudPage'
import { useEntityCrud } from '@/features/shared/hooks/useEntityCrud'
import { companyService } from '@/features/companies/services/companyService'
import { CompanyForm } from '@/features/companies/components/CompanyForm'
import { ar } from '@/constants/ar'

const columns = [
  { key: 'name', header: ar.companies.name, sortable: true },
  { key: 'phone', header: ar.common.phone, sortable: true },
  { key: 'email', header: ar.common.email, sortable: true },
  { key: 'address', header: ar.common.address },
  {
    key: 'productsCount',
    header: ar.companies.productsCount,
    sortable: true,
    render: (row) => row.productsCount?.toLocaleString('ar-SA'),
  },
  { key: 'createdAt', header: ar.common.created, sortable: true },
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
        count: ar.companies.productsCount,
        countKey: 'productsCount',
      }}
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder={ar.companies.search}
      searchKeys={['name', 'phone', 'email', 'address']}
      FormComponent={CompanyForm}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}
