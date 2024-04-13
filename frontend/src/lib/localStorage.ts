export const WALLET_LS_KEY = "wallet_data";


export function getItemFromLocalStorage(key: string) {
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function setItemToLocalStorage(key: string, data: any) {
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function removeItemFromLocalStorage(key: string) {
  window.localStorage.removeItem(key);
}
