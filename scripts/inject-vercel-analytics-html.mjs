/**
 * 为未经过 Vite 打包的静态 HTML（DIGITAL_ART、GAMES 等）注入 Vercel Web Analytics。
 * 在 dist 目录执行，部署到 Vercel 后由 /_vercel/insights/script.js 采集数据。
 */
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')
const SNIPPET = '    <script defer src="/_vercel/insights/script.js"></script>\n'
const MARKER = '/_vercel/insights/script.js'

function walkHtml(dir) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name)
    if (ent.isDirectory()) walkHtml(full)
    else if (ent.name.endsWith('.html')) injectFile(full)
  }
}

function injectFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8')
  if (html.includes(MARKER)) return
  const closeBody = html.lastIndexOf('</body>')
  if (closeBody === -1) return
  html = html.slice(0, closeBody) + SNIPPET + html.slice(closeBody)
  fs.writeFileSync(filePath, html, 'utf8')
  console.log(`inject-vercel-analytics: ${filePath.replace(distDir, 'dist')}`)
}

if (!fs.existsSync(distDir)) {
  console.error('inject-vercel-analytics: dist/ 不存在')
  process.exit(1)
}

for (const name of ['DIGITAL_ART', 'GAMES']) {
  walkHtml(resolve(distDir, name))
}

console.log('inject-vercel-analytics: 完成')
