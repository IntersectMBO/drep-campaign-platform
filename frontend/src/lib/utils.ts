// utils.js
// This file is designed to house small, reusable utility functions that serve as building blocks for constructing more complex functionalities within the application.
// It includes a range of generic helpers for tasks like data manipulation, formatting, and validation.
// Additionally, this file may contain functions for testing purposes, providing a toolkit for verifying the correctness and efficiency of larger functions.
// By centralizing these utilities, we promote a modular and maintainable codebase, facilitating ease of development and testing.

import { JwtPayload, jwtDecode } from 'jwt-decode';
import ms from 'ms';
export const sumTestExample = (a, b) => {
  return a + b;
};
export function convertString(inputString: string, isMobile: boolean) {
  if (typeof inputString === 'undefined' || inputString?.length <= 10) {
    return inputString; // If the string is too short, no replacement is needed
  }
  //the string will be truncated per mobile width
  if (isMobile) {
    return inputString.slice(0, 5) + '.......' + inputString.slice(-5);
  }

  return inputString.slice(0, 10) + '.......' + inputString.slice(-10);
}
export function decodeToken(token: string) {
  const decoded = jwtDecode<JwtPayload>(token);
  let isExpired = false;
  const { exp } = decoded;
  //check if expired
  if (exp < Date.now() / 1000) isExpired = true;
  return { decoded, isExpired };
}

export function shortenAddress(address: string, length: number) {
  // get [length] characters from the start and end of the address
  return address.slice(0, length) + '...' + address.slice(-length);
}

export function shortNumber(value: number, decimals: number = 0) {
  // nine Zeroes for Billions
  return Math.abs(Number(value)) >= 1.0e9
    ? (Math.abs(Number(value)) / 1.0e9).toFixed(decimals) + 'B'
    : // six Zeroes for Millions
      Math.abs(Number(value)) >= 1.0e6
      ? (Math.abs(Number(value)) / 1.0e6).toFixed(decimals) + 'M'
      : // three Zeroes for Thousands
        Math.abs(Number(value)) >= 1.0e3
        ? (Math.abs(Number(value)) / 1.0e3).toFixed(decimals) + 'K'
        : Math.abs(Number(value));
}

export function lovelaceToAda(lovelace: number) {
  // convert lovelace to ada, assuming 1 lovelace = 1000000 ada
  const divisibility = 1000000;
  return Number(lovelace) / divisibility;
}

export function formattedAda(lovelace: number | string, decimals: number) {
  let numberLovelace = Number(lovelace);
  let ada = lovelaceToAda(numberLovelace);
  return shortNumber(ada, decimals);
}

export function formatAsCurrency(amount: number | string) {
  let numberAmount = Number(amount);
  return numberAmount.toLocaleString('en-US');
}

export const handleCopyText = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const formatNumberTimeToReadable = (time: number) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const startTimeFormatted = new Date(time).toLocaleString(undefined, options);
  return startTimeFormatted;
};
export const toBase64 = (file) => {
  if (!file) return;
  if (typeof file === 'string') return file;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
export async function sha256(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
