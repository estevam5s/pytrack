#!/bin/sh
# PyTrack Desktop — instalador via curl (Linux / macOS)
#   curl -fsSL https://www.pytrack.com.br/install.sh | sh
set -e

REPO="estevam5s/pytrack-desktop"
API="https://api.github.com/repos/${REPO}/releases/latest"

echo "🐍 PyTrack Desktop — instalador"
echo "Buscando a versão mais recente..."

TAG=$(curl -fsSL "$API" | grep '"tag_name"' | head -1 | sed -E 's/.*"([^"]+)".*/\1/')
[ -z "$TAG" ] && { echo "Não foi possível obter a versão. Tente novamente."; exit 1; }
VER=$(echo "$TAG" | sed 's/^desktop-v//')
BASE="https://github.com/${REPO}/releases/download/${TAG}"

OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin)
    FILE="PyTrack_${VER}_universal.dmg"
    DEST="$HOME/Downloads/${FILE}"
    echo "Baixando $FILE (macOS)..."
    curl -fSL "${BASE}/${FILE}" -o "$DEST"
    echo "✅ Baixado em: $DEST"
    echo "Abrindo o instalador..."
    open "$DEST" || true
    ;;
  Linux)
    # prefere .deb/.rpm conforme o gerenciador; senão AppImage
    if command -v apt >/dev/null 2>&1; then
      FILE="PyTrack_${VER}_amd64.deb"; DEST="/tmp/${FILE}"
      echo "Baixando $FILE (Debian/Ubuntu)..."
      curl -fSL "${BASE}/${FILE}" -o "$DEST"
      echo "Instalando (requer sudo)..."
      sudo apt install -y "$DEST" || sudo dpkg -i "$DEST"
    elif command -v dnf >/dev/null 2>&1 || command -v rpm >/dev/null 2>&1; then
      FILE="PyTrack-${VER}-1.x86_64.rpm"; DEST="/tmp/${FILE}"
      echo "Baixando $FILE (Fedora/RHEL)..."
      curl -fSL "${BASE}/${FILE}" -o "$DEST"
      sudo rpm -i "$DEST" || sudo dnf install -y "$DEST"
    elif command -v pacman >/dev/null 2>&1; then
      # Arch Linux / Manjaro — instala a AppImage (ou use 'yay -S pytrack-desktop-bin')
      FILE="PyTrack_${VER}_amd64.AppImage"
      DEST="$HOME/.local/bin/pytrack"
      mkdir -p "$HOME/.local/bin"
      echo "Arch Linux detectado. Baixando $FILE..."
      curl -fSL "${BASE}/${FILE}" -o "$DEST"
      chmod +x "$DEST"
      echo "✅ Instalado em: $DEST (ou instale via AUR: yay -S pytrack-desktop-bin)"
    else
      FILE="PyTrack_${VER}_amd64.AppImage"
      DEST="$HOME/.local/bin/pytrack"
      mkdir -p "$HOME/.local/bin"
      echo "Baixando $FILE (AppImage)..."
      curl -fSL "${BASE}/${FILE}" -o "$DEST"
      chmod +x "$DEST"
      echo "✅ Instalado em: $DEST"
      echo "Execute com: pytrack  (garanta que ~/.local/bin está no PATH)"
    fi
    ;;
  *)
    echo "SO não suportado por este script: $OS. Baixe em https://www.pytrack.com.br/apps"
    exit 1
    ;;
esac

echo "🎉 Pronto! Abra o PyTrack e faça login."
