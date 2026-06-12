# Manipulação de imagens

Pillow (PIL) edita, converte e gera imagens.

## Pontos-chave

- Abrir, redimensionar e recortar
- Filtros e ajustes
- Desenhar texto e formas
- Conversão de formatos e thumbnails

## Exemplo

```python
from PIL import Image
img = Image.open('foto.jpg')
img.thumbnail((200, 200))
img.convert('RGB').save('thumb.webp')
```

## Boas práticas

- Preserve a proporção ao redimensionar
- Otimize o tamanho de saída

## Saiba mais

- [Documentação oficial](https://pillow.readthedocs.io/)
