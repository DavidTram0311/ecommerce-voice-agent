import { Collection } from "../types";

export const mockCollections: Collection[] = [
  {
    handle: "joyco-root",
    title: "Joyco root catalog",
    description: "",
    seo: {
      title: "",
      description: "",
    },
    parentCategoryTree: [],
    updatedAt: "",
    path: "/search",
  },

  {
    handle: "ipads",
    title: "iPads",
    description: "",
    seo: {
      title: "",
      description: "",
    },
    parentCategoryTree: [
      {
        id: "joyco-root",
        name: "Joyco root catalog",
      },
      {
        id: "ipads",
        name: "iPads",
      },
    ],
    updatedAt: "",
    path: "/search/ipads",
  },

  {
    handle: "watch",
    title: "Watch",
    description: "",
    seo: {
      title: "",
      description: "",
    },
    parentCategoryTree: [
      {
        id: "joyco-root",
        name: "Joyco root catalog",
      },
      {
        id: "watch",
        name: "Watch",
      },
    ],
    updatedAt: "",
    path: "/search/watch",
  },
  {
    handle: "airpods",
    title: "AirPods",
    description: "",
    seo: {
      title: "",
      description: "",
    },
    parentCategoryTree: [
      {
        id: "joyco-root",
        name: "Joyco root catalog",
      },
      {
        id: "airpods",
        name: "AirPods",
      },
    ],
    updatedAt: "",
    path: "/search/airpods",
  },
];
