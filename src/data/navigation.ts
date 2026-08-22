export interface NavLink {
   label: string;
   href: string;
}

export interface NavGroup {
   title: string;
   links: NavLink[];
}

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
