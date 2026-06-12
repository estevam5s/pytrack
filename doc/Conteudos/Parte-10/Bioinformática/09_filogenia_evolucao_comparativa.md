# Filogenia, Evolução Molecular e Comparação de Genomas

Filogenia estuda relações evolutivas. Em bioinformática, árvores são inferidas a partir de sequências, alinhamentos e modelos evolutivos.

---

## Homologia

Sequências homólogas compartilham ancestral comum.

Tipos:

- ortólogos: separados por especiação;
- parálogos: separados por duplicação gênica;
- xenólogos: transferência horizontal.

Similaridade não é o mesmo que homologia. Homologia é uma hipótese evolutiva.

---

## Alinhamento Múltiplo

Alinhamento múltiplo compara várias sequências.

Ferramentas:

- MAFFT;
- MUSCLE;
- Clustal Omega.

```bash
mafft sequencias.fasta > alinhamento.fasta
```

O alinhamento influencia diretamente a árvore.

---

## Modelos Evolutivos

Modelos descrevem substituições ao longo do tempo.

Exemplos:

- JC69;
- K2P;
- HKY;
- GTR;
- modelos para aminoácidos como JTT, WAG, LG.

Escolha de modelo afeta inferência.

---

## Métodos de Árvore

- distância;
- máxima parcimônia;
- máxima verossimilhança;
- Bayesiano.

Ferramentas:

- IQ-TREE;
- RAxML;
- BEAST;
- MrBayes;
- FastTree.

---

## Lendo Árvore Newick

```python
from Bio import Phylo

tree = Phylo.read("arvore.nwk", "newick")
Phylo.draw_ascii(tree)
```

---

## Comparação de Genomas

Perguntas:

- quais genes são compartilhados?
- quais genes são exclusivos?
- há rearranjos?
- há transferência horizontal?
- qual o pan-genoma?
- quais regiões são conservadas?

---

## Métricas

- identidade;
- cobertura;
- distância genética;
- ANI;
- presença/ausência de genes;
- tamanho de genoma;
- GC content;
- synteny.

---

## Cuidados

- alinhamento ruim gera árvore ruim;
- recombinação pode distorcer filogenia;
- baixa cobertura afeta inferência;
- escolha de outgroup importa;
- suporte de bootstrap deve ser analisado;
- árvores representam hipóteses, não certezas absolutas.

---

## Exercícios

1. Explique ortólogo e parálogo.
2. Gere alinhamento múltiplo com ferramenta externa.
3. Leia árvore Newick com Biopython.
4. Interprete bootstrap.
5. Liste métricas para comparar genomas bacterianos.
