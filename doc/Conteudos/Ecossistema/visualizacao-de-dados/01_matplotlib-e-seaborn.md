# Matplotlib e Seaborn

Construa gráficos estáticos com controle fino e estatística visual.

## Pontos-chave

- Figura, eixos e subplots
- Seaborn para gráficos estatísticos rápidos
- Estilos e paletas
- Exportar para PNG/SVG

## Exemplo

```python
import seaborn as sns, matplotlib.pyplot as plt
sns.barplot(data=df, x='categoria', y='valor')
plt.title('Vendas')
plt.tight_layout()
```

## Boas práticas

- Escolha o gráfico certo para a mensagem
- Rotule eixos e use títulos claros

## Saiba mais

- [Documentação oficial](https://seaborn.pydata.org/)
