# Controle de Qualidade e Pré-processamento de Dados NGS

Dados de sequenciamento de nova geração, NGS, precisam de controle de qualidade antes de análises como alinhamento, variantes ou expressão gênica. Problemas na entrada se propagam pelo pipeline.

---

## O Que Avaliar

Em FASTQ, avalie:

- qualidade por base;
- qualidade por leitura;
- distribuição de tamanho;
- conteúdo GC;
- adaptadores;
- duplicação;
- bases N;
- overrepresented sequences;
- contaminação;
- queda de qualidade no final da leitura.

Ferramentas comuns:

```text
FastQC
MultiQC
cutadapt
trimmomatic
fastp
```

---

## Qualidade Média por Leitura

```python
from Bio import SeqIO

def qualidade_media_fastq(caminho):
    medias = []
    for record in SeqIO.parse(caminho, "fastq"):
        qs = record.letter_annotations["phred_quality"]
        medias.append(sum(qs) / len(qs))
    return medias
```

---

## Filtragem Simples

```python
from Bio import SeqIO

def filtrar_por_qualidade(entrada, saida, minimo=20):
    aprovadas = []
    for record in SeqIO.parse(entrada, "fastq"):
        qs = record.letter_annotations["phred_quality"]
        if sum(qs) / len(qs) >= minimo:
            aprovadas.append(record)
    SeqIO.write(aprovadas, saida, "fastq")
```

Para produção, prefira ferramentas otimizadas como `fastp` ou `cutadapt`.

---

## Trimming

Trimming remove:

- bases de baixa qualidade;
- adaptadores;
- primers;
- regiões técnicas.

Cuidados:

- trimming agressivo reduz cobertura;
- trimming insuficiente prejudica alinhamento;
- parâmetros devem ser documentados.

---

## MultiQC

MultiQC agrega relatórios de várias ferramentas.

```bash
multiqc results/qc -o reports/multiqc
```

Ele facilita comparação entre amostras.

---

## Contaminação

Sinais possíveis:

- GC inesperado;
- muitas sequências super-representadas;
- alinhamento contra organismo errado;
- baixa taxa de mapeamento;
- presença de adaptadores.

Ferramentas de classificação taxonômica podem ajudar em metagenômica e contaminação.

---

## Boas Práticas

- Rode QC antes e depois do trimming.
- Guarde relatórios.
- Não delete FASTQ bruto.
- Documente ferramenta e parâmetros.
- Compare amostras por lote.
- Investigue outliers.
- Use controles quando disponíveis.

---

## Exercícios

1. Calcule qualidade média de leituras FASTQ.
2. Filtre leituras por qualidade média.
3. Liste métricas de FastQC.
4. Explique por que rodar QC antes e depois do trimming.
5. Crie um relatório simples com número de reads aprovadas.
