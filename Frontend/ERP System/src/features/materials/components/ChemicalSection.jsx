import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ChemicalForm from '@/features/materials/components/ChemicalForm'
import { chemicalService } from '@/features/materials/services/chemicalService'

const ChemicalSection = ({ material, showForm, onFinished }) => {
  const [chemicals, setChemicals] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingChemical, setEditingChemical] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadChemicals()
  }, [material.id])

  const loadChemicals = async () => {
    setLoading(true)
    try {
      const response = await chemicalService.getAll()
      const filtered = response.filter(c => c.materialId === material.id || c.material_id === material.id)
      setChemicals(filtered)
    } catch (error) {
      console.error('Failed to load chemicals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredChemicals = chemicals.filter(c =>
    c.chemicalType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(c.chemicalType) && c.chemicalType.join(', ').toLowerCase().includes(searchTerm.toLowerCase())) ||
    c.stock?.toString().includes(searchTerm)
  )

  const handleSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        materialId: material.id,
      }

      if (editingChemical) {
        await chemicalService.update(editingChemical.id, submitData)
      } else {
        await chemicalService.create(submitData)
      }
      await loadChemicals()
      setEditingChemical(null)
      setShowAddForm(false)
      if (onFinished) onFinished()
    } catch (error) {
      console.error('Failed to save chemical:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await chemicalService.delete(id)
        await loadChemicals()
      } catch (error) {
        console.error('Failed to delete chemical:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      {!showForm && !showAddForm && (
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">متغيرات المواد الكيميائية ({chemicals.length})</h3>
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            + إضافة مادة كيميائية
          </Button>
        </div>
      )}

      {(showForm || showAddForm) && (
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium mb-3">{editingChemical ? 'تعديل المادة الكيميائية' : 'إضافة مادة كيميائية'}</h4>
          <ChemicalForm
            defaultValues={editingChemical}
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingChemical(null)
              setShowAddForm(false)
            }}
          />
        </div>
      )}

      {!showForm && !showAddForm && (
        <>
          {loading ? (
            <p className="text-center text-gray-500">جاري التحميل...</p>
          ) : chemicals.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">لا يوجد مواد كيميائية</p>
          ) : (
            <div>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في المواد الكيميائية..."
                className="mb-2 w-full"
              />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-3 py-2 text-right">نوع المادة الكيميائية</th>
                      <th className="px-3 py-2 text-right">المخزون</th>
                      <th className="px-3 py-2 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChemicals.map(chemical => (
                      <tr key={chemical.id} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2">
                          {Array.isArray(chemical.chemicalType) ? chemical.chemicalType.join(', ') : chemical.chemicalType || '-'}
                        </td>
                        <td className="px-3 py-2">{chemical.stock || 0}</td>
                        <td className="px-3 py-2 text-center">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setEditingChemical(chemical)
                            setShowAddForm(true)
                          }}>تعديل</Button>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(chemical.id)}>حذف</Button>
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

export default ChemicalSection