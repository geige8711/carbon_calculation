interface GroupBoxProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function GroupBox({ title, children, className = '' }: GroupBoxProps) {
  return (
    <div className={`border border-gray-300 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-bold text-gray-700 -mt-7 bg-white px-2 w-fit">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
