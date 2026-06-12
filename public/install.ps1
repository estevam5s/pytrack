# PyTrack Desktop — instalador via PowerShell (Windows)
#   irm https://www.pytrack.com.br/install.ps1 | iex
$ErrorActionPreference = "Stop"
$repo = "estevam5s/pytrack-desktop"

Write-Host "PyTrack Desktop - instalador" -ForegroundColor Magenta
Write-Host "Buscando a versao mais recente..."

$rel = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases/latest" -Headers @{ "User-Agent" = "pytrack-installer" }
$tag = $rel.tag_name
$ver = $tag -replace '^desktop-v', ''
$file = "PyTrack_${ver}_x64-setup.exe"
$url = "https://github.com/$repo/releases/download/$tag/$file"
$dest = Join-Path $env:TEMP $file

Write-Host "Baixando $file (Windows)..."
Invoke-WebRequest -Uri $url -OutFile $dest -Headers @{ "User-Agent" = "pytrack-installer" }

Write-Host "Executando o instalador..." -ForegroundColor Green
Start-Process -FilePath $dest -Wait
Write-Host "Pronto! Abra o PyTrack e faca login." -ForegroundColor Green
