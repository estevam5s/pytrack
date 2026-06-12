# Loop de jogo e sprites

Pygame fornece a base para jogos 2D e aprendizado.

> **Tema:** Games · **Nível:** intermediario · **Trilha:** Desenvolvimento de Jogos com Pygame

## Conceitos-chave

Nesta lição você vai entender:

- **Game loop: eventos, update, render**
- **Surfaces, sprites e colisões**
- **Controle de FPS com Clock**
- **Entrada de teclado/mouse**

## Exemplo prático

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

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Separe lógica de renderização
- Use grupos de sprites

## Pratique

Para fixar, escreva um pequeno script que combine **game loop: eventos, update, render** e **surfaces, sprites e colisões** em um caso do seu dia a dia. Depois refatore aplicando "Separe lógica de renderização".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Game loop: eventos, update, render
- [ ] Explicar e aplicar: Surfaces, sprites e colisões
- [ ] Explicar e aplicar: Controle de FPS com Clock
- [ ] Explicar e aplicar: Entrada de teclado/mouse

## Saiba mais

- [Documentação oficial](https://www.pygame.org/docs/)
