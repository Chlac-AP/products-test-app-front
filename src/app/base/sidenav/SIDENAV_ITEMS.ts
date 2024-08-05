import { SidenavItem } from "app/base/sidenav/sidenav.model";

export const SIDENAV_ITEMS: SidenavItem[] = [
  {
    id: 'products',
    labels: {
      en: "Products",
      fr: "Produits"
    },
    link: '/products',
    icon: 'shopping-cart'

  },
  {
    id: 'products/admin',
    labels: {
      en: "Admin",
      fr: "Admin"
    },
    link: '/products/admin',
    icon: 'users'

  },

];