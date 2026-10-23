import type { NavIcon } from "@/lib/navigation";

const paths: Record<NavIcon, string[]> = {
  dashboard: ["M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"],
  contracts: [
    "M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z",
    "M14 4v4h4",
    "M9 13h6M9 17h4",
  ],
  plots: [
    "M4 4h7v7H4z",
    "M13 4h7v7h-7z",
    "M4 13h7v7H4z",
    "M13 13h7v7h-7z",
  ],
  billing: [
    "M3 8h18v8H3z",
    "M3 11h18",
    "M7 15h4",
  ],
  consultations: [
    "M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z",
  ],
  terminations: ["M7 7h10", "M9 7V5h6v2", "M8 7l1 12h6l1-12"],
  statistics: ["M5 19V10", "M12 19V5", "M19 19v-7"],
  reports: [
    "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
    "M14 3v5h5",
    "M8 17v-3M12 17V11M16 17v-5",
  ],
  settings: [
    "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    "M12 3.5v2",
    "M12 18.5v2",
    "M4.8 6.2l1.5 1.5",
    "M17.7 16.3l1.5 1.5",
    "M3.5 12h2",
    "M18.5 12h2",
    "M4.8 17.8l1.5-1.5",
    "M17.7 7.7l1.5-1.5",
  ],
};

export default function NavIcon({ name }: { name: NavIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      {paths[name].map((d) => (
        <path key={d} d={d} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
