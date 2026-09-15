import { cn } from '../utils/format'

export default function Container({ className, children }) {
  return <div className={cn('container-x', className)}>{children}</div>
}