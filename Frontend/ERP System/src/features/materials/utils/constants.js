// Material types as per backend DTO (Arabic labels)
export const MATERIAL_TYPES = [
  { value: 'PAPER', label: 'ورق' },
  { value: 'INK', label: 'حبر' },
  { value: 'CHEMICAL', label: 'كيماويات' },
  { value: 'ZINC', label: 'زنك' },
  { value: 'PLATE', label: 'بليت' },
  { value: 'GLUE', label: 'لاصق' },
  { value: 'OTHER', label: 'أخرى' },
];

// Material units as per backend DTO (Arabic labels)
export const MATERIAL_UNITS = [
  { value: 'SHEET', label: 'ورقة' },
  { value: 'KG', label: 'كيلوغرام' },
  { value: 'Liter', label: 'لتر' },
  { value: 'PIECE', label: 'قطعة' },
];

// Helper to get label by value
export const getMaterialTypeLabel = (value) => {
  const found = MATERIAL_TYPES.find((t) => t.value === value);
  return found ? found.label : value;
};

export const getMaterialUnitLabel = (value) => {
  const found = MATERIAL_UNITS.find((u) => u.value === value);
  return found ? found.label : value;
};