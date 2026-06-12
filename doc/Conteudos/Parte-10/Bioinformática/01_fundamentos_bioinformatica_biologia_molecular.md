# Fundamentos de Bioinformática e Biologia Molecular

Bioinformática combina biologia, computação, estatística e engenharia de dados para analisar informações biológicas. Ela é usada em genômica, transcriptômica, proteômica, epidemiologia, evolução, medicina de precisão, agricultura, microbiologia e biotecnologia.

---

## Dogma Central

Fluxo clássico da informação genética:

```text
DNA -> RNA -> proteína
```

- DNA armazena informação genética.
- RNA pode carregar, regular ou executar funções.
- Proteínas executam grande parte das funções celulares.

Esse modelo é uma base, mas a biologia real inclui regulação, splicing, RNAs não codificantes, modificações epigenéticas e controle pós-traducional.

---

## DNA

DNA é composto por nucleotídeos:

- A: adenina;
- T: timina;
- C: citosina;
- G: guanina.

Pareamento:

```text
A <-> T
C <-> G
```

```python
complemento = str.maketrans("ATCGatcg", "TAGCtagc")
seq = "ATGCCGTA"
print(seq.translate(complemento))
```

---

## RNA

RNA usa uracila `U` em vez de timina `T`.

Transcrição simplificada:

```python
dna = "ATGCCGTA"
rna = dna.replace("T", "U")
print(rna)
```

Tipos:

- mRNA;
- rRNA;
- tRNA;
- miRNA;
- lncRNA;
- snRNA.

---

## Proteínas

Proteínas são cadeias de aminoácidos. Cada códon, geralmente três bases de RNA, codifica um aminoácido ou sinal de parada.

```python
from Bio.Seq import Seq

dna = Seq("ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG")
print(dna.translate())
```

---

## Genes, Genomas e Cromossomos

- Gene: região funcional do DNA.
- Genoma: conjunto completo de material genético.
- Cromossomo: estrutura que organiza DNA.
- Locus: posição no genoma.
- Alelo: versão de uma sequência em um locus.

Em eucariotos, genes podem ter éxons e íntrons. O RNA maduro pode passar por splicing.

---

## Variante Genética

Tipos comuns:

- SNV: variação de uma base;
- SNP: SNV comum em população;
- indel: inserção/deleção;
- CNV: variação no número de cópias;
- inversão;
- translocação;
- variante estrutural.

Impactos possíveis:

- sinônima;
- missense;
- nonsense;
- frameshift;
- splice site;
- regulatória.

---

## O Que a Bioinformática Analisa

- sequências de DNA/RNA/proteína;
- leituras de sequenciamento;
- expressão gênica;
- variantes;
- genomas montados;
- metagenomas;
- estruturas proteicas;
- redes biológicas;
- árvores filogenéticas;
- dados clínicos ou fenotípicos associados.

---

## Perguntas Típicas

- Esta sequência pertence a qual organismo?
- Que genes existem neste genoma?
- Quais variantes diferenciam duas amostras?
- Quais genes estão diferencialmente expressos?
- Qual a relação evolutiva entre organismos?
- Há mutações associadas a uma condição?
- Uma proteína contém qual domínio?
- Uma amostra metagenômica contém quais espécies?

---

## Cuidados de Interpretação

Resultados computacionais não são automaticamente verdade biológica.

Considere:

- qualidade dos dados;
- cobertura;
- viés de amostragem;
- referência usada;
- parâmetros;
- estatística;
- validação experimental;
- contexto biológico;
- limitações da ferramenta.

---

## Exercícios

1. Escreva uma função para complemento de DNA.
2. Converta DNA para RNA.
3. Traduza uma sequência com Biopython.
4. Explique diferença entre SNV, SNP e indel.
5. Liste três perguntas que bioinformática pode responder.
