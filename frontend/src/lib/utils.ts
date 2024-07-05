// utils.js
// This file is designed to house small, reusable utility functions that serve as building blocks for constructing more complex functionalities within the application.
// It includes a range of generic helpers for tasks like data manipulation, formatting, and validation.
// Additionally, this file may contain functions for testing purposes, providing a toolkit for verifying the correctness and efficiency of larger functions.
// By centralizing these utilities, we promote a modular and maintainable codebase, facilitating ease of development and testing.

export const sumTestExample = (a, b) => {
  return a + b;
};
export function convertString(inputString: string, isMobile: boolean) {
  if (inputString.length <= 10) {
    return inputString; // If the string is too short, no replacement is needed
  }
  //the string will be truncated per mobile width
  if (isMobile) {
    return inputString.slice(0, 5) + '.......' + inputString.slice(-5);
  }

  return inputString.slice(0, 10) + '.......' + inputString.slice(-10);
}