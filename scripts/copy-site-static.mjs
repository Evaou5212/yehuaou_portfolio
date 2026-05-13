/**
 * 在 vite build 之后把多页站点依赖的静态目录复制到 dist。
 * 避免使用 fs.cpSync：在部分 Windows + OneDrive 环境下会异常退出。
 */
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const outDir = resolve(root, 'dist')

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const from = join(src, ent.name)
    const to = join(dest, ent.name)
    if (ent.isDirectory()) {
      copyDirRecursive(from, to)
    } else {
      fs.copyFileSync(from, to)
    }
  }
}

if (!fs.existsSync(outDir)) {
  console.error('copy-site-static: dist/ 不存在，请先执行 vite build')
  process.exit(1)
}

const dirs = ['DIGITAL_ART', 'GAMES', 'backgroundimg', 'texts', 'js']
for (const name of dirs) {
  const from = resolve(root, name)
  const to = resolve(outDir, name)
  if (!fs.existsSync(from)) continue
  fs.rmSync(to, { recursive: true, force: true })
  copyDirRecursive(from, to)
  console.log(`copy-site-static: ${name}/ -> dist/${name}/`)
}

const stylesFrom = resolve(root, 'styles.css')
const stylesTo = resolve(outDir, 'styles.css')
if (fs.existsSync(stylesFrom)) {
  fs.copyFileSync(stylesFrom, stylesTo)
  console.log('copy-site-static: styles.css -> dist/styles.css')
}

console.log('copy-site-static: 完成')
