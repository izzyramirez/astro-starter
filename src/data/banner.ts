export interface Banner {
   enabled: boolean;
   text: string;
   href?: string;
   label?: string;
}

// TODO: Replace with your announcement, or set enabled: false
export const banner: Banner = {
   enabled: true,
   text: "Boilerplate is a lightweight Astro framework",
   href: "/",
};
