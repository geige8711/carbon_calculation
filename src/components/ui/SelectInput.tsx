interface SelectInputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
  disabled?: boolean;
}

export default function SelectInput({ label, value, onChange, options, className = '', disabled = false }: SelectInputProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <label className={`text-sm whitespace-nowrap ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`border rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-500 ${disabled ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'}`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
