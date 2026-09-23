import { Check, XCircle } from "lucide-react";
import type { OrderStatus } from "../types";
import { ORDER_STATUS_LABELS } from "../constants";

const steps: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderStatusTracker({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
        <XCircle className="h-6 w-6" />
        <div>
          <p className="font-semibold">Order cancelled</p>
          <p className="text-sm">This order was cancelled and will not be shipped.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((step, index) => {
        const done = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                  done
                    ? "bg-indigo-600 text-white"
                    : "border-2 border-slate-200 bg-white text-slate-400"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={`text-xs font-medium ${
                  isCurrent ? "text-indigo-700" : done ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mb-4 h-0.5 flex-1 ${index < currentIndex ? "bg-indigo-600" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}