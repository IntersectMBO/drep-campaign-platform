export const GITHUB_REGEX = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/
export const TWITTER_REGEX = /^https?:\/\/(www\.)?(x|twitter)\.com\/[a-zA-Z0-9_@]+\/?$/
export const FACEBOOK_REGEX = /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._@]+\/?$/
export const INSTAGRAM_REGEX = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._@]+\/?$/
export const URL_REGEX =
  /^(?:(?:https?:\/\/)?(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?:\/[^\s]*)?)|(?:ipfs:\/\/[a-f0-9]+(?:\/[a-zA-Z0-9_]+)*)$|^$/;
export const HASH_REGEX = /^[0-9A-Fa-f]+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NICKNAME_REGEX = /^\S+$/;
