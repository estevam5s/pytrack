# GUIs com Tkinter

Tkinter é a biblioteca padrão para interfaces gráficas simples.

## Pontos-chave

- Widgets, layout (pack/grid) e eventos
- Janelas, diálogos e menus
- Binding de variáveis
- Loop principal mainloop()

## Exemplo

```python
import tkinter as tk
root = tk.Tk()
tk.Label(root, text='Olá').pack()
tk.Button(root, text='Sair', command=root.destroy).pack()
root.mainloop()
```

## Boas práticas

- Separe UI da lógica
- Use grid para layouts complexos

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/tkinter.html)
