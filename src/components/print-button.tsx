"use client";

export function PrintButton() {
  return (
    <button type="button" className="sf-btn-primary" onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}
