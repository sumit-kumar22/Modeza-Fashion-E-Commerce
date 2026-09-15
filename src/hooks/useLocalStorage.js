import { useEffect, useState } from 'react'
import { getItem, setItem } from '../utils/storage'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => getItem(key, initialValue))

  useEffect(() => {
    setItem(key, value)
  }, [key, value])

  return [value, setValue]
}