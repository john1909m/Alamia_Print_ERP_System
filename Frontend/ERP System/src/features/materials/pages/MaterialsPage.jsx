import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MaterialForm from '@/features/materials/components/MaterialForm'
import PaperSection from '@/features/materials/components/PaperSection'
import InkSection from '@/features/materials/components/InkSection'
import ChemicalSection from '@/features/materials/components/ChemicalSection'
import { ar } from '@/constants/ar'
import { materialService } from '@/features/materials/services/materialService'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showMaterialForm, setShowMaterialForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [expandedMaterialId, setExpandedMaterialId] = useState(null)

  useEffect(() => {
    loadMaterials()
  }, [])

  const loadMaterials = async () => {
    setLoading(true)
    try {
      const response = await materialService.getAll()
      setMaterials(response || [])
    } catch (error) {
      console.error('Failed to fetch materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMaterials = materials.filter(m =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (data) => {
    try {
      if (editingMaterial) {
        await materialService.update(editingMaterial.id, data)
      } else {
        await materialService.create(data)
      }
      await loadMaterials()
      setShowMaterialForm(false)
      setEditingMaterial(null)
    } catch (error) {
      console.error('Failed to save material:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await materialService.delete(id)
        await loadMaterials()
        if (expandedMaterialId === id) {
          setExpandedMaterialId(null)
        }
      } catch (error) {
        console.error('Failed to delete material:', error)
      }
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      'PAPER': 'bg-blue-100 text-blue-800',
      'INK': 'bg-purple-100 text-purple-800',
      'CHEMICAL': 'bg-green-100 text-green-800',
      'ZINC': 'bg-gray-100 text-gray-800',
      'PLATE': 'bg-orange-100 text-orange-800',
      'GLUE': 'bg-yellow-100 text-yellow-800',
      'OTHER': 'bg-gray-100 text-gray-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getVariantSection = (material) => {
    switch (material.type) {
      case 'PAPER':
        return <PaperSection material={material} showForm={false} />
      case 'INK':
        return <InkSection material={material} showForm={false} />
      case 'CHEMICAL':
        return <ChemicalSection material={material} showForm={false} />
      default:
        return <p className="text-sm text-gray-500">Variant management not available for this type</p>
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Materials</h1>
          <p className="text-sm text-gray-500">{filteredMaterials.length} items</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            type="search"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={() => {
            setEditingMaterial(null)
            setShowMaterialForm(true)
          }}>
            + Add Material
          </Button>
        </div>
      </div>

      {/* Material Form Modal */}
      {showMaterialForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">
                {editingMaterial ? 'Edit Material' : 'Add Material'}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => {
                setShowMaterialForm(false)
                setEditingMaterial(null)
              }}>
                ✕
              </Button>
            </div>
            <MaterialForm
              defaultValues={editingMaterial}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowMaterialForm(false)
                setEditingMaterial(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Materials Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No materials found' : 'No materials available'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Unit</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map(material => (
                  <React.Fragment key={material.id}>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{material.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                          {material.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                          {material.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingMaterial(material)
                              setShowMaterialForm(true)
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDelete(material.id)}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setExpandedMaterialId(
                                expandedMaterialId === material.id ? null : material.id
                              )
                            }}
                          >
                            {expandedMaterialId === material.id ? '▲' : '▼'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedMaterialId === material.id && (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 bg-gray-50">
                          {getVariantSection(material)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}