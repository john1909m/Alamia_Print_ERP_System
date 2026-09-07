// src/features/shared/components/EntityCrudPage.jsx
import { useState, useCallback, useRef } from 'react'
import { Plus, Download, Upload, X, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/features/shared/components/PageHeader'
import { DataTable } from '@/features/shared/components/DataTable'
import { ActionDropdown } from '@/features/shared/components/ActionDropdown'
import { DeleteDialog } from '@/features/shared/components/DeleteDialog'
import { FormModal } from '@/features/shared/components/FormModal'
import { ViewDialog } from '@/features/shared/components/ViewDialog'
import { buildViewFields } from '@/features/shared/utils/buildViewFields'
import { LoadingState } from '@/features/shared/components/LoadingState'
import { exportToExcel, downloadTemplate } from '@/utils/exportToExcel'
import { ar } from '@/constants/ar'
import * as XLSX from 'xlsx'

export function EntityCrudPage({
  title,
  description,
  breadcrumb,
  addLabel,
  formTitles,
  deleteLabels,
  viewTitle,
  viewLabels,
  columns,
  data,
  loading,
  searchPlaceholder,
  searchKeys,
  FormComponent,
  formProps,
  onCreate,
  onUpdate,
  onDelete,
  filterSlot,
  getViewFields,
  actionsRender,
  exportFileName,
  exportColumns,
  // Import props
  importColumns = null,
  importTemplateHeaders = null,
  importFileName = 'import',
  onImport = null,
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importPreview, setImportPreview] = useState([])
  const [importErrors, setImportErrors] = useState([])
  const [showImportPreview, setShowImportPreview] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const fileInputRef = useRef(null)
  const formRef = useRef(null)

  const isEditing = Boolean(selectedItem?.id)

  const openCreate = () => { setSelectedItem(null); setFormOpen(true) }
  const openEdit = (item) => { setSelectedItem(item); setFormOpen(true) }
  const openView = (item) => { setSelectedItem(item); setViewOpen(true) }
  const openDelete = (item) => { setSelectedItem(item); setDeleteOpen(true) }

  const handleFormSave = useCallback(async () => {
    formRef.current?.submit()
  }, [])

  const handleFormSubmit = async (values) => {
    setSaving(true)
    try {
      if (isEditing) {
        await onUpdate(selectedItem.id, values)
      } else {
        await onCreate(values)
      }
      setFormOpen(false)
      setSelectedItem(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (selectedItem) await onDelete(selectedItem.id)
    setDeleteOpen(false)
    setSelectedItem(null)
  }

  // ===== Export =====
  const handleExport = () => {
    exportToExcel(data, exportFileName || title, exportColumns || null)
  }

  // ===== Import =====
  const handleImportFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setImportFile(selectedFile)
    setImportErrors([])
    previewImportFile(selectedFile)
  }

  const previewImportFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)

        if (jsonData.length === 0) {
          setImportErrors(['الملف فارغ أو لا يحتوي على بيانات'])
          setImportPreview([])
          setShowImportPreview(true)
          return
        }

        if (importColumns) {
          const headers = Object.keys(jsonData[0])
          const expectedHeaders = importColumns.map(c => c.header)
          const missingHeaders = expectedHeaders.filter(h => !headers.includes(h))
          if (missingHeaders.length > 0) {
            setImportErrors([`الأعمدة التالية غير موجودة: ${missingHeaders.join(', ')}`])
          }
        }

        setImportPreview(jsonData)
        setShowImportPreview(true)
      } catch (error) {
        setImportErrors(['حدث خطأ أثناء قراءة الملف: ' + error.message])
        setShowImportPreview(true)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleRemoveImportFile = () => {
    setImportFile(null)
    setImportPreview([])
    setImportErrors([])
    setShowImportPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImport = async () => {
    if (!importFile || importPreview.length === 0 || !onImport) return

    setImporting(true)
    try {
      const importData = importColumns
        ? importPreview.map(row => {
            const mappedRow = {}
            importColumns.forEach(col => {
              mappedRow[col.key] = row[col.header] || null
            })
            return mappedRow
          })
        : importPreview

      await onImport(importData)
      handleRemoveImportFile()
      setShowImport(false)
    } catch (error) {
      setImportErrors([error.message || 'حدث خطأ أثناء الاستيراد'])
    } finally {
      setImporting(false)
    }
  }

  const handleDownloadTemplate = () => {
    const headers = importTemplateHeaders || (importColumns ? importColumns.map(c => c.header) : [])
    downloadTemplate(headers, importFileName)
  }

  const toggleImport = () => {
    setShowImport(!showImport)
    if (!showImport) {
      handleRemoveImportFile()
    }
  }

  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      header: ar.common.actions,
      className: 'w-[80px]',
      render: (row) => {
        if (actionsRender) return actionsRender(row, openView, openEdit, openDelete)
        return (
          <ActionDropdown
            onView={() => openView(row)}
            onEdit={() => openEdit(row)}
            onDelete={() => openDelete(row)}
          />
        )
      },
    },
  ]

  if (loading && data.length === 0) return <LoadingState text={ar.common.loading} />

  return (
    <div className="space-y-6">
      {/* ✅ PageHeader مع زر Import */}
      <PageHeader
        title={title}
        description={description}
        breadcrumb={breadcrumb}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* ✅ زر Import */}
            {onImport && (
              <Button
                variant={showImport ? 'default' : 'outline'}
                onClick={toggleImport}
                className={showImport ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              >
                <Upload className="h-4 w-4" />
                {showImport ? 'إلغاء' : 'استيراد Excel'}
              </Button>
            )}

            {/* زر Export */}
            {data.length > 0 && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" />
                {ar.common.export || 'تصدير Excel'}
              </Button>
            )}

            {/* زر إضافة */}
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              {addLabel}
            </Button>
          </div>
        }
      />

      {/* ✅ Import Section (بيظهر تحت الـ Header) */}
      {showImport && onImport && (
        <div className="border rounded-lg p-4 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              <h3 className="font-medium">استيراد من Excel</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadTemplate}
              className="text-blue-600 hover:text-blue-800"
            >
              📥 تحميل النموذج
            </Button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
              disabled={importing}
            />

            {importFile && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                  📄 {importFile.name}
                </span>
                <button
                  onClick={handleRemoveImportFile}
                  className="text-red-500 hover:text-red-700"
                  disabled={importing}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {importFile && importPreview.length > 0 && importErrors.length === 0 && (
              <Button
                onClick={handleImport}
                disabled={importing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {importing ? 'جاري الاستيراد...' : 'استيراد'}
              </Button>
            )}
          </div>

          {/* Errors */}
          {importErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              {importErrors.map((err, idx) => (
                <div key={idx} className="flex items-start gap-2 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {/* Preview */}
          {showImportPreview && importPreview.length > 0 && importErrors.length === 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  معاينة البيانات ({importPreview.length} صف)
                </h4>
                <span className="text-xs text-gray-500">أول 5 صفوف فقط</span>
              </div>
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(importPreview[0]).map((key) => (
                        <th key={key} className="px-3 py-2 text-right border font-medium text-gray-600">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-3 py-2 border text-gray-700">
                            {val || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {importPreview.length > 5 && (
                <p className="text-xs text-gray-400 mt-1">
                  ... و {importPreview.length - 5} صفوف أخرى
                </p>
              )}
            </div>
          )}

          {!importFile && !importErrors.length && (
            <p className="text-xs text-gray-400">
              قم باختيار ملف Excel بالصيغة الصحيحة (.xlsx, .xls)
            </p>
          )}
        </div>
      )}

      {/* Filter Slot */}
      {filterSlot}

      {/* Data Table */}
      <DataTable
        columns={tableColumns}
        data={data}
        loading={loading}
        searchPlaceholder={searchPlaceholder}
        searchKeys={searchKeys}
        pageSize={10}
        stickyHeader
        showPageSizeSelector={false}
      />

      {/* Form Modal */}
      <FormModal
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setSelectedItem(null) }}
        title={isEditing ? formTitles.edit : formTitles.add}
        onSubmit={handleFormSave}
        loading={saving}
      >
        <FormComponent
          ref={formRef}
          defaultValues={selectedItem}
          onSubmit={handleFormSubmit}
          {...formProps}
        />
      </FormModal>

      {/* View Dialog */}
      <ViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title={viewTitle}
        fields={getViewFields ? getViewFields(selectedItem) : buildViewFields(selectedItem, viewLabels)}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={deleteLabels.title}
        description={deleteLabels.description}
        onConfirm={handleDelete}
      />
    </div>
  )
}