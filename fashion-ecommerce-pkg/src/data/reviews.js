export const REVIEW_POOL = [
  {
    name: 'Ananya S.',
    rating: 5,
    title: 'Absolutely love it',
    body: 'The quality exceeded my expectations. Fits true to size and the fabric feels premium. Already ordered a second one!',
    date: '2026-08-14',
  },
  {
    name: 'Daniel M.',
    rating: 4,
    title: 'Great value',
    body: 'Very happy with this purchase. Delivery was quick and the packaging was lovely. Runs slightly large, so size down.',
    date: '2026-08-02',
  },
  {
    name: 'Priya R.',
    rating: 5,
    title: 'Better than the photos',
    body: 'I was worried the colour would look different in person, but it is stunning. Gets compliments every time I wear it.',
    date: '2026-07-28',
  },
  {
    name: 'Marcus T.',
    rating: 4,
    title: 'Solid and stylish',
    body: 'Great everyday piece. Comfortable and well made. Would recommend to a friend.',
    date: '2026-07-19',
  },
  {
    name: 'Elena K.',
    rating: 3,
    title: 'Nice but size runs small',
    body: 'Beautiful design and fabric, but I had to exchange for a larger size. Customer support was helpful about it.',
    date: '2026-07-05',
  },
  {
    name: 'Rohit V.',
    rating: 5,
    title: 'Premium feel',
    body: 'You can tell this is high quality the moment you hold it. Worth every penny. Will definitely buy more from this brand.',
    date: '2026-06-22',
  },
  {
    name: 'Sofia L.',
    rating: 5,
    title: 'My new favourite',
    body: 'Comfortable, versatile and looks expensive. Pairs with everything in my wardrobe.',
    date: '2026-06-10',
  },
  {
    name: 'James H.',
    rating: 4,
    title: 'Great purchase',
    body: 'Exactly as described. The material is durable and the stitching is clean. Very satisfied overall.',
    date: '2026-05-30',
  },
]

export const generateReviews = (productId, count) => {
  const result = []
  const step = productId % REVIEW_POOL.length || 1
  for (let i = 0; i < Math.min(count || 6, 6); i++) {
    const base = REVIEW_POOL[(productId * 3 + i * step) % REVIEW_POOL.length]
    result.push({
      ...base,
      id: `${productId}-rev-${i}`,
      date: base.date,
    })
  }
  return result
}