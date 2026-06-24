export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: { icon: 20, text: 'text-sm' }, md: { icon: 28, text: 'text-base' }, lg: { icon: 36, text: 'text-xl' } };
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2">
      {/* Graduation cap SVG icon in brand teal/green */}
      <img src="/gen-logo.svg" alt="AcademiaFlow Logo" />
      {/* <svg width={s.icon} height={s.icon} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 4L2 12L18 20L34 12L18 4Z" fill="#0f2d40" />
        <path d="M6 15.5V24C6 24 10 28 18 28C26 28 30 24 30 24V15.5L18 21.5L6 15.5Z" fill="#16a34a" />
        <rect x="32" y="12" width="2" height="10" rx="1" fill="#0f2d40" />
        <circle cx="33" cy="23" r="2" fill="#0f2d40" />
      </svg>
      <span className={`font-bold ${s.text} text-navy`}>
        Academia<span className="text-primary">Flow</span>
      </span> */}
    </div>
  );
}
