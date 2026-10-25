export type NavLink = { href: string; label: string; description?: string };

export type NavItem = NavLink & {
  /** Dropdown entries; the parent href becomes the "see all" link. */
  children?: NavLink[];
  allLabel?: string;
};
