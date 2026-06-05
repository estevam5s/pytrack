# Loop de jogo e sprites

Pygame fornece a base para jogos 2D e aprendizado.

## Pontos-chave

- Game loop: eventos, update, render
- Surfaces, sprites e colisões
- Controle de FPS com Clock
- Entrada de teclado/mouse

## Exemplo

```python
import pygame
pygame.init()
tela = pygame.display.set_mode((640, 480))
rodando = True
while rodando:
    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            rodando = False
    tela.fill((0, 0, 0))
    pygame.display.flip()
```

## Boas práticas

- Separe lógica de renderização
- Use grupos de sprites

## Saiba mais

- [Documentação oficial](https://www.pygame.org/docs/)
