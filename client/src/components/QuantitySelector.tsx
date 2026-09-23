import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  max,
}: QuantitySelectorProps) {
  const atMin = quantity <= 1;
  const atMax = max !== undefined && quantity >= max;

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(quantity - 1)}
        disabled={atMin}
        className="flex h-10 w-10 items-center justify-center rounded-l-lg text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-12 text-center text-sm font-semibold" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        className="flex h-10 w-10 items-center justify-center rounded-r-lg text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}