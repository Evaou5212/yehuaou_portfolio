# 用本地服务器打开作品集（ShaderGradient 需通过 Vite 加载）
# 首次运行请先执行: npm install
# 然后运行本脚本，浏览器访问 http://localhost:8080
$root = $PSScriptRoot
Write-Host "在浏览器打开: http://localhost:8080"
Write-Host "按 Ctrl+C 停止服务器"
Push-Location $root
npm run serve
Pop-Location
