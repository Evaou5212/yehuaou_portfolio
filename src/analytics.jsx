import { Analytics } from '@vercel/analytics/react'
import { createRoot } from 'react-dom/client'

const mount = document.createElement('div')
mount.setAttribute('data-vercel-analytics', '')
document.body.appendChild(mount)
createRoot(mount).render(<Analytics />)
