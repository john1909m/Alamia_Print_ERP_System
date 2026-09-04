import * as XLSX from 'xlsx'

export const exportToExcel = (data, fileName = 'export', columns = null) => {
  const filtered = columns
    ? data.map(row => Object.fromEntries(columns.map(col => [col.header, row[col.key]])))
    : data

  const worksheet = XLSX.utils.json_to_sheet(filtered)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}