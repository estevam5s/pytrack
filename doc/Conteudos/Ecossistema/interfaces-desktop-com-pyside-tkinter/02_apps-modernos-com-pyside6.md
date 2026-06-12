# Apps modernos com PySide6

Qt para desktop completo e profissional.

> **Tema:** GUI · **Nível:** intermediario · **Trilha:** Interfaces Desktop com PySide/Tkinter

## Conceitos-chave

Nesta lição você vai entender:

- **Widgets ricos e estilização (QSS)**
- **Signals e slots**
- **Qt Designer para telas**
- **Empacotamento com PyInstaller**

## Exemplo prático

```python
from PySide6.QtWidgets import QApplication, QPushButton
app = QApplication([])
btn = QPushButton('Clique')
btn.clicked.connect(lambda: print('clicou'))
btn.show()
app.exec()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use threads para não travar a UI
- Separe em MVC/MVVM

## Pratique

Para fixar, escreva um pequeno script que combine **widgets ricos e estilização (qss)** e **signals e slots** em um caso do seu dia a dia. Depois refatore aplicando "Use threads para não travar a UI".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Widgets ricos e estilização (QSS)
- [ ] Explicar e aplicar: Signals e slots
- [ ] Explicar e aplicar: Qt Designer para telas
- [ ] Explicar e aplicar: Empacotamento com PyInstaller

## Saiba mais

- [Documentação oficial](https://doc.qt.io/qtforpython/)
