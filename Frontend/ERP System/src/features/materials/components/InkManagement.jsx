import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { ar } from '@/constants/ar'
import { inkService } from '@/features/materials/services/inkService'
import InkForm from './InkForm'

const InkManagement = ({ material, hideHeader = false }) => {
  const [inks, setInks] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null) // id of ink being edited
  const [formData, setFormData] = useState(null) // for edit form

  // Fetch inks for this material
  useEffect(() => {
    const loadInks = async () => {
      setLoading(true)
      try {
        const response = await inkService.getAll()
        const filtered = response.filter(i => i.material_id === material.id)
        setInks(filtered)
      } catch (err) {
        console.error('Failed to fetch inks:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInks()
  }, [material.id])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const inkData = {
        ...data,
        material_id: material.id, // Ensure material_id is set
        inkType: data.inkType, // already transformed to array by zod
      }
      if (editId) {
        await inkService.update(editId, inkData)
        setEditId(null)
        setFormData(null)
      } else {
        await inkService.create(inkData)
      }
      // Refetch inks
      const response = await inkService.getAll()
      const filtered = response.filter(i => i.material_id === material.id)
      setInks(filtered)
    } catch (err) {
      console.error('Failed to save ink:', err)
      // TODO: show error to user
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (ink) => {
    setEditId(ink.id)
    // Set form data for editing
    setFormData({
      name: ink.name || '',
      inkType: Array.isArray(ink.inkType) ? ink.inkType.join(', ') : '',
      notes: ink.notes || '',
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm(ar.common.deleteConfirmation)) {
      try {
        await inkService.delete(id)
        // Remove from list
        setInks(prev => prev.filter(i => i.id !== id))
      } catch (err) {
        console.error('Failed to delete ink:', err)
      }
    }
  }

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {material.type === 'INK' ? ar.materials.inkManagement : ''}
          </h2>
          <Button
            onClick={() => {
              setEditId(null)
              setFormData(null)
            }}
            variant="outline"
          >
            {ar.materials.addInk}
          </Button>
        </div>
      )}

      {/* Ink Form */}
      {editId && formData ? (
        <InkForm
          defaultValues={formData}
          onSubmit={onSubmit}
        />
      ) : (
        <InkForm
          onSubmit={onSubmit}
        />
      )}

      {/* Inks List */}
      <div className="border-t pt-4">
        {loading ? (
          <p className="text-center py-4">{ar.common.loading}</p>
        ) : (
          <>
            {inks.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                {ar.materials.noInksYet}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{ar.materials.name}</th>
                    <th className="text-left p-2">{ar.materials.inkType}</th>
                    <th className="text-center p-2">{ar.common.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {inks.map((ink) => (
                    <tr key={ink.id} className="border-t">
                      <td className="p-2">{ink.name}</td>
                      <td className="p-2">
                        {Array.isArray(ink.inkType) ? ink.inkType.join(', ') : ink.inkType}
                      </td>
                      <td className="p-2 text-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(ink)}
                          aria-label={ar.common.edit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(ink.id)}
                          aria-label={ar.common.delete}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default InkManagement