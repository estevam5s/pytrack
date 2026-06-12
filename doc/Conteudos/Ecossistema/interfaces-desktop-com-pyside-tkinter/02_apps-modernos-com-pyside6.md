# Apps modernos com PySide6

Qt para desktop completo e profissional.

## Pontos-chave

- Widgets ricos e estilização (QSS)
- Signals e slots
- Qt Designer para telas
- Empacotamento com PyInstaller

## Exemplo

```python
from PySide6.QtWidgets import QApplication, QPushButton
app = QApplication([])
btn = QPushButton('Clique')
btn.clicked.connect(lambda: print('clicou'))
btn.show()
app.exec()
```

## Boas práticas

- Use threads para não travar a UI
- Separe em MVC/MVVM

## Saiba mais

- [Documentação oficial](https://doc.qt.io/qtforpython/)
