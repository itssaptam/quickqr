export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/generator", label: "Generator" },
  { href: "/my-codes", label: "My QR Codes" },
  { href: "/scanner", label: "Scanner" },
  { href: "/about", label: "About" },
] as const;

/** True when `pathname` is the nav item's route or a child of it. */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
