import { PRODUCTS } from '../data/products'

const LATENCY = 350

const api = (resolver) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(resolver()), LATENCY)
  })

export const fetchProducts = () => api(() => structuredClone(PRODUCTS))

export const fetchProduct = (id) =>
  api(() => structuredClone(PRODUCTS.find((p) => p.id === Number(id)) || null))

export const fetchProductsByCategory = (category) =>
  api(() => structuredClone(PRODUCTS.filter((p) => p.category === category)))

export const fetchRecommended = (id) =>
  api(() => {
    const product = PRODUCTS.find((p) => p.id === Number(id))
    if (!product) return []
    return structuredClone(
      PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
        .concat(PRODUCTS.filter((p) => p.id !== product.id && p.rating >= 4.6))
        .filter(
          (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
        )
        .slice(0, 8)
    )
  })

// When a REST API becomes available, the functions below can be swapped for
// real fetch() calls without changing any consuming component.
export const createOrder = (payload) =>
  api(() => ({ id: `MZ${Date.now()}`, status: 'placed', ...payload }))