import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseURL(url: string) {
  var a =  document.createElement('a');
  a.href = url;
  return {
      source: url,
      protocol: a.protocol.replace(':',''),
      host: a.hostname,
      port: a.port,
  };
}

export function convertMediaUrl(media: string) {
  if (!media.startsWith("https://res.cloudinary.com")) {
    return `${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX
      }/uploads/${media}`;
  }
  return media;
}

export async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}