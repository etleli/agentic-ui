import { useEffect, useState } from 'react';
import { SearchInput } from './SearchInput';

export type SearchInputExampleProps = {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
};

export function SearchInputExample({ disabled = false, placeholder = 'Search components', value = 'risk' }: SearchInputExampleProps) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <div className="input-example">
      <SearchInput ariaLabel="Example search input" disabled={disabled} placeholder={placeholder} value={query} onValueChange={setQuery} />

      <div className="input-example__summary" role="status">
        <span>Query</span>
        <strong>{query || 'Empty'}</strong>
      </div>
    </div>
  );
}
