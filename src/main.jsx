import React from 'react'
import { createRoot } from 'react-dom/client'
import ShaderBackground from './ShaderBackground.jsx'
import ParallaxGallery from './ParallaxGallery.jsx'

const bgLayer = document.getElementById('bgLayer')
if (bgLayer) {
  createRoot(bgLayer).render(<ShaderBackground />)
}

const galleryRoot = document.getElementById('galleryRoot')
if (galleryRoot) {
  const columns = parseInt(galleryRoot.dataset.columns || '2', 10)
  const category = galleryRoot.dataset.category || ''
  createRoot(galleryRoot).render(<ParallaxGallery columns={columns} category={category} />)
}
