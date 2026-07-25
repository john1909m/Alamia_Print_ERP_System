import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { CheckCircle, Plus, Trash2, Edit, ChevronDown, ChevronUp, Package, ShoppingCart } from 'lucide-react'
import { materialService } from '@/features/materials/services/materialService'
import { MaterialForm } from '@/features/materials/components/MaterialForm'
import { PaperManagement } from '@/features/materials/components/PaperManagement'
import { InkManagement } from '@/features/materials/components/InkManagement'
import { ChemicalManagement } from '@/features/materials/components/ChemicalManagement'
import { ar } from '@/constants/ar'
import { MATERIAL_TYPES, MATERIAL_UNITS } from '@/features/materials/utils/constants'

// Helper to get material type label
const getMaterialTypeLabel = (value) => {
  const found = MATERIAL_TYPES.find((t) => t.value === value)
  return found ? found.label : value
}

// Helper to get material unit label
const getMaterialUnitLabel = (value) => {
  const found = MATERIAL_UNITS.find((u) => u.value === value)
  return found ? found.label : value
}

// Helper to get color based on material type
const getMaterialTypeColor = (type) => {
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

export default function MaterialsPage() {
  // State for materials
  const [materials, setMaterials] = useState([])
  const [expandedMaterialId, setExpandedMaterialId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // State for forms
  const [materialFormVisible, setMaterialFormVisible] = useState(false)
  const [materialFormMode, setMaterialFormMode] = useState('create')
  const [materialFormData, setMaterialFormData] = useState(null)

  // Fetch materials on mount
  useEffect(() => {
    const fetchMaterials = async () => {
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
    fetchMaterials()
  }, [])

  // Filter materials based on search term
  const filteredMaterials = useMemo(() => {
    if (!searchTerm.trim()) return materials
    return materials.filter(material =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [materials, searchTerm])

  // Material form handlers
  const handleCreateMaterial = () => {
    setMaterialFormMode('create')
    setMaterialFormData(null)
    setMaterialFormVisible(true)
  }

  const handleEditMaterial = (material) => {
    setMaterialFormMode('edit')
    setMaterialFormData(material)
    setMaterialFormVisible(true)
  }

  const handleDeleteMaterial = async (id) => {
    if (window.confirm(ar.materials.deleteConfirm)) {
      try {
        await materialService.delete(id)
        setMaterials(prev => prev.filter(m => m.id !== id))
        if (expandedMaterialId === id) {
          setExpandedMaterialId(null)
        }
      } catch (error) {
        console.error('Failed to delete material:', error)
      }
    }
  }

  const handleMaterialFormSubmit = async (data) => {
    try {
      if (materialFormMode === 'create') {
        const response = await materialService.create(data)
        setMaterials(prev => [...prev, response])
      } else {
        const response = await materialService.update(materialFormData.id, data)
        setMaterials(prev => prev.map(m => m.id === materialFormData.id ? response : m))
      }
      setMaterialFormVisible(false)
    } catch (error) {
      console.error('Failed to save material:', error)
    }
  }

  const handleToggleExpand = async (materialId) => {
    setExpandedMaterialId(prev => (prev === materialId ? null : materialId))
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{ar.materials.title || 'Materials'}</h1>
          <span className="text-sm text-muted-foreground">
            ({filteredMaterials.length} {ar.materials.items || 'items'})
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Input
              type="search"
              placeholder={ar.materials.search || 'Search materials...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Button onClick={handleCreateMaterial} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            {ar.materials.add}
          </Button>
        </div>
      </div>

      {/* Material Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-right">{ar.materials.name}</th>
                <th className="px-4 py-3 text-right">{ar.materials.type}</th>
                <th className="px-4 py-3 text-right">{ar.materials.unit}</th>
                <th className="px-4 py-3 text-center w-32">{ar.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    {ar.common.loading || 'Loading...'}
                  </td>
                </tr>
              ) : filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No materials found matching your search' : 'No materials available'}
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((material) => (
                  <React.Fragment key={material.id}>
                    <tr className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{material.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaterialTypeColor(material.type)}`}>
                          {getMaterialTypeLabel(material.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                          {getMaterialUnitLabel(material.unit)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMaterial(material)}
                            aria-label={ar.common.edit}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMaterial(material.id)}
                            aria-label={ar.common.delete}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleExpand(material.id)}
                            aria-label={expandedMaterialId === material.id ? 'collapse' : 'expand'}
                            className="h-8 w-8"
                          >
                            {expandedMaterialId === material.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedMaterialId === material.id && (
                      <tr>
                        <td colSpan={4} className="px-0 pt-0">
                          <div className="border-t">
                            {/* Render appropriate management component based on material type */}
                            {material.type === 'PAPER' && (
                              <PaperManagement material={material} />
                            )}
                            {material.type === 'INK' && (
                              <InkManagement material={material} />
                            )}
                            {material.type === 'CHEMICAL' && (
                              <ChemicalManagement material={material} />
                            )}
                            {/* For other material types, we show a placeholder */}
                            {!(['PAPER', 'INK', 'CHEMICAL'].includes(material.type)) && (
                              <div className="p-4">
                                <div className="mb-4">
                                  <h3 className="font-semibold text-gray-700">
                                    {material.type === 'ZINC' ? ar.materials.zincManagement :
                                     material.type === 'PLATE' ? ar.materials.plateManagement :
                                     material.type === 'GLUE' ? ar.materials.glueManagement :
                                     ar.materials.otherManagement}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {ar.materials.basicVariantManagement}
                                  </p>
                                </div>
                                <div className="text-center py-8">
                                  <p className="text-muted-foreground">
                                    {ar.materials.variantManagementNotImplemented}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Material Form Dialog */}
      <Dialog open={materialFormVisible} onOpenChange={setMaterialFormVisible}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {materialFormMode === 'create' ? ar.materials.add : ar.materials.edit}
            </DialogTitle>
          </DialogHeader>
          <MaterialForm
            defaultValues={materialFormMode === 'edit' ? materialFormData : undefined}
            onSubmit={handleMaterialFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}