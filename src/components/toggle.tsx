"use client";

type ToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-white">{label}</span>
        {description && (
          <span className="text-xs text-white/55">{description}</span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-sky-400/80" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[calc(100%-1.375rem)]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
