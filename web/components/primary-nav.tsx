"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/characters", label: "Characters" },
  { href: "/builder/new", label: "New Builder" },
  { href: "/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className="site-shell__nav" aria-label="Primary">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            className={`site-shell__navLink${active ? " site-shell__navLink--active" : ""}`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
