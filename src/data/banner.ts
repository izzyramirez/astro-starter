export interface Banner {
   enabled: boolean;
   text: string;
   href?: string;
   label?: string;
}

// bp-placeholder: Announcement bar copy — replace it, or set enabled: false.
export const banner: Banner = {
   enabled: true,
   text: "Boilerplate is a lightweight Astro framework",
   href: "/",
};
