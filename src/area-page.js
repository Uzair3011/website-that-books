// The town pages under /areas: the stacked long-form layout with the Tees
// Valley map as the hero and a Home > Areas > Town breadcrumb.
import { stackedPage } from "./stacked-page.js";

// The map names every town these pages cover.
const MAP = {
  src: "/assets/work/teesside-map.svg",
  width: 1000,
  height: 720,
};

export function areaPage({
  path,
  breadcrumbName,
  mapAlt,
  // { heading, items: [{ href, label, text }] } for the other area pages.
  areas,
  // { heading, items } for the service pages.
  services,
  ...page
}) {
  return stackedPage({
    ...page,
    path,
    breadcrumbs: [
      { name: "Areas", path: "/areas" },
      { name: breadcrumbName, path },
    ],
    hero: { image: { ...MAP, alt: mapAlt } },
    relatedSections: [services, areas],
    readingLayout: true,
  });
}
