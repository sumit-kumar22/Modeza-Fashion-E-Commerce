export const currency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0))

export const percentOff = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const discountFor = (coupon, subtotal) => {
  if (!coupon) return 0
  if (coupon.requiresFreeShipping) return 0
  if (subtotal < coupon.minOrder) return 0
  if (coupon.type === 'flat') return Math.min(coupon.value, subtotal)
  if (coupon.type === 'percent') {
    const raw = subtotal * (coupon.value / 100)
    return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw
  }
  return 0
}

export const shippingFor = (subtotal, useFreeShipping) => {
  if (useFreeShipping) return 0
  if (subtotal === 0) return 0
  if (subtotal >= 150) return 0
  return 9.99
}