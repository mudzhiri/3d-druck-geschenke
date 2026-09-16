import type { Locale } from "@/lib/brand";
import { pickLocalized } from "@/lib/brand";

/** Product display names for all shop locales (catalog stores de+en; extras fill the rest). */
export const productNamesExtra: Record<
  string,
  Partial<Record<"fr" | "es" | "it" | "zh", string>>
> = {
  "name-keychain": {
    fr: "Porte-clés prénom",
    es: "Llavero con nombre",
    it: "Portachiavi nome",
    zh: "姓名钥匙扣",
  },
  "rucksack-tag": {
    fr: "Étiquette sac à dos",
    es: "Etiqueta mochila",
    it: "Tag zaino",
    zh: "书包挂牌",
  },
  "flexi-dino": {
    fr: "Dino flexi",
    es: "Dino flexi",
    it: "Dino flexi",
    zh: "关节恐龙",
  },
  "fidget-clicker": {
    fr: "Clicker fidget",
    es: "Clicker fidget",
    it: "Clicker fidget",
    zh: "解压按键",
  },
  "desk-pen-cup": {
    fr: "Pot à stylos",
    es: "Portalápices",
    it: "Portapenne",
    zh: "桌面笔筒",
  },
  "orbit-cable-clip": {
    fr: "Clip câble Orbit",
    es: "Clip de cables Orbit",
    it: "Clip cavi Orbit",
    zh: "Orbit 理线夹",
  },
  "phone-stand": {
    fr: "Support téléphone",
    es: "Soporte móvil",
    it: "Supporto telefono",
    zh: "手机支架",
  },
  "desk-arc-stand": {
    fr: "Support arc bureau",
    es: "Soporte arco desk",
    it: "Stand arco desk",
    zh: "桌面弧形支架",
  },
  "name-ridge": {
    fr: "Plaque nom Ridge",
    es: "Placa nombre Ridge",
    it: "Targhetta Ridge",
    zh: "姓名立牌",
  },
  "lithophane-frame": {
    fr: "Cadre lithophane",
    es: "Marco litofanía",
    it: "Cornice litofania",
    zh: "透光相框",
  },
  "mini-planter": {
    fr: "Mini pot",
    es: "Mini maceta",
    it: "Mini vaso",
    zh: "迷你花盆",
  },
  "heart-gift-box": {
    fr: "Boîte cœur",
    es: "Caja corazón",
    it: "Scatola cuore",
    zh: "心形礼盒",
  },
  "cake-topper-name": {
    fr: "Cake topper prénom",
    es: "Topper tarta nombre",
    it: "Cake topper nome",
    zh: "蛋糕插牌姓名",
  },
  "deko-ornament": {
    fr: "Ornement déco",
    es: "Adorno deco",
    it: "Ornamento deco",
    zh: "装饰挂件",
  },
  "haustier-marke": {
    fr: "Médaille animal",
    es: "Chapa mascota",
    it: "Medaglietta pet",
    zh: "宠物铭牌",
  },
  "lesezeichen-name": {
    fr: "Marque-page prénom",
    es: "Marcapáginas nombre",
    it: "Segnalibro nome",
    zh: "姓名书签",
  },
  "hex-wandhaken": {
    fr: "Crochet hex",
    es: "Gancho hex",
    it: "Gancio hex",
    zh: "六角挂钩",
  },
  "seifenschale": {
    fr: "Porte-savon",
    es: "Jabonera",
    it: "Portasapone",
    zh: "肥皂碟",
  },
  "controller-stand": {
    fr: "Support manette",
    es: "Soporte mando",
    it: "Stand controller",
    zh: "手柄支架",
  },
  "flex-coil": {
    fr: "Flex Coil",
    es: "Flex Coil",
    it: "Flex Coil",
    zh: "弹性线圈",
  },
};

export function localizedProductName(
  slug: string,
  name: { de: string; en: string } & Partial<Record<Locale, string>>,
  locale: Locale,
) {
  const extra = productNamesExtra[slug] ?? {};
  return pickLocalized({ ...name, ...extra }, locale);
}

export const vibeLabels: Record<string, Record<Locale, string>> = {
  PLAY: {
    de: "SPIELEN",
    en: "PLAY",
    fr: "PLAY",
    es: "JUEGO",
    it: "PLAY",
    zh: "玩乐",
  },
  DESK: {
    de: "DESK",
    en: "DESK",
    fr: "BUREAU",
    es: "ESCRITORIO",
    it: "DESK",
    zh: "桌面",
  },
  ROOM: {
    de: "RAUM",
    en: "ROOM",
    fr: "PIÈCE",
    es: "HABITACIÓN",
    it: "STANZA",
    zh: "空间",
  },
  GAMING: {
    de: "GAMING",
    en: "GAMING",
    fr: "GAMING",
    es: "GAMING",
    it: "GAMING",
    zh: "电竞",
  },
  GIFTS: {
    de: "GESCHENKE",
    en: "GIFTS",
    fr: "CADEAUX",
    es: "REGALOS",
    it: "REGALI",
    zh: "礼物",
  },
  CUSTOM: {
    de: "CUSTOM",
    en: "CUSTOM",
    fr: "SUR MESURE",
    es: "A MEDIDA",
    it: "SU MISURA",
    zh: "定制",
  },
};
