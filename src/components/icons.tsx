import type { SVGProps } from "react";

export function SquadFundLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 1 1-3.98 19.34" />
      <path d="M17 2v6h-6" />
      <path d="M12 18h-1a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h1" />
      <path d="M15 11h-4" />
      <path d="M9 15h4" />
    </svg>
  );
}
