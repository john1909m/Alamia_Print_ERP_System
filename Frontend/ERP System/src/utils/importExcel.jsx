// src/features/shared/components/ImportExcel.jsx
import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'

export function ImportExcel({
  onImport,
  loading = false,
  accept = '.xlsx,.xls',
  fileName = 'import',
  columns = null, // [{ key: 'name', header: 'Name' }]
  templateHeaders = null, // ['Name', 'Email', 'Phone']
}) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [errors, setErrors] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setErrors([])
    previewFile(selectedFile)
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)

        // Validate headers
        if (jsonData.length === 0) {
          setErrors(['الملف فارغ أو لا يحتوي على بيانات'])
          setPreview([])
          setShowPreview(true)
          return
        }

        // Check if headers match expected columns
        const headers = Object.keys(jsonData[0])
        if (columns) {
          const expectedHeaders = columns.map(c => c.header)
          const missingHeaders = expectedHeaders.filter(h => !headers.includes(h))
          if (missingHeaders.length > 0) {
            setErrors([`الأعمدة التالية غير موجودة: ${missingHeaders.join(', ')}`])
          }
        }

        setPreview(jsonData)
        setShowPreview(true)
      } catch (error) {
        setErrors(['حدث خطأ أثناء قراءة الملف: ' + error.message])
        setShowPreview(true)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview([])
    setErrors([])
    setShowPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImport = async () => {
    if (!file || preview.length === 0) return

    setImporting(true)
    try {
      // Map preview data to match expected format
      const importData = columns
        ? preview.map(row => {
            const mappedRow = {}
            columns.forEach(col => {
              mappedRow[col.key] = row[col.header] || null
            })
            return mappedRow
          })
        : preview

      await onImport(importData)
      handleRemoveFile()
    } catch (error) {
      setErrors([error.message || 'حدث خطأ أثناء الاستيراد'])
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = templateHeaders || (columns ? columns.map(c => c.header) : [])
    const worksheet = XLSX.utils.json_to_sheet([Object.fromEntries(headers.map(h => [h, '']))])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')
    XLSX.writeFile(workbook, `${fileName}_template.xlsx`)
  }

  return (
    <div className="border rounded-lg p-4 bg-white space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          <h3 className="font-medium">استيراد من Excel</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={downloadTemplate}
          className="text-blue-600 hover:text-blue-800"
        >
          📥 تحميل النموذج
        </Button>
      </div>

      {/* File Input */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer"
          disabled={importing || loading}
        />

        {file && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 truncate max-w-[200px]">
              📄 {file.name}
            </span>
            <button
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
              disabled={importing || loading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {file && preview.length > 0 && (
          <Button
            onClick={handleImport}
            disabled={importing || loading || errors.length > 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {importing ? 'جاري الاستيراد...' : 'استيراد'}
          </Button>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          {errors.map((err, idx) => (
            <div key={idx} className="flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      {showPreview && preview.length > 0 && errors.length === 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              معاينة البيانات ({preview.length} صف)
            </h4>
            <span className="text-xs text-gray-500">
              أول 5 صفوف فقط
            </span>
          </div>
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0]).map((key) => (
                    <th key={key} className="px-3 py-2 text-right border font-medium text-gray-600">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 5).map((row, idx) => (
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
          {preview.length > 5 && (
            <p className="text-xs text-gray-400 mt-1">
              ... و {preview.length - 5} صفوف أخرى
            </p>
          )}
        </div>
      )}

      {/* Success Message */}
      {!file && !errors.length && (
        <p className="text-xs text-gray-400">
          قم باختيار ملف Excel بالصيغة الصحيحة (.xlsx, .xls)
        </p>
      )}
    </div>
  )
}