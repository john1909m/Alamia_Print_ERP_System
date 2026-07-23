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
  { value: 'KG', label: 'كيلوغرام' },
  { value: 'G', label: 'غرام' },
  { value: 'L', label: 'لتر' },
  { value: 'ML', label: 'مللي لتر' },
  { value: 'PCS', label: 'قطعة' },
  { value: 'MT', label: 'متري' },
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