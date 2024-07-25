export const SessionStorage: Map<string, string> = new Map();

export const setSessionStorage = (key: string, value: string) => {
  SessionStorage.set(key, value);
};
export const getSessionStorage = (key: string) => {
  return SessionStorage.get(key);
};
export const removeSessionStorage = (key: string) => {
  SessionStorage.delete(key);
};
export const clearSessionStorage = () => {
  SessionStorage.clear();
};
export const hasSessionStorage = (key: string) => {
  return SessionStorage.has(key);
};
