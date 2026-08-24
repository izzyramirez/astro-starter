export interface NavLink {
   label: string;
   href: string;
}

export interface NavGroup {
   title: string;
   links: NavLink[];
}

/**
 * A main-menu entry. The shape decides how it renders:
 *   href    -> plain link
 *   links   -> dropdown panel
 *   columns -> full-width mega panel
 */
export type NavItem =
   | { label: string; href: string }
   | { label: string; links: NavLink[] }
   | { label: string; columns: NavGroup[] };

export const mainMenu: NavItem[] = [
   { label: "Home", href: "/" },
   { label: "About", href: "#" },
   {
      label: "Resources",
      links: [
         { label: "Documentation", href: "#" },
         { label: "Changelog", href: "#" },
         { label: "Blog", href: "#" },
      ],
   },
   {
      label: "Platform",
      columns: [
         {
            title: "Build",
            links: [
               { label: "Components", href: "#" },
               { label: "Templates", href: "#" },
               { label: "Integrations", href: "#" },
            ],
         },
         {
            title: "Learn",
            links: [
               { label: "Documentation", href: "#" },
               { label: "Tutorials", href: "#" },
               { label: "Blog", href: "#" },
            ],
         },
         {
            title: "Company",
            links: [
               { label: "About", href: "#" },
               { label: "Careers", href: "#" },
               { label: "Contact", href: "#" },
            ],
         },
      ],
   },
];

export const footerMenu: NavGroup[] = [
   {
      title: "Product",
      links: [
         { label: "Features", href: "#" },
         { label: "Pricing", href: "#" },
         { label: "Changelog", href: "#" },
      ],
   },
   {
      title: "Company",
      links: [
         { label: "About", href: "#" },
         { label: "Blog", href: "#" },
         { label: "Careers", href: "#" },
      ],
   },
   {
      title: "Legal",
      links: [
         { label: "Privacy", href: "#" },
         { label: "Terms", href: "#" },
      ],
   },
];
