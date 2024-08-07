import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum SubmitType {
  Download,
  Clipboard,
  Preview,
}

export function DownloadQuery(query: string) {
  const element = document.createElement("a");
  const file = new Blob([query], { type: 'text/csv' });
  element.href = URL.createObjectURL(file);
  element.download = "queries.sql";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

export async function CopyQueryToClipboard(query: string) {
  try {
    await navigator.clipboard.writeText(query);
  } catch (error: any) {
    console.error(error.message);
  }
}

