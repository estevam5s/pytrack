# Matplotlib e Seaborn

Construa gráficos estáticos com controle fino e estatística visual.

> **Tema:** Visualização · **Nível:** intermediario · **Trilha:** Visualização de Dados

## Conceitos-chave

Nesta lição você vai entender:

- **Figura, eixos e subplots**
- **Seaborn para gráficos estatísticos rápidos**
- **Estilos e paletas**
- **Exportar para PNG/SVG**

## Exemplo prático

```python
import seaborn as sns, matplotlib.pyplot as plt
sns.barplot(data=df, x='categoria', y='valor')
plt.title('Vendas')
plt.tight_layout()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Escolha o gráfico certo para a mensagem
- Rotule eixos e use títulos claros

## Pratique

Para fixar, escreva um pequeno script que combine **figura, eixos e subplots** e **seaborn para gráficos estatísticos rápidos** em um caso do seu dia a dia. Depois refatore aplicando "Escolha o gráfico certo para a mensagem".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Figura, eixos e subplots
- [ ] Explicar e aplicar: Seaborn para gráficos estatísticos rápidos
- [ ] Explicar e aplicar: Estilos e paletas
- [ ] Explicar e aplicar: Exportar para PNG/SVG

## Saiba mais

- [Documentação oficial](https://seaborn.pydata.org/)
