import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ar } from '@/constants/ar'

function SettingsSection({ title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={ar.settings.title}
        description={ar.settings.description}
        breadcrumb={[{ label: ar.nav.settings }]}
      />

      <SettingsSection title={ar.settings.companyInfo} description={ar.settings.companyInfoDesc}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={ar.settings.companyName}>
            <Input defaultValue="شركة عالمية للطباعة" />
          </FormField>
          <FormField label={ar.common.email}>
            <Input defaultValue="info@alamiaprint.com" type="email" />
          </FormField>
          <FormField label={ar.common.phone}>
            <Input defaultValue="+966 11 234 5678" />
          </FormField>
          <FormField label={ar.common.address}>
            <Input defaultValue="الرياض، المملكة العربية السعودية" />
          </FormField>
        </div>
        <Button>{ar.common.saveChanges}</Button>
      </SettingsSection>

      <SettingsSection title={ar.settings.systemPreferences} description={ar.settings.systemPreferencesDesc}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={ar.settings.defaultCurrency}>
            <Input defaultValue="ر.س" />
          </FormField>
          <FormField label={ar.settings.dateFormat}>
            <Input defaultValue="DD/MM/YYYY" />
          </FormField>
          <FormField label={ar.settings.lowStockThreshold}>
            <Input defaultValue="10" type="number" />
          </FormField>
          <FormField label={ar.settings.itemsPerPage}>
            <Input defaultValue="10" type="number" />
          </FormField>
        </div>
        <Separator />
        <Button>{ar.common.savePreferences}</Button>
      </SettingsSection>

      <SettingsSection title={ar.settings.notifications} description={ar.settings.notificationsDesc}>
        <div className="space-y-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            {ar.settings.lowStockAlerts}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            {ar.settings.productionReminders}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            {ar.settings.purchaseUpdates}
          </label>
        </div>
        <Button>{ar.common.saveNotifications}</Button>
      </SettingsSection>
    </div>
  )
}
