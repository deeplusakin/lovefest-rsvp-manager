import type { Photo } from "@/types/photos";

// Local fallback images for hero section
export const localHeroImages: Photo[] = [
  {
    id: "hero-1",
    url: "/lovable-uploads/f1b1f847-7b4f-4631-a002-37e91aeefd40.png",
    type: "hero",
    storage_path: "hero/couple-elegant-pose.png",
    title: "Elegant Couple Portrait",
    sort_order: 0
  },
  {
    id: "hero-2",
    url: "/lovable-uploads/e4c0b5e3-4ca1-444b-b544-5499a9257184.png",
    type: "hero",
    storage_path: "hero/image-2.png",
    title: "Romantic Sunset",
    sort_order: 1
  },
  {
    id: "hero-3",
    url: "/lovable-uploads/07791a1f-5c71-4c5f-b991-69a945656d25.png",
    type: "hero",
    storage_path: "hero/image-3.png",
    title: "Joyful Celebration",
    sort_order: 2
  }
];

// Local fallback images for gallery section
export const localGalleryImages: Photo[] = [
  {
    id: "gallery-1",
    url: "/lovable-uploads/e4c0b5e3-4ca1-444b-b544-5499a9257184.png",
    type: "gallery",
    storage_path: "gallery/image-1.png",
    title: "First Dance",
    sort_order: 0
  },
  {
    id: "gallery-2",
    url: "/lovable-uploads/07791a1f-5c71-4c5f-b991-69a945656d25.png",
    type: "gallery",
    storage_path: "gallery/image-2.png",
    title: "Cutting the Cake",
    sort_order: 1
  },
  {
    id: "gallery-3",
    url: "/lovable-uploads/f1b1f847-7b4f-4631-a002-37e91aeefd40.png",
    type: "gallery",
    storage_path: "gallery/image-3.png",
    title: "Bride and Groom",
    sort_order: 2
  }
];

// Local fallback images for wedding party
export const localWeddingPartyImages: Photo[] = [
  {
    id: "wedding-party-1",
    url: "/lovable-uploads/cbabbf3b-60a7-4aca-a5dd-308937677595.png",
    type: "wedding-party",
    storage_path: "wedding-party/image-1.png",
    title: "James",
    role: "Best Man",
    description: "Groom's cousin",
    sort_order: 0
  },
  {
    id: "wedding-party-2",
    url: "/lovable-uploads/4bfd7ea2-6667-414e-8d10-0a25a7f257b9.png",
    type: "wedding-party",
    storage_path: "wedding-party/image-2.png",
    title: "Willie",
    role: "Groomsman",
    description: "Groom's brother-in-law",
    sort_order: 1
  },
  {
    id: "wedding-party-3",
    url: "/lovable-uploads/a5470348-9227-41da-a7c5-f994b923d02d.png",
    type: "wedding-party",
    storage_path: "wedding-party/image-3.png",
    title: "Jay",
    role: "Groomsman",
    description: "Groom's brother-in-law",
    sort_order: 2
  }
];
