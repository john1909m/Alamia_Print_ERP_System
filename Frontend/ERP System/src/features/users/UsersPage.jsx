// src/features/users/UsersPage.jsx
import { EntityCrudPage } from '@/features/shared/components/EntityCrudPage'
import { useEntityCrud } from '@/features/shared/hooks/useEntityCrud'
import { userService } from '@/features/users/services/userService'
import { UserForm } from '@/features/users/components/UserForm'
import { ar } from '@/constants/ar'

const columns = [
  { key: 'name', header: ar.users.name, sortable: true },
  { key: 'email', header: ar.common.email, sortable: true },
  { key: 'phoneNumber', header: ar.common.phone },
  { key: 'role', header: ar.users.role, sortable: true },
  { key: 'createdAt', header: ar.common.created },
]

export default function UsersPage() {
  const { data, loading, create, update, remove } = useEntityCrud(userService)

  return (
    <EntityCrudPage
      title={ar.users.title}
      description={ar.users.description}
      breadcrumb={[{ label: ar.nav.users }]}
      addLabel={ar.users.add}
      formTitles={{ add: ar.users.addForm, edit: ar.users.editForm }}
      deleteLabels={{
        title: ar.users.deleteTitle,
        description: ar.users.deleteDescription,
      }}
      viewTitle={ar.users.viewTitle}
      viewLabels={{
        name: ar.users.name,
        email: ar.common.email,
        phoneNumber: ar.common.phone,
        role: ar.users.role,
        createdAt: ar.common.created,
      }}
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder={ar.users.search}
      searchKeys={['name', 'email', 'phoneNumber', 'role']}
      FormComponent={UserForm}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}