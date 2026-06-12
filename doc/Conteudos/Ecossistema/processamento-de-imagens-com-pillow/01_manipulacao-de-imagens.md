# Manipulação de imagens

Pillow (PIL) edita, converte e gera imagens.

> **Tema:** Imagens · **Nível:** basico · **Trilha:** Processamento de Imagens com Pillow

## Conceitos-chave

Nesta lição você vai entender:

- **Abrir, redimensionar e recortar**
- **Filtros e ajustes**
- **Desenhar texto e formas**
- **Conversão de formatos e thumbnails**

## Exemplo prático

```python
from PIL import Image
img = Image.open('foto.jpg')
img.thumbnail((200, 200))
img.convert('RGB').save('thumb.webp')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Preserve a proporção ao redimensionar
- Otimize o tamanho de saída

## Pratique

Para fixar, escreva um pequeno script que combine **abrir, redimensionar e recortar** e **filtros e ajustes** em um caso do seu dia a dia. Depois refatore aplicando "Preserve a proporção ao redimensionar".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Abrir, redimensionar e recortar
- [ ] Explicar e aplicar: Filtros e ajustes
- [ ] Explicar e aplicar: Desenhar texto e formas
- [ ] Explicar e aplicar: Conversão de formatos e thumbnails

## Saiba mais

- [Documentação oficial](https://pillow.readthedocs.io/)
