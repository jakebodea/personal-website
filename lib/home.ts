import homeContent from "@/content/home.md?raw";

export const getHomeContent = (): string => homeContent.trim();
