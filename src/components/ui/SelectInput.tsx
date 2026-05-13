import { useEffect, useId, useMemo, useRef, useState } from 'react';

interface SelectInputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const EMPTY_LABEL = '（未选择）';

export default function SelectInput({
  label,
  value,
  onChange,
  options,
  className = '',
  disabled = false,
  placeholder = '输入关键字搜索...',
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedRaw, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const highlighted = filtered.length === 0 ? 0 : Math.min(Math.max(highlightedRaw, 0), filtered.length - 1);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const displayValue = open ? query : (value || '');
  const showEmptyChip = !open && !value;

  const commit = (val: string) => {
    onChange(val);
    setQuery('');
    setOpen(false);
    setHighlighted(0);
    inputRef.current?.blur();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      setHighlighted((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && filtered[highlighted] != null) commit(filtered[highlighted]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const renderOption = (opt: string) => (opt === '' ? EMPTY_LABEL : opt);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label className={`text-sm whitespace-nowrap ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </label>
      )}
      <div ref={wrapperRef} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          disabled={disabled}
          value={displayValue}
          placeholder={showEmptyChip ? placeholder : placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onKeyDown={handleKey}
          className={`border rounded px-2 py-1.5 pr-7 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-500 ${
            disabled
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 bg-white'
          }`}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setOpen((o) => !o);
            if (!open) {
              setQuery('');
              inputRef.current?.focus();
            }
          }}
          className={`absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 px-1 ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          aria-label="切换下拉"
        >
          ▾
        </button>

        {open && !disabled && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 left-0 right-0 mt-1 max-h-60 overflow-auto rounded border border-gray-200 bg-white shadow-lg text-sm"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-gray-400 select-none">无匹配项</li>
            ) : (
              filtered.map((opt, idx) => {
                const isActive = idx === highlighted;
                const isSelected = opt === value;
                return (
                  <li
                    key={`${opt}-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlighted(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      commit(opt);
                    }}
                    className={`px-3 py-1.5 cursor-pointer ${
                      isActive ? 'bg-green-50 text-green-800' : 'text-gray-700'
                    } ${isSelected ? 'font-semibold' : ''}`}
                  >
                    {renderOption(opt)}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
