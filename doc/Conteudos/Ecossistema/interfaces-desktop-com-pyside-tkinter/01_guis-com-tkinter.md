# GUIs com Tkinter

Tkinter é a biblioteca padrão para interfaces gráficas simples.

> **Tema:** GUI · **Nível:** intermediario · **Trilha:** Interfaces Desktop com PySide/Tkinter

## Conceitos-chave

Nesta lição você vai entender:

- **Widgets, layout (pack/grid) e eventos**
- **Janelas, diálogos e menus**
- **Binding de variáveis**
- **Loop principal mainloop()**

## Exemplo prático

```python
import tkinter as tk
root = tk.Tk()
tk.Label(root, text='Olá').pack()
tk.Button(root, text='Sair', command=root.destroy).pack()
root.mainloop()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Separe UI da lógica
- Use grid para layouts complexos

## Pratique

Para fixar, escreva um pequeno script que combine **widgets, layout (pack/grid) e eventos** e **janelas, diálogos e menus** em um caso do seu dia a dia. Depois refatore aplicando "Separe UI da lógica".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Widgets, layout (pack/grid) e eventos
- [ ] Explicar e aplicar: Janelas, diálogos e menus
- [ ] Explicar e aplicar: Binding de variáveis
- [ ] Explicar e aplicar: Loop principal mainloop()

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/tkinter.html)
