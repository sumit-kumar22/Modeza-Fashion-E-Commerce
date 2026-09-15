import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { systemTheme, useTheme } from '../hooks/useTheme'
import { PRODUCTS } from '../data/products'
import { COUPONS } from '../data/coupons'
import { KEYS } from '../utils/storage'
import { discountFor, shippingFor } from '../utils/format'

const ShopContext = createContext(null)

export const useShop = () => {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside ShopProvider')
  return ctx
}

export function ShopProvider({ children }) {
  const [products] = useState(PRODUCTS)
  const [theme, setTheme] = useLocalStorage(KEYS.theme, systemTheme())
  const [cart, setCart] = useLocalStorage(KEYS.cart, [])
  const [wishlist, setWishlist] = useLocalStorage(KEYS.wishlist, [])
  const [user, setUser] = useLocalStorage(KEYS.user, null)
  const [orders, setOrders] = useLocalStorage(KEYS.orders, [])
  const [recent, setRecent] = useLocalStorage(KEYS.recent, [])
  const [coupon, setCoupon] = useState(null)

  const { toggleTheme } = useTheme(theme, setTheme)

  /* ------------------------------ Cart ------------------------------ */
  const addToCart = useCallback(
    (product, { size, color, quantity = 1 } = {}) => {
      setCart((items) => {
        const existing = items.find(
          (i) => i.productId === product.id && i.size === size && i.color === color
        )
        if (existing) {
          return items.map((i) =>
            i.productId === product.id && i.size === size && i.color === color
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        }
        return [...items, { productId: product.id, size, color, quantity }]
      })
      toast.success(`${product.name} added to cart`)
    },
    [setCart]
  )

  const updateQuantity = useCallback(
    (productId, size, color, quantity) => {
      setCart((items) =>
        items
          .map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          )
          .filter((i) => i.quantity > 0)
      )
    },
    [setCart]
  )

  const removeFromCart = useCallback(
    (productId, size, color) => {
      setCart((items) =>
        items.filter(
          (i) => !(i.productId === productId && i.size === size && i.color === color)
        )
      )
    },
    [setCart]
  )

  const clearCart = useCallback(() => setCart([]), [setCart])

  const cartDetailed = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          return product ? { ...item, product } : null
        })
        .filter(Boolean),
    [cart, products]
  )

  const subtotal = useMemo(
    () => cartDetailed.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [cartDetailed]
  )

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  )

  /* --------------------------- Wishlist ----------------------------- */
  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((items) => {
        if (items.some((i) => i === product.id)) {
          toast.success('Removed from wishlist')
          return items.filter((i) => i !== product.id)
        }
        toast.success(`${product.name} saved to wishlist`)
        return [product.id, ...items]
      })
    },
    [setWishlist]
  )

  const isWishlisted = useCallback(
    (id) => wishlist.includes(id),
    [wishlist]
  )

  const clearWishlist = useCallback(() => setWishlist([]), [setWishlist])

  /* --------------------------- Coupons ------------------------------ */
  const applyCoupon = useCallback(
    (code) => {
      const found = COUPONS.find(
        (c) => c.code.toLowerCase() === String(code || '').toLowerCase()
      )
      if (!found) {
        toast.error('Invalid coupon code')
        return false
      }
      setCoupon(found)
      toast.success(`Coupon ${found.code} applied`)
      return true
    },
    []
  )

  const removeCoupon = useCallback(() => {
    setCoupon(null)
  }, [])

  const couponDiscount = useMemo(
    () => discountFor(coupon, subtotal),
    [coupon, subtotal]
  )

  const freeShipping = coupon?.type === 'shipping'
  const shipping = useMemo(
    () => shippingFor(subtotal - couponDiscount, freeShipping),
    [subtotal, couponDiscount, freeShipping]
  )
  const total = Math.max(0, subtotal - couponDiscount + shipping)

  /* ------------------------------ Auth ------------------------------ */
  const login = useCallback(
    (email) => {
      const next = { email, name: email.split('@')[0] || 'Fashionista', joined: new Date().toISOString() }
      setUser(next)
      toast.success(`Welcome back, ${next.name}!`)
      return next
    },
    [setUser]
  )

  const register = useCallback(
    (name, email) => {
      const next = { name, email, joined: new Date().toISOString() }
      setUser(next)
      toast.success(`Welcome to Modeza, ${name}!`)
      return next
    },
    [setUser]
  )

  const logout = useCallback(() => {
    setUser(null)
    toast.success('Signed out. See you soon!')
  }, [setUser])

  const placeOrder = useCallback(
    (payload) => {
      const order = {
        id: `MZ-${String(Date.now()).slice(-8)}`,
        placedAt: new Date().toISOString(),
        ...payload,
      }
      setOrders((list) => [order, ...list])
      setCart([])
      setCoupon(null)
      return order
    },
    [setOrders, setCart]
  )

  /* ----------------------- Recently viewed -------------------------- */
  const addRecentlyViewed = useCallback(
    (product) => {
      setRecent((list) => [product.id, ...list.filter((i) => i !== product.id)].slice(0, 10))
    },
    [setRecent]
  )

  const recentlyViewed = useMemo(
    () =>
      recent
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean),
    [recent, products]
  )

  /* ------------------------- Recommendations ------------------------ */
  const trending = useMemo(() => products.filter((p) => p.isTrending), [products])
  const newArrivals = useMemo(() => products.filter((p) => p.isNew), [products])
  const bestSellers = useMemo(
    () => [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8),
    [products]
  )
  const recommended = useMemo(() => {
    const shuffled = [...products].sort(() => Math.random() - 0.5)
    const top = [...shuffled].sort((a, b) => b.rating - a.rating).slice(0, 4)
    return [...new Set([...top, ...shuffled])].slice(0, 8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  const similarProducts = useCallback(
    (product, limit = 4) =>
      products
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, limit),
    [products]
  )

  const value = useMemo(
    () => ({
      products,
      theme,
      toggleTheme,
      cart,
      cartDetailed,
      cartCount,
      subtotal,
      coupon,
      applyCoupon,
      removeCoupon,
      couponDiscount,
      shipping,
      total,
      freeShipping,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      isWishlisted,
      toggleWishlist,
      clearWishlist,
      user,
      login,
      register,
      logout,
      orders,
      placeOrder,
      recentlyViewed,
      addRecentlyViewed,
      trending,
      newArrivals,
      bestSellers,
      recommended,
      similarProducts,
      coupons: COUPONS,
    }),
    [
      products,
      theme,
      toggleTheme,
      cart,
      cartDetailed,
      cartCount,
      subtotal,
      coupon,
      applyCoupon,
      removeCoupon,
      couponDiscount,
      shipping,
      total,
      freeShipping,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      isWishlisted,
      toggleWishlist,
      clearWishlist,
      user,
      login,
      register,
      logout,
      orders,
      placeOrder,
      recentlyViewed,
      addRecentlyViewed,
      trending,
      newArrivals,
      bestSellers,
      recommended,
      similarProducts,
    ]
  )

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}