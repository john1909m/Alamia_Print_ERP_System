import { SearchInput } from '@/components/ui/search-input'

export function SearchBar({ value, onChange, placeholder, className }) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      containerClassName="w-full sm:max-w-xs"
    />
  )
}
