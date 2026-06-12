# Gráficos e Dashboards: Visualização, KPIs e Comunicação Executiva

Dashboards em Excel transformam dados em decisão. Um dashboard bom responde perguntas rapidamente. Um dashboard ruim é uma coleção de gráficos bonitos sem direção.

O objetivo é comunicar situação, tendência, exceção e ação.

---

## Antes de Criar um Dashboard

Responda:

- quem vai usar?
- qual decisão será tomada?
- qual periodicidade?
- quais KPIs importam?
- qual nível de detalhe?
- quais filtros são necessários?
- qual fonte dos dados?
- como será atualizado?

Dashboard sem usuário claro costuma virar decoração.

---

## KPIs

KPI é indicador-chave.

Exemplos comerciais:

- receita;
- margem;
- ticket médio;
- conversão;
- pedidos;
- clientes ativos;
- meta atingida.

Exemplos operacionais:

- estoque disponível;
- ruptura;
- SLA;
- atrasos;
- produtividade;
- erros.

Cada KPI deve ter definição precisa.

---

## Layout Profissional

Estrutura comum:

```text
Topo: título, período, data de atualização
Linha 1: KPIs principais
Linha 2: tendências
Linha 3: detalhamento por categoria/região
Lateral: filtros/segmentações
Rodapé: fonte e observações
```

Evite colocar tudo no dashboard. Priorize leitura.

---

## Escolha de Gráficos

| Objetivo | Gráfico recomendado |
|---|---|
| tendência no tempo | linha |
| comparação entre categorias | barras |
| composição limitada | barras empilhadas |
| parte do todo simples | pizza com muito cuidado |
| distribuição | histograma/boxplot |
| relação entre variáveis | dispersão |
| KPI único | cartão |

Gráfico de pizza com muitas categorias é difícil de ler. Prefira barras.

---

## Gráficos de Linha

Use para séries temporais:

```text
receita mensal
pedidos por dia
temperatura por hora
saldo acumulado
```

Boas práticas:

- eixo temporal ordenado;
- rótulos apenas quando necessários;
- meta como linha de referência;
- evitar muitas séries juntas;
- destacar anomalias.

---

## Gráficos de Barras

Use para ranking e comparação:

```text
top vendedores
receita por região
chamados por categoria
estoque por produto
```

Boas práticas:

- ordenar por valor;
- começar eixo em zero;
- rótulos claros;
- limitar categorias ou agrupar "Outros".

---

## Cartões de KPI

Cartões devem mostrar:

- valor atual;
- variação;
- meta;
- status;
- período.

Exemplo:

```text
Receita
R$ 1.250.000
+8,4% vs mês anterior
Meta: 103%
```

Sem contexto, número isolado tem pouco valor.

---

## Cores

Use cores com significado:

- verde: bom/aprovado;
- vermelho: problema;
- amarelo: atenção;
- cinza: contexto;
- azul: neutro/informativo.

Não dependa apenas de cor. Use rótulo, ícone ou texto para acessibilidade.

---

## Segmentações

Segmentações conectadas a tabelas dinâmicas permitem filtro visual:

- ano;
- mês;
- região;
- produto;
- vendedor;
- status.

Cuidados:

- não use filtros demais;
- deixe claro o filtro ativo;
- use segmentações consistentes.

---

## Formatação Condicional

Útil para:

- destacar valores fora da meta;
- semáforos;
- duplicados;
- barras de dados;
- mapas de calor.

Evite excesso. Se tudo está destacado, nada está destacado.

---

## Dashboard com Tabelas Dinâmicas

Fluxo:

```text
Base em tabela
-> tabela dinâmica
-> gráfico dinâmico
-> segmentações
-> dashboard
```

Vantagem:

- atualização simples;
- filtros integrados;
- menos fórmulas manuais;
- boa performance para uso comum.

---

## Dashboard com Python

Python pode gerar base tratada e Excel final:

```text
sistema/API/banco
-> Python limpa e calcula
-> gera arquivo Excel
-> usuário analisa dashboard
```

Python deve cuidar de repetição, volume e integração. Excel deve cuidar de exploração e apresentação quando isso for melhor para o usuário.

---

## Storytelling

Dashboard deve responder:

- o que aconteceu?
- está bom ou ruim?
- onde está o problema?
- qual tendência?
- qual ação sugerida?

Exemplo:

```text
Receita caiu 12%
Queda concentrada na região Sul
Produto X representa 70% da queda
Estoque ficou indisponível por 5 dias
```

---

## Erros Comuns

- gráfico sem pergunta;
- excesso de cores;
- pizza com muitas categorias;
- eixo truncado enganoso;
- KPI sem meta;
- dashboard sem data de atualização;
- filtros escondidos;
- fontes pequenas;
- dados e visualização na mesma aba;
- layout que depende de zoom específico.

---

## Checklist

- Dashboard tem público definido?
- KPIs têm definição clara?
- Existe data de atualização?
- Gráficos respondem perguntas?
- Cores têm significado?
- Filtros estão visíveis?
- Há meta ou comparação?
- Layout é legível?
- Base está separada da apresentação?
- Existe controle de qualidade dos dados?

Dashboard profissional não é o mais colorido. É o que permite entender situação e agir com confiança.

