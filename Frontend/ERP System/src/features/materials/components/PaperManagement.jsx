import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { ar } from '@/constants/ar'
import { paperService } from '@/features/materials/services/paperService'
import PaperForm from './PaperForm'

const PaperManagement = ({ material, hideHeader = false, showForm = false, onFinished }) => {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null) // id of paper being edited
  const [formData, setFormData] = useState(null) // for edit form

  // Fetch papers for this material
  useEffect(() => {
    const loadPapers = async () => {
      setLoading(true)
      try {
        const response = await paperService.getAll()
        const filtered = response.filter(p => p.material_id === material.id)
        setPapers(filtered)
      } catch (err) {
        console.error('Failed to fetch papers:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPapers()
  }, [material.id])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const paperData = {
        ...data,
        material_id: material.id, // Ensure material_id is set
      }
      if (editId) {
        await paperService.update(editId, paperData)
        setEditId(null)
        setFormData(null)
      } else {
        await paperService.create(paperData)
      }
      // Refetch papers
      const response = await paperService.getAll()
      const filtered = response.filter(p => p.material_id === material.id)
      setPapers(filtered)
    } catch (err) {
      console.error('Failed to save paper:', err)
      // TODO: show error to user
    } finally {
      setLoading(false)
      if (onFinished) {
        onFinished()
      }
    }
  }

  const handleEdit = (paper) => {
    setEditId(paper.id)
    // Set form data for editing
    setFormData({
      width: paper.width !== null && paper.width !== undefined ? paper.width : '',
      height: paper.height !== null && paper.height !== undefined ? paper.height : '',
      weight: paper.weight !== null && paper.weight !== undefined ? paper.weight : '',
      notes: paper.notes || '',
      stock: paper.stock !== null && paper.stock !== undefined ? paper.stock : '',
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm(ar.common.deleteConfirmation)) {
      try {
        await paperService.delete(id)
        // Remove from list
        setPapers(prev => prev.filter(p => p.id !== id))
      } catch (err) {
        console.error('Failed to delete paper:', err)
      }
    }
  }

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {material.type === 'PAPER' ? ar.materials.paperManagement : ''}
          </h2>
          <Button
            onClick={() => {
              setEditId(null)
              setFormData(null)
            }}
            variant="outline"
          >
            {ar.materials.addPaper}
          </Button>
        </div>
      )}

      {(showForm || editId !== null) && (
        <>
          {/* Paper Form */}
          {editId && formData ? (
            <PaperForm
              defaultValues={formData}
              onSubmit={onSubmit}
            />
          ) : (
            <PaperForm
              onSubmit={onSubmit}
            />
          )}
        </>
      )}

      {/* Papers List */}
      <div className="border-t pt-4">
        {loading ? (
          <p className="text-center py-4">{ar.common.loading}</p>
        ) : (
          <>
            {papers.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                {ar.materials.noPapersYet}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Width</th>
                    <th className="text-left p-2">Height</th>
                    <th className="text-left p-2">{ar.materials.weight}</th>
                    <th className="text-left p-2">{ar.materials.stock}</th>
                    <th className="text-center p-2">{ar.common.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {papers.map((paper) => (
                    <tr key={paper.id} className="border-t">
                      <td className="p-2">
                        {paper.width !== null && paper.width !== undefined ? paper.width : '-'}
                      </td>
                      <td className="p-2">
                        {paper.height !== null && paper.height !== undefined ? paper.height : '-'}
                      </td>
                      <td className="p-2">
                        {paper.weight !== null && paper.weight !== undefined ? paper.weight : '-'}
                      </td>
                      <td className="p-2">
                        {paper.stock !== null && paper.stock !== undefined ? paper.stock : '-'}
                      </td>
                      <td className="p-2 text-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(paper)}
                          aria-label={ar.common.edit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(paper.id)}
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

export default PaperManagement