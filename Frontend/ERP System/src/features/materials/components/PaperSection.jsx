import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PaperForm from '@/features/materials/components/PaperForm'
import { paperService } from '@/features/materials/services/paperService'

const PaperSection = ({ material, showForm, onFinished }) => {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingPaper, setEditingPaper] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadPapers()
  }, [material.id])

  const loadPapers = async () => {
    setLoading(true)
    try {
      const response = await paperService.getAll()
      // التصفية باستخدام materialId
      const filtered = response.filter(p => p.materialId === material.id || p.material_id === material.id)
      setPapers(filtered)
    } catch (error) {
      console.error('Failed to load papers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPapers = papers.filter(p =>
    p.width?.toString().includes(searchTerm) ||
    p.height?.toString().includes(searchTerm) ||
    p.weight?.toString().includes(searchTerm) ||
    p.stock?.toString().includes(searchTerm)
  )

  const handleSubmit = async (data) => {
    try {
      // تأكد من إضافة materialId بالشكل الصحيح
      const submitData = {
        ...data,
        materialId: material.id, // استخدم materialId بدلاً من material_id
      }

      if (editingPaper) {
        await paperService.update(editingPaper.id, submitData)
      } else {
        await paperService.create(submitData)
      }
      await loadPapers()
      setEditingPaper(null)
      setShowAddForm(false)
      if (onFinished) onFinished()
    } catch (error) {
      console.error('Failed to save paper:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await paperService.delete(id)
        await loadPapers()
      } catch (error) {
        console.error('Failed to delete paper:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      {!showForm && !showAddForm && (
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">متغيرات الورق ({papers.length})</h3>
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            + إضافة ورق
          </Button>
        </div>
      )}

      {(showForm || showAddForm) && (
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium mb-3">{editingPaper ? 'تعديل الورق' : 'إضافة ورق'}</h4>
          <PaperForm
            defaultValues={editingPaper}
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingPaper(null)
              setShowAddForm(false)
            }}
          />
        </div>
      )}

      {!showForm && !showAddForm && (
        <>
          {loading ? (
            <p className="text-center text-gray-500">جاري التحميل...</p>
          ) : papers.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">لا يوجد ورق</p>
          ) : (
            <div>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في الورق..."
                className="mb-2 w-full"
              />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-3 py-2 text-right">العرض</th>
                      <th className="px-3 py-2 text-right">الارتفاع</th>
                      <th className="px-3 py-2 text-right">الوزن</th>
                      <th className="px-3 py-2 text-right">المخزون</th>
                      <th className="px-3 py-2 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPapers.map(paper => (
                      <tr key={paper.id} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2">{paper.width}</td>
                        <td className="px-3 py-2">{paper.height}</td>
                        <td className="px-3 py-2">{paper.weight}</td>
                        <td className="px-3 py-2">{paper.stock || 0}</td>
                        <td className="px-3 py-2 text-center">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setEditingPaper(paper)
                            setShowAddForm(true)
                          }}>تعديل</Button>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(paper.id)}>حذف</Button>
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

export default PaperSection