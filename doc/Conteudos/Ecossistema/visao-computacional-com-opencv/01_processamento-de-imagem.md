# Processamento de imagem

OpenCV manipula imagens e vídeo para visão computacional.

## Pontos-chave

- Leitura, escrita e conversão de cores
- Filtros, bordas e thresholding
- Detecção de contornos e faces
- Captura de webcam

## Exemplo

```python
import cv2
img = cv2.imread('foto.jpg')
cinza = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
bordas = cv2.Canny(cinza, 100, 200)
cv2.imwrite('bordas.jpg', bordas)
```

## Boas práticas

- Trabalhe em escala de cinza quando possível
- Cuide do desempenho em vídeo

## Saiba mais

- [Documentação oficial](https://docs.opencv.org/)
