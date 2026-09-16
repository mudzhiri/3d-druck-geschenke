import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  markOnly?: boolean;
  invert?: boolean;
};

/** Feastables-style bold wordmark — brand first, always. */
export function BrandLogo({ className, markOnly = false, invert = false }: Props) {
  const ink = invert ? brand.colors.paper : brand.colors.ink;
  const yellow = brand.colors.yellow;

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={brand.name}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="64" height="64" rx="6" fill={yellow} />
        <path
          d="M12 18h18v8H20v4h9v7H20v9H12V18zm24 0h16v8H44v20h-8V18z"
          fill={ink}
        />
      </svg>
      {!markOnly && (
        <span
          className="display text-[1.35rem] font-black uppercase leading-none tracking-[-0.04em] sm:text-[1.55rem]"
          style={{ color: ink }}
        >
          {brand.wordmark}
        </span>
      )}
    </span>
  );
}
