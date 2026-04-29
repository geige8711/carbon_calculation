interface NumberInputProps {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  disabled?: boolean;
}

export default function NumberInput({
  label, value, onChange, min = 0, max = 1e12, step = 1, decimals: _decimals = 2, className = '', suffix, disabled = false,
}: NumberInputProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <label className={`text-sm whitespace-nowrap ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{label}</label>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`border rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-500 ${disabled ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300'}`}
      />
      {suffix && <span className="text-xs text-gray-500 whitespace-nowrap">{suffix}</span>}
    </div>
  );
}
