import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import NotFound from './pages/NotFound'
import Spinner from './components/Spinner'

const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Offers = lazy(() => import('./pages/Offers'))
const Auth = lazy(() => import('./pages/Auth'))
const Profile = lazy(() => import('./pages/Profile'))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center py-20">
      <Spinner size={36} className="text-brand-600" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route
          path="product/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProductDetails />
            </Suspense>
          }
        />
        <Route
          path="cart"
          element={
            <Suspense fallback={<PageLoader />}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="wishlist"
          element={
            <Suspense fallback={<PageLoader />}>
              <Wishlist />
            </Suspense>
          }
        />
        <Route
          path="checkout"
          element={
            <Suspense fallback={<PageLoader />}>
              <Checkout />
            </Suspense>
          }
        />
        <Route
          path="offers"
          element={
            <Suspense fallback={<PageLoader />}>
              <Offers />
            </Suspense>
          }
        />
        <Route
          path="auth"
          element={
            <Suspense fallback={<PageLoader />}>
              <Auth />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}