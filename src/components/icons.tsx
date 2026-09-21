import type { SVGProps } from "react";

const TRAIT = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function CamionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} {...props}>
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h4l4 3v3h-8z" />
      <circle cx="6.5" cy="18" r="1.7" />
      <circle cx="16.5" cy="18" r="1.7" />
    </svg>
  );
}

export function BouclierIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} {...props}>
      <path d="M12 3.5 5 6v6c0 5 3.5 7.5 7 8.5 3.5-1 7-3.5 7-8.5V6l-7-2.5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}

export function PortefeuilleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} {...props}>
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h11a2 2 0 0 1 2 2V8h-13a2 2 0 0 0-2-2Z" />
      <path d="M3.5 8v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-14a2 2 0 0 1-1-1.5" />
      <circle cx="16.5" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5a9.3 9.3 0 0 0-8 14l-1 4.2 4.3-1.1a9.3 9.3 0 1 0 4.7-17.1Zm0 1.9a7.4 7.4 0 0 1 6.3 11.3 7.35 7.35 0 0 1-8.9 3l-.4-.2-2.6.7.7-2.5-.2-.4a7.4 7.4 0 0 1 5.1-11.9Z" />
    </svg>
  );
}

export function TelephoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.6 2.5 3.5 5.6c-.6.6-.8 1.5-.5 2.3C4.9 13 11 19.1 16.1 21c.8.3 1.7.1 2.3-.5l3.1-3.1c.7-.7.5-1.9-.4-2.3l-3.7-1.7c-.6-.3-1.3-.1-1.8.3l-1.3 1.3c-1.9-1.1-3.9-3.1-5-5l1.3-1.3c.4-.5.6-1.2.3-1.8L9.2 2.9c-.4-.9-1.6-1.1-2.3-.4Z" />
    </svg>
  );
}

export function CocheIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} strokeWidth={2.6} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function FermerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function CadeauIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} {...props}>
      <rect x="3.5" y="9" width="17" height="11" rx="2" />
      <path d="M12 9v11M3.5 13h17" />
      <path d="M12 9c-1.5-3.5-5.5-3.5-5.5-1.2 0 1.3 2 1.2 5.5 1.2Zm0 0c1.5-3.5 5.5-3.5 5.5-1.2 0 1.3-2 1.2-5.5 1.2Z" />
    </svg>
  );
}

export function MoinsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} {...props}>
      <path d="M6 12h12" />
    </svg>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} {...props}>
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}

export function ImageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4.5 18 4.5-4.5 3.5 3.5 3-3 4 4" />
    </svg>
  );
}

export function FlecheGaucheIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...TRAIT} strokeWidth={2.2} {...props}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}
