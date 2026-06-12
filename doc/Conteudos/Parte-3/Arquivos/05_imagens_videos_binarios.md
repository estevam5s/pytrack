# Imagens, Vídeos e Arquivos Binários

Este arquivo cobre manipulação de imagens com Pillow, arquivos binários e conceitos práticos para vídeos com bibliotecas como OpenCV e MoviePy.

---

## Sumário

1. [Arquivos Binários](#arquivos-binários)
2. [Pillow](#pillow)
3. [Abrir e Salvar Imagens](#abrir-e-salvar-imagens)
4. [Redimensionar, Cortar e Converter](#redimensionar-cortar-e-converter)
5. [Filtros e Metadados](#filtros-e-metadados)
6. [Processamento em Lote](#processamento-em-lote)
7. [Vídeos com OpenCV](#vídeos-com-opencv)
8. [Vídeos com MoviePy](#vídeos-com-moviepy)
9. [Boas Práticas](#boas-práticas)
10. [Exercícios](#exercícios)

---

## Arquivos Binários

Imagens e vídeos devem ser tratados como bytes.

```python
from pathlib import Path

dados = Path("foto.jpg").read_bytes()
Path("copia.jpg").write_bytes(dados)
```

Detectar tamanho:

```python
tamanho = Path("video.mp4").stat().st_size
```

---

## Pillow

Instalação:

```bash
python -m pip install pillow
```

Import:

```python
from PIL import Image
```

Pillow é útil para:

- redimensionar;
- cortar;
- converter formatos;
- gerar thumbnails;
- aplicar filtros;
- manipular metadados;
- criar imagens simples.

---

## Abrir e Salvar Imagens

```python
from PIL import Image

with Image.open("foto.jpg") as img:
    print(img.format, img.size, img.mode)
    img.save("foto.png")
```

Converter modo:

```python
with Image.open("foto.png") as img:
    rgb = img.convert("RGB")
    rgb.save("foto.jpg", quality=90)
```

---

## Redimensionar, Cortar e Converter

Thumbnail preservando proporção:

```python
from PIL import Image

with Image.open("foto.jpg") as img:
    img.thumbnail((300, 300))
    img.save("thumb.jpg")
```

Resize exato:

```python
with Image.open("foto.jpg") as img:
    redimensionada = img.resize((800, 600))
    redimensionada.save("800x600.jpg")
```

Corte:

```python
with Image.open("foto.jpg") as img:
    crop = img.crop((100, 100, 500, 500))
    crop.save("crop.jpg")
```

---

## Filtros e Metadados

Filtros:

```python
from PIL import Image, ImageFilter

with Image.open("foto.jpg") as img:
    blur = img.filter(ImageFilter.BLUR)
    blur.save("blur.jpg")
```

EXIF:

```python
with Image.open("foto.jpg") as img:
    exif = img.getexif()
    print(dict(exif))
```

Cuidado: metadados podem conter localização e dados sensíveis.

---

## Processamento em Lote

```python
from pathlib import Path
from PIL import Image

def gerar_thumbnails(origem: str, destino: str, tamanho=(300, 300)):
    origem = Path(origem)
    destino = Path(destino)
    destino.mkdir(parents=True, exist_ok=True)

    for caminho in origem.glob("*.jpg"):
        with Image.open(caminho) as img:
            img.thumbnail(tamanho)
            img.save(destino / caminho.name)
```

Tratamento de erro:

```python
from PIL import UnidentifiedImageError

try:
    with Image.open("arquivo.jpg") as img:
        img.verify()
except UnidentifiedImageError:
    print("imagem inválida")
```

---

## Vídeos com OpenCV

Instalação:

```bash
python -m pip install opencv-python
```

Ler frames:

```python
import cv2

cap = cv2.VideoCapture("video.mp4")

while True:
    ok, frame = cap.read()
    if not ok:
        break

    # frame é um array NumPy
    processar(frame)

cap.release()
```

Extrair FPS e dimensões:

```python
fps = cap.get(cv2.CAP_PROP_FPS)
largura = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
altura = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
```

Salvar frame:

```python
cv2.imwrite("frame.jpg", frame)
```

---

## Vídeos com MoviePy

Instalação:

```bash
python -m pip install moviepy
```

Cortar vídeo:

```python
from moviepy import VideoFileClip

clip = VideoFileClip("video.mp4")
trecho = clip.subclipped(0, 10)
trecho.write_videofile("trecho.mp4")
```

Extrair áudio:

```python
clip = VideoFileClip("video.mp4")
clip.audio.write_audiofile("audio.mp3")
```

Observação: APIs de bibliotecas de vídeo podem variar por versão. Valide no ambiente do projeto.

---

## Boas Práticas

- Trate imagens/vídeos como binários.
- Feche recursos com `with` ou `release`.
- Valide tipo e tamanho.
- Remova metadados sensíveis quando necessário.
- Use processamento em lote com logs.
- Evite carregar vídeos inteiros em memória.
- Processe frames em streaming.
- Preserve arquivo original.
- Cuidado com arquivos maliciosos e bombas de descompressão.

---

## Exercícios

1. Abra imagem e imprima formato/tamanho.
2. Converta PNG para JPG.
3. Gere thumbnails em lote.
4. Corte uma imagem.
5. Aplique filtro.
6. Leia metadados EXIF.
7. Extraia frames de vídeo com OpenCV.
8. Corte trecho de vídeo com MoviePy.

