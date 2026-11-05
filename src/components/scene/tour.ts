import { CatmullRomCurve3, Vector3 } from "three";

export type TourStop = {
  at: number;
  eye: [number, number, number];
  aim: [number, number, number];
  image: string;
};

export const stops: Record<string, TourStop> = {
  entrance: { at: 0, eye: [2, 1.7, 4.6], aim: [-0.7, 1.2, -2], image: "hero" },
  bathroom: { at: .12, eye: [1.5, 1.6, 2.2], aim: [-1, .95, -2], image: "bathroom" },
  washbasin: { at: .17, eye: [.75, 1.45, -.75], aim: [-.1, 1.06, -2.05], image: "basin" },
  shower: { at: .22, eye: [-1.5, 1.75, .3], aim: [-2.65, 1.58, -2.25], image: "shower" },
  sanitaryware: { at: .28, eye: [2.9, 1.2, -.1], aim: [2.2, .65, -2.04], image: "toilet" },
  kitchen: { at: .36, eye: [8.6, 1.8, 2], aim: [6.3, 1.1, -2.05], image: "kitchen" },
  details: { at: .48, eye: [6.9, 1.48, -.55], aim: [6.3, 1.1, -2.05], image: "kitchen-faucet" },
  utility: { at: .6, eye: [12.2, 1.6, 1.4], aim: [11, 1.25, -2.3], image: "technician" },
  home: { at: .74, eye: [9.1, 2.7, 4.3], aim: [6.6, 1.1, -1.7], image: "kitchen" },
  products: { at: .86, eye: [4, 2.4, 4.6], aim: [2.8, 1.15, -2], image: "bathroom" },
  contact: { at: 1, eye: [2.3, 1.8, 4.5], aim: [-.7, 1.1, -2], image: "hero" },
};

const route = Object.values(stops);
function spline(key: "eye" | "aim", mobile: boolean) {
  return new CatmullRomCurve3(route.map(({ [key]: coordinates }) => {
    const vector = new Vector3(...coordinates);
    if (mobile && key === "eye") { vector.z += .58; vector.y += .05; }
    return vector;
  }), false, "centripetal");
}
const eyes = [spline("eye", false), spline("eye", true)];
const aim = spline("aim", false);

// Map irregular scroll intervals onto spline knots. Manual room selection and
// scrolling both use exactly the same coordinates, even when moving backwards.
export function sampleTour(progress: number, mobile: boolean, position: Vector3, target: Vector3) {
  const index = route.findIndex(stop => stop.at > progress);
  const i = index === -1 ? route.length - 2 : Math.max(0, index - 1);
  const fraction = Math.max(0, Math.min(1, (progress - route[i].at) / (route[i + 1].at - route[i].at)));
  const t = (i + fraction) / (route.length - 1);
  eyes[Number(mobile)].getPoint(t, position);
  aim.getPoint(t, target);
}

export const chapters = [
  { key: "entrance", label: "The home", heading: "Everything Your Home Needs.", body: "Quality products. Skilled technicians. Complete home solutions.", action: "Explore products", path: "/products" },
  { key: "bathroom", label: "Bathroom collection", heading: "Transform Your Bathroom.", body: "Discover quality bathroom fittings and sanitaryware designed for modern living.", action: "Explore bathroom products", path: "/products?category=Bathroom" },
  { key: "kitchen", label: "Kitchen experience", heading: "Designed for Everyday Living.", body: "Explore functional and elegant kitchen fittings and accessories.", action: "Explore kitchen products", path: "/products?category=Kitchenware" },
  { key: "details", label: "Product details", heading: "Quality Is in Every Detail.", body: "Inspect the profile, proportions and finish of each fitting in the product viewer.", action: "Discover faucets", path: "/products?category=Faucets" },
  { key: "utility", label: "Technician services", heading: "Professional Help. Right When You Need It.", body: "From plumbing and fittings to bathroom and kitchen maintenance, get professional assistance for your home.", action: "Request a technician", path: "/request" },
  { key: "home", label: "Why TexFix", heading: "Everything in One Place.", body: "Find the fittings for your home and the technicians to install, repair and maintain them.", action: "Explore services", path: "/services" },
  { key: "products", label: "Product showcase", heading: "Explore the Collection.", body: "Browse bathroom, kitchen and plumbing pieces by category, or step inside a product’s 3D viewer.", action: "Open the catalogue", path: "/products" },
  { key: "contact", label: "Contact", heading: "Your Home. Our Expertise.", body: "Whether you need quality products or professional maintenance, TexFix is here to help.", action: "Request a technician", path: "/request" },
] as const;

export const destinations = [
  ["entrance", "Main showroom"], ["bathroom", "Bathroom"], ["washbasin", "Washbasin area"],
  ["shower", "Shower area"], ["sanitaryware", "Sanitaryware"], ["kitchen", "Kitchen"],
  ["utility", "Plumbing & utility"], ["products", "Product showroom"],
] as const;

export const roomActions: Record<string, [string, string]> = {
  washbasin: ["Explore washbasins", "/products?category=Bathroom"],
  shower: ["Explore showers", "/products?category=Showers"],
  sanitaryware: ["Explore sanitaryware", "/products?category=Sanitaryware"],
};

export function stopAt(progress: number) {
  const entries = Object.entries(stops);
  return entries.reduce((best, item) => Math.abs(item[1].at - progress) < Math.abs(best[1].at - progress) ? item : best, entries[0])[0];
}
export function chapterAt(progress: number) {
  return chapters.reduce((index, chapter, i) => progress >= stops[chapter.key].at - .012 ? i : index, 0);
}
