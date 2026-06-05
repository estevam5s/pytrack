# Transcriptômica, RNA-seq e Expressão Gênica

Transcriptômica estuda o conjunto de RNAs expressos em uma célula, tecido, organismo ou condição. RNA-seq permite medir expressão, descobrir transcritos, estudar splicing e comparar condições.

---

## Conceitos

- Expressão gênica: nível de RNA associado a um gene/transcrito.
- Transcriptoma: conjunto de transcritos.
- Splicing: remoção de íntrons e junção de éxons.
- Isoforma: versão de transcrito de um gene.
- Contagem: número de reads atribuídas a gene/transcrito.

---

## Fluxo RNA-seq

```text
FASTQ -> QC -> trimming -> alinhamento/quantificação -> matriz de contagens -> normalização -> análise diferencial -> interpretação
```

Ferramentas:

- STAR;
- HISAT2;
- Salmon;
- Kallisto;
- featureCounts;
- HTSeq;
- DESeq2;
- edgeR;
- limma-voom.

Python pode organizar, validar, visualizar e integrar resultados. Muitos testes diferenciais clássicos são feitos em R.

---

## Matriz de Contagens

```text
gene_id,S1,S2,S3,S4
geneA,100,120,500,530
geneB,50,45,40,42
```

```python
import pandas as pd

counts = pd.read_csv("counts.csv", index_col=0)
print(counts.head())
```

---

## Normalização

Contagens brutas dependem de:

- profundidade de sequenciamento;
- tamanho do gene/transcrito;
- composição da amostra;
- viés técnico.

Medidas comuns:

- CPM;
- TPM;
- FPKM/RPKM;
- size factors;
- normalizações específicas de DESeq2/edgeR.

TPM é útil para comparação dentro de amostra e entre genes, mas análise diferencial exige métodos estatísticos apropriados.

---

## CPM Simples

```python
def cpm(counts):
    return counts.div(counts.sum(axis=0), axis=1) * 1_000_000

cpm_counts = cpm(counts)
```

---

## Visualização

```python
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

log_counts = np.log2(cpm_counts + 1)
sns.clustermap(log_counts)
plt.show()
```

---

## Análise Diferencial

Pergunta típica:

```text
Quais genes mudam entre controle e tratado?
```

Resultados comuns:

- log2 fold change;
- p-value;
- adjusted p-value;
- baseMean;
- estatística do teste.

Controle de múltiplos testes é obrigatório.

---

## Volcano Plot

```python
import numpy as np
import matplotlib.pyplot as plt

res = pd.read_csv("deseq2_results.csv")
plt.scatter(res["log2FoldChange"], -np.log10(res["padj"]), s=10)
plt.axhline(-np.log10(0.05), color="red")
plt.xlabel("log2 fold change")
plt.ylabel("-log10 adjusted p-value")
plt.show()
```

---

## Cuidados

- desenho experimental;
- replicatas biológicas;
- batch effects;
- qualidade das amostras;
- anotação correta;
- controle de múltiplos testes;
- genes de baixa contagem;
- interpretação funcional;
- validação experimental.

---

## Exercícios

1. Leia uma matriz de contagens.
2. Calcule CPM.
3. Faça heatmap de genes.
4. Interprete log2 fold change.
5. Liste riscos de batch effect.
