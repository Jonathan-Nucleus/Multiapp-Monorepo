import EncryptedStorage from 'react-native-encrypted-storage';

const TOKEN_KEY = 'accessToken';

export type TokenAction = 'set' | 'cleared';

/**
 * Retrieves the user token stored securely on the user device.
 *
 * @returns   The user token or null if one has not been set.
 */
export async function getToken(): Promise<string | null> {
  return EncryptedStorage.getItem(TOKEN_KEY);
}

/**
 * Saves a user token to encrypted storage on the user device.
 *
 * @param token   The token to save.
 */
export async function setToken(token: string): Promise<void> {
  await EncryptedStorage.setItem(TOKEN_KEY, token);
  notify('set');
}

/**
 * Clears any token stored in the encrypted storge of the user device.
 */
export async function clearToken(): Promise<void> {
  try {
    await EncryptedStorage.clear();
  } catch (err) {
    console.log('Error while clearing token', err);
  }

  notify('cleared');
}

let observers: ((action: TokenAction) => void)[] = [];

export function attachTokenObserver(
  observer: (action: TokenAction) => void,
): void {
  observers.push(observer);
}

export function detachTokenObserver(
  observer: (action: TokenAction) => void,
): void {
  observers = observers.filter((ob) => ob !== observer);
}

function notify(action: TokenAction): void {
  observers.forEach((observer) => observer(action));
}
