export const getItem = (key, fallback = null) => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}

export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* storage unavailable */
  }
}

export const KEYS = {
  cart: 'modeza.cart',
  wishlist: 'modeza.wishlist',
  user: 'modeza.user',
  theme: 'modeza.theme',
  recent: 'modeza.recent',
  orders: 'modeza.orders',
}