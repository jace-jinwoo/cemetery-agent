import Link from "next/link";

const variants = {
  primary: "bg-sage text-white hover:bg-forest",
  secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  danger: "bg-danger text-white hover:opacity-90",
} as const;

type Props = {
  variant?: keyof typeof variants;
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export default function Button({
  variant = "primary",
  children,
  href,
  type = "button",
  onClick,
}: Props) {
  const className = `inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${variants[variant]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
