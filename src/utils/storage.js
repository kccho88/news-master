const API_KEY_STORAGE_KEY = 'gemini_api_key'

export const saveApiKey = (key) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key)
}

export const getApiKey = () => {
  return localStorage.getItem(API_KEY_STORAGE_KEY)
}

export const removeApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY)
}

