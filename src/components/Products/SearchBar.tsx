import { useState } from "react";

type SearchBarProps = {
  value: string;
  onSearch: (value: string) => void | Promise<void>;
  onReset?: () => void | Promise<void>;
  placeholder?: string;
  className?: string;
};

export const SearchBar = ({
  value,
  onSearch,
  placeholder = "Buscar por nombre...",
  className = "",
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = async (nextValue: string) => {
    setLocalValue(nextValue);
    await onSearch(nextValue);
  };

  return (
    <div className={`product-controls__search ${className}`.trim()}>
      <div className="product-controls__search-row">
        <input
          id="product-search"
          value={localValue}
          onChange={(event) => void handleChange(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
