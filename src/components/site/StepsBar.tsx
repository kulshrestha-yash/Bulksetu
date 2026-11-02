"use client";

// Checkout steps bar (Cart → Delivery & Payment → Confirmation)
export default function StepsBar({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Cart", "Delivery & Payment", "Confirmation"] as const;
  return (
    <div className="flex items-center gap-2.5 px-5 md:px-7 py-3.5 bg-card border-b border-border overflow-x-auto" aria-label="Checkout progress">
      {steps.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const done = n < current;
        const cur = n === current;
        return (
          <span key={label} className="flex items-center gap-2.5">
            {i > 0 && <span className="w-8 h-[2px] shrink-0 dashed-arrow" aria-hidden />}
            <span className={`flex items-center gap-1.5 text-[11.5px] whitespace-nowrap ${cur ? "text-ink font-extrabold" : done ? "text-navy" : "text-muted-foreground"}`}>
              <i
                className={`not-italic w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center text-[10px] font-bold ${
                  done ? "bg-navy border-navy text-white" : cur ? "border-orange text-orange-dark" : "border-input text-muted-foreground bg-white"
                }`}
              >
                {done ? "✓" : n}
              </i>
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
