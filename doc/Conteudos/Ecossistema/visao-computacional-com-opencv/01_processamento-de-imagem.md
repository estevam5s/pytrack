# Processamento de imagem

OpenCV manipula imagens e vídeo para visão computacional.

> **Tema:** Visão · **Nível:** avancado · **Trilha:** Visão Computacional com OpenCV

## Conceitos-chave

Nesta lição você vai entender:

- **Leitura, escrita e conversão de cores**
- **Filtros, bordas e thresholding**
- **Detecção de contornos e faces**
- **Captura de webcam**

## Exemplo prático

```python
import cv2
img = cv2.imread('foto.jpg')
cinza = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
bordas = cv2.Canny(cinza, 100, 200)
cv2.imwrite('bordas.jpg', bordas)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Trabalhe em escala de cinza quando possível
- Cuide do desempenho em vídeo

## Pratique

Para fixar, escreva um pequeno script que combine **leitura, escrita e conversão de cores** e **filtros, bordas e thresholding** em um caso do seu dia a dia. Depois refatore aplicando "Trabalhe em escala de cinza quando possível".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Leitura, escrita e conversão de cores
- [ ] Explicar e aplicar: Filtros, bordas e thresholding
- [ ] Explicar e aplicar: Detecção de contornos e faces
- [ ] Explicar e aplicar: Captura de webcam

## Saiba mais

- [Documentação oficial](https://docs.opencv.org/)
