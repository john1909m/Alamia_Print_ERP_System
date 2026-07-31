// src/features/materials/components/PaperSection.jsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PaperForm from '@/features/materials/components/PaperForm'
import { paperService } from '@/features/materials/services/paperService'

// دالة للحصول على التسمية العربية لنوع الورق
const getPaperTypeLabel = (type) => {
  const labels = {
    'WHITE': 'أبيض',
    'COATED': 'مغطى',
    'BRISTOL_COATED': 'بريستول مغطى',
    'STICKER': 'ستيكر',
    'DUPLEX': 'دوبلكس',
  }
  return labels[type] || type || '-'
}

// دالة للحصول على لون نوع الورق
const getPaperTypeColor = (type) => {
  const colors = {
    'WHITE': 'bg-gray-100 text-gray-800',
    'COATED': 'bg-blue-100 text-blue-800',
    'BRISTOL_COATED': 'bg-purple-100 text-purple-800',
    'STICKER': 'bg-yellow-100 text-yellow-800',
    'DUPLEX': 'bg-green-100 text-green-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

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
      const filtered = response.filter(p => p.materialId === material.id || p.material_id === material.id)
      setPapers(filtered)
    } catch (error) {
      console.error('Failed to load papers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPapers = papers.filter(p =>
    p.paperType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.width?.toString().includes(searchTerm) ||
    p.height?.toString().includes(searchTerm) ||
    p.weight?.toString().includes(searchTerm) ||
    p.stock?.toString().includes(searchTerm)
  )

  const handleSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        materialId: material.id,
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
                      <th className="px-3 py-2 text-right">النوع</th>
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
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaperTypeColor(paper.paperType)}`}>
                            {getPaperTypeLabel(paper.paperType)}
                          </span>
                        </td>
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