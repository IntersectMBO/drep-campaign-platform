// helpers.js
// This file contains helper functions used throughout the application for performing common tasks.
// Functions include operations such as date formatting, array and object manipulation, and input validation.
import { HASH_REGEX, URL_REGEX } from "@/constants";

// Use these functions to keep your code clean and avoid duplicating code in different parts of the application.
export function checkImageCompatibity (mimeType:string){
    if(mimeType === 'image/svg+xml' || mimeType === 'image/svg') return false
    return true;
}

export function isValidURLFormat(str: string) {
  if (!str.length) return false;
  return URL_REGEX.test(str);
}

export function isValidHashFormat(str: string) {
  if (!str.length) return false;
  return HASH_REGEX.test(str);
}

export function isValidURLLength(s: string) {
  if (s.length > 128) {
    return "too long URL";
  }

  const encoder = new TextEncoder();
  const byteLength = encoder.encode(s).length;

  return byteLength <= 128 ? true : "Too long url";
}