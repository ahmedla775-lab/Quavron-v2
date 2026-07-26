export default function Modal({
  open,
  onClose,
  children,
  maxWidth = "max-w-2xl",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full
          ${maxWidth}
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          border
          border-slate-800
          bg-slate-900
          shadow-2xl
        `}
      >
        {children}
      </div>
    </div>
  );
}
