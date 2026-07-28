import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { ar } from '@/constants/ar'
import { chemicalService } from '@/features/materials/services/chemicalService'
import ChemicalForm from './ChemicalForm'

const ChemicalManagement = ({ material, hideHeader = false, showForm = false, onFinished }) => {
  const [chemicals, setChemicals] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null) // id of chemical being edited
  const [formData, setFormData] = useState(null) // for edit form

  // Fetch chemicals for this material
  useEffect(() => {
    const loadChemicals = async () => {
      setLoading(true)
      try {
        const response = await chemicalService.getAll()
        const filtered = response.filter(c => c.material_id === material.id)
        setChemicals(filtered)
      } catch (err) {
        console.error('Failed to fetch chemicals:', err)
      } finally {
        setLoading(false)
      }
    }

    loadChemicals()
  }, [material.id])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const chemicalData = {
        ...data,
        material_id: material.id, // Ensure material_id is set
        chemicalType: data.chemicalType, // already a string from form
      }
      if (editId) {
        await chemicalService.update(editId, chemicalData)
        setEditId(null)
        setFormData(null)
      } else {
        await chemicalService.create(chemicalData)
      }
      // Refetch chemicals
      const response = await chemicalService.getAll()
      const filtered = response.filter(c => c.material_id === material.id)
      setChemicals(filtered)
    } catch (err) {
      console.error('Failed to save chemical:', err)
      // TODO: show error to user
    } finally {
      setLoading(false)
      if (onFinished) {
        onFinished()
      }
    }
  }

  const handleEdit = (chemical) => {
    setEditId(chemical.id)
    // Set form data for editing
    setFormData({
      chemicalType: chemical.chemicalType || '',
      stock: chemical.stock !== null && chemical.stock !== undefined ? chemical.stock : '',
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm(ar.common.deleteConfirmation)) {
      try {
        await chemicalService.delete(id)
        // Remove from list
        setChemicals(prev => prev.filter(c => c.id !== id))
      } catch (err) {
        console.error('Failed to delete chemical:', err)
      }
    }
  }

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {material.type === 'CHEMICAL' ? ar.materials.chemicalManagement : ''}
          </h2>
          <Button
            onClick={() => {
              setEditId(null)
              setFormData(null)
            }}
            variant="outline"
          >
            {ar.materials.addChemical}
          </Button>
        </div>
      )}

      {(showForm || editId !== null) && (
        <>
          {/* Chemical Form */}
          {editId && formData ? (
            <ChemicalForm
              defaultValues={formData}
              onSubmit={onSubmit}
            />
          ) : (
            <ChemicalForm
              onSubmit={onSubmit}
            />
          )}
        </>
      )}

      {/* Chemicals List */}
      <div className="border-t pt-4">
        {loading ? (
          <p className="text-center py-4">{ar.common.loading}</p>
        ) : (
          <>
            {chemicals.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                {ar.materials.noChemicalsYet}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{ar.materials.chemicalType}</th>
                    <th className="text-left p-2">{ar.materials.stock}</th>
                    <th className="text-center p-2">{ar.common.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {chemicals.map((chemical) => (
                    <tr key={chemical.id} className="border-t">
                      <td className="p-2">
                        {chemical.chemicalType || '-'}
                      </td>
                      <td className="p-2">
                        {chemical.stock !== null && chemical.stock !== undefined ? chemical.stock : '-'}
                      </td>
                      <td className="p-2 text-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(chemical)}
                          aria-label={ar.common.edit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(chemical.id)}
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

export default ChemicalManagement