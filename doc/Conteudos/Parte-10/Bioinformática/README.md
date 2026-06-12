# Bioinformática com Python

Trilha completa e profunda sobre bioinformática usando Python. O objetivo é conectar biologia molecular, estatística, programação, análise de sequências, genômica, transcriptômica, variantes, filogenia, proteômica, bancos biológicos, pipelines reprodutíveis e projetos práticos.

Bioinformática não é apenas manipular arquivos FASTA. É transformar dados biológicos em evidência confiável, com controle de qualidade, rastreabilidade, estatística, documentação, reprodutibilidade e interpretação biológica.

---

## Arquivos da Trilha

1. [Fundamentos de Bioinformática e Biologia Molecular](./01_fundamentos_bioinformatica_biologia_molecular.md)
2. [Ambiente Python, Bibliotecas e Organização de Projetos](./02_ambiente_python_bioinformatica.md)
3. [Formatos Biológicos: FASTA, FASTQ, SAM/BAM, VCF, GFF/GTF e BED](./03_formatos_biologicos.md)
4. [Biopython e Manipulação de Sequências](./04_biopython_sequencias.md)
5. [Controle de Qualidade e Pré-processamento de Dados NGS](./05_qualidade_preprocessamento_ngs.md)
6. [Alinhamento, Mapeamento e Busca de Similaridade](./06_alinhamento_mapeamento_blast.md)
7. [Genômica, Anotação e Análise de Variantes](./07_genomica_anotacao_variantes.md)
8. [Transcriptômica, RNA-seq e Expressão Gênica](./08_transcriptomica_rnaseq.md)
9. [Filogenia, Evolução Molecular e Comparação de Genomas](./09_filogenia_evolucao_comparativa.md)
10. [Proteômica, Estruturas, Motivos e Análise de Proteínas](./10_proteomica_estruturas_proteinas.md)
11. [Bancos de Dados Biológicos, APIs e Reprodutibilidade](./11_bancos_dados_apis_reprodutibilidade.md)
12. [Pipelines e Projetos Profissionais de Bioinformática](./12_pipelines_projetos_bioinformatica.md)

---

## Bibliotecas e Ferramentas Principais

```bash
pip install biopython pandas numpy scipy matplotlib seaborn scikit-learn statsmodels pysam pyfaidx gffutils requests jupyter pytest
```

Ferramentas externas frequentes:

```text
FastQC
MultiQC
cutadapt
trimmomatic
BWA
Bowtie2
STAR
HISAT2
samtools
bcftools
bedtools
blast+
MAFFT
IQ-TREE
Nextflow
Snakemake
Docker
Conda/Mamba
```

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- explicar DNA, RNA, proteínas, genes, genomas e variantes;
- ler e escrever FASTA, FASTQ, VCF, GFF/GTF, BED e SAM/BAM;
- usar Biopython para sequências, tradução, transcrição e parsing;
- avaliar qualidade de leituras NGS;
- entender alinhamento local, global, BLAST e mapeamento contra referência;
- interpretar variantes SNV, indels, efeitos e anotações;
- entender fluxo básico de RNA-seq;
- aplicar conceitos de filogenia e evolução molecular;
- trabalhar com proteínas, motivos e domínios;
- consultar bancos públicos e APIs biológicas;
- criar pipelines reprodutíveis;
- documentar parâmetros, versões, amostras e resultados;
- separar análise exploratória de produção;
- evitar conclusões biológicas sem controle estatístico e validação.

---

## Estrutura Recomendada de Projeto

```text
bioinfo-python/
├── README.md
├── pyproject.toml
├── config/
├── data/
│   ├── raw/
│   ├── reference/
│   ├── processed/
│   └── results/
├── notebooks/
├── reports/
├── src/
│   └── bioinfo/
│       ├── io.py
│       ├── sequences.py
│       ├── qc.py
│       ├── variants.py
│       ├── expression.py
│       ├── phylogeny.py
│       └── plots.py
├── workflows/
└── tests/
```

---

## Regra Principal

Bioinformática profissional exige reprodutibilidade. Guarde dados brutos, versões de ferramentas, parâmetros, referências, metadados, logs e decisões analíticas. Sem isso, um resultado pode ser impossível de verificar ou repetir.
