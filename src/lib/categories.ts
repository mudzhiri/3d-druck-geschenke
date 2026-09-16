import { type Locale, pickLocalized } from "@/lib/brand";

export type ShopCategory = {
  id: string;
  slug: string;
  name: Record<Locale, string>;
  subcategories: Array<{
    id: string;
    slug: string;
    name: Record<Locale, string>;
  }>;
};

/**
 * Taxonomy from market research (Etsy / MakerWorld / gift bestsellers):
 * personalized keychains & tags, articulating flexi, fidgets, desk organizers,
 * phone/headphone stands, name plates, ornaments, cake toppers, pet tags, lamps.
 */
export const shopCategories: ShopCategory[] = [
  {
    id: "cat-personalized",
    slug: "personalisiert",
    name: {
      de: "Personalisiert",
      en: "Personalized",
      fr: "Personnalisé",
      es: "Personalizado",
      it: "Personalizzato",
      zh: "个性化",
    },
    subcategories: [
      {
        id: "sub-keychains",
        slug: "schluesselanhaenger",
        name: {
          de: "Schlüsselanhänger",
          en: "Keychains",
          fr: "Porte-clés",
          es: "Llaveros",
          it: "Portachiavi",
          zh: "钥匙扣",
        },
      },
      {
        id: "sub-nameplates",
        slug: "namensschilder",
        name: {
          de: "Namensschilder",
          en: "Name plates",
          fr: "Plaques nom",
          es: "Placas de nombre",
          it: "Targhette",
          zh: "名牌",
        },
      },
      {
        id: "sub-tags",
        slug: "tags",
        name: {
          de: "Taschen- & Rucksack-Tags",
          en: "Bag & backpack tags",
          fr: "Étiquettes sac",
          es: "Etiquetas mochila",
          it: "Tag zaino",
          zh: "书包挂牌",
        },
      },
      {
        id: "sub-ornaments",
        slug: "anhaenger-deko",
        name: {
          de: "Deko-Anhänger",
          en: "Ornaments",
          fr: "Ornements",
          es: "Adornos",
          it: "Ornamenti",
          zh: "装饰挂件",
        },
      },
    ],
  },
  {
    id: "cat-desk",
    slug: "desk-setup",
    name: {
      de: "Desk & Setup",
      en: "Desk & Setup",
      fr: "Bureau",
      es: "Escritorio",
      it: "Desk",
      zh: "桌面",
    },
    subcategories: [
      {
        id: "sub-organizer",
        slug: "organizer",
        name: {
          de: "Organizer",
          en: "Organizers",
          fr: "Rangements",
          es: "Organizadores",
          it: "Organizer",
          zh: "收纳",
        },
      },
      {
        id: "sub-stands",
        slug: "staender",
        name: {
          de: "Ständer",
          en: "Stands",
          fr: "Supports",
          es: "Soportes",
          it: "Supporti",
          zh: "支架",
        },
      },
      {
        id: "sub-cables",
        slug: "kabel",
        name: {
          de: "Kabel-Clips",
          en: "Cable clips",
          fr: "Clips câble",
          es: "Clips cable",
          it: "Clip cavi",
          zh: "理线夹",
        },
      },
    ],
  },
  {
    id: "cat-play",
    slug: "play-fidget",
    name: {
      de: "Play & Fidget",
      en: "Play & Fidget",
      fr: "Play & Fidget",
      es: "Play & Fidget",
      it: "Play & Fidget",
      zh: "解压玩具",
    },
    subcategories: [
      {
        id: "sub-flexi",
        slug: "flexi",
        name: {
          de: "Flexi & Articulated",
          en: "Flexi & articulated",
          fr: "Flexi articulés",
          es: "Flexi articulados",
          it: "Flexi articolati",
          zh: "关节模型",
        },
      },
      {
        id: "sub-clicker",
        slug: "clicker",
        name: {
          de: "Clicker & Spinner",
          en: "Clickers & spinners",
          fr: "Clickers",
          es: "Clickers",
          it: "Clicker",
          zh: "按压解压",
        },
      },
    ],
  },
  {
    id: "cat-home",
    slug: "home-deko",
    name: {
      de: "Home & Deko",
      en: "Home & Decor",
      fr: "Maison",
      es: "Hogar",
      it: "Casa",
      zh: "家居装饰",
    },
    subcategories: [
      {
        id: "sub-lamps",
        slug: "lampen",
        name: {
          de: "Lampen & Lichter",
          en: "Lamps & lights",
          fr: "Lampes",
          es: "Lámparas",
          it: "Lampade",
          zh: "灯饰",
        },
      },
      {
        id: "sub-plants",
        slug: "pflanzen",
        name: {
          de: "Pflanzen-Töpfe",
          en: "Planters",
          fr: "Pots",
          es: "Maceteros",
          it: "Vasi",
          zh: "花盆",
        },
      },
      {
        id: "sub-hooks",
        slug: "haken",
        name: {
          de: "Haken & Ablagen",
          en: "Hooks & trays",
          fr: "Crochets",
          es: "Ganchos",
          it: "Ganci",
          zh: "挂钩托盘",
        },
      },
    ],
  },
  {
    id: "cat-kids",
    slug: "kids-schule",
    name: {
      de: "Kids & Schule",
      en: "Kids & School",
      fr: "Enfants",
      es: "Niños",
      it: "Kids",
      zh: "儿童学校",
    },
    subcategories: [
      {
        id: "sub-school-tags",
        slug: "schul-tags",
        name: {
          de: "Schul-Tags",
          en: "School tags",
          fr: "Tags école",
          es: "Tags colegio",
          it: "Tag scuola",
          zh: "学校挂牌",
        },
      },
      {
        id: "sub-bookmarks",
        slug: "lesezeichen",
        name: {
          de: "Lesezeichen",
          en: "Bookmarks",
          fr: "Marque-pages",
          es: "Marcapáginas",
          it: "Segnalibri",
          zh: "书签",
        },
      },
    ],
  },
  {
    id: "cat-occasions",
    slug: "anlaesse",
    name: {
      de: "Anlässe",
      en: "Occasions",
      fr: "Occasions",
      es: "Ocaciones",
      it: "Occasioni",
      zh: "节日场合",
    },
    subcategories: [
      {
        id: "sub-birthday",
        slug: "geburtstag",
        name: {
          de: "Geburtstag",
          en: "Birthday",
          fr: "Anniversaire",
          es: "Cumpleaños",
          it: "Compleanno",
          zh: "生日",
        },
      },
      {
        id: "sub-wedding",
        slug: "hochzeit",
        name: {
          de: "Hochzeit",
          en: "Wedding",
          fr: "Mariage",
          es: "Boda",
          it: "Matrimonio",
          zh: "婚礼",
        },
      },
      {
        id: "sub-pets",
        slug: "haustiere",
        name: {
          de: "Haustiere",
          en: "Pets",
          fr: "Animaux",
          es: "Mascotas",
          it: "Animali",
          zh: "宠物",
        },
      },
    ],
  },
];

export function getCategory(slug: string) {
  return shopCategories.find((c) => c.slug === slug);
}

export function getSubcategory(categorySlug: string, subSlug: string) {
  const cat = getCategory(categorySlug);
  return cat?.subcategories.find((s) => s.slug === subSlug);
}

export function categoryLabel(locale: Locale, categoryId: string) {
  const cat = shopCategories.find((c) => c.id === categoryId);
  return cat ? pickLocalized(cat.name, locale) : categoryId;
}

export function subcategoryLabel(locale: Locale, subcategoryId: string) {
  for (const cat of shopCategories) {
    const sub = cat.subcategories.find((s) => s.id === subcategoryId);
    if (sub) return pickLocalized(sub.name, locale);
  }
  return subcategoryId;
}
