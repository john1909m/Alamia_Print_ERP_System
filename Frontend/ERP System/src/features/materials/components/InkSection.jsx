import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import InkForm from '@/features/materials/components/InkForm'
import { inkService } from '@/features/materials/services/inkService'

const InkSection = ({ material, showForm, onFinished }) => {
  const [inks, setInks] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingInk, setEditingInk] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadInks()
  }, [material.id])

  const loadInks = async () => {
    setLoading(true)
    try {
      const response = await inkService.getAll()
      const filtered = response.filter(i => i.materialId === material.id || i.material_id === material.id)
      setInks(filtered)
    } catch (error) {
      console.error('Failed to load inks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInks = inks.filter(i =>
    i.inkType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(i.inkType) && i.inkType.join(', ').toLowerCase().includes(searchTerm.toLowerCase())) ||
    i.stock?.toString().includes(searchTerm)
  )

  const handleSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        materialId: material.id,
      }

      if (editingInk) {
        await inkService.update(editingInk.id, submitData)
      } else {
        await inkService.create(submitData)
      }
      await loadInks()
      setEditingInk(null)
      setShowAddForm(false)
      if (onFinished) onFinished()
    } catch (error) {
      console.error('Failed to save ink:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await inkService.delete(id)
        await loadInks()
      } catch (error) {
        console.error('Failed to delete ink:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      {!showForm && !showAddForm && (
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">متغيرات الحبر ({inks.length})</h3>
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            + إضافة حبر
          </Button>
        </div>
      )}

      {(showForm || showAddForm) && (
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium mb-3">{editingInk ? 'تعديل الحبر' : 'إضافة حبر'}</h4>
          <InkForm
            defaultValues={editingInk}
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingInk(null)
              setShowAddForm(false)
            }}
          />
        </div>
      )}

      {!showForm && !showAddForm && (
        <>
          {loading ? (
            <p className="text-center text-gray-500">جاري التحميل...</p>
          ) : inks.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">لا يوجد حبر</p>
          ) : (
            <div>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في الحبر..."
                className="mb-2 w-full"
              />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-3 py-2 text-right">نوع الحبر</th>
                      <th className="px-3 py-2 text-right">المخزون</th>
                      <th className="px-3 py-2 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInks.map(ink => (
                      <tr key={ink.id} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2">
                          {Array.isArray(ink.inkType) ? ink.inkType.join(', ') : ink.inkType || '-'}
                        </td>
                        <td className="px-3 py-2">{ink.stock || 0}</td>
                        <td className="px-3 py-2 text-center">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setEditingInk(ink)
                            setShowAddForm(true)
                          }}>تعديل</Button>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(ink.id)}>حذف</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InkSection