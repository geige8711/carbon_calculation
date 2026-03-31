interface SelectInputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}

export default function SelectInput({ label, value, onChange, options, className = '' }: SelectInputProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <label className="text-sm text-gray-600 whitespace-nowrap">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
