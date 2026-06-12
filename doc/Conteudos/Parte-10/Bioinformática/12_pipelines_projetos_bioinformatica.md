# Pipelines e Projetos Profissionais de Bioinformática

Pipelines organizam etapas de análise em fluxo reprodutível. Projetos profissionais precisam executar de forma previsível, registrar parâmetros e permitir auditoria dos resultados.

---

## Por Que Usar Pipelines

Sem pipeline:

- comandos manuais;
- parâmetros perdidos;
- resultados difíceis de reproduzir;
- erros silenciosos;
- dependências implícitas;
- pouca escalabilidade.

Com pipeline:

- etapas declaradas;
- logs;
- paralelização;
- reexecução parcial;
- controle de ambiente;
- rastreabilidade.

---

## Snakemake

Exemplo conceitual:

```python
rule all:
    input:
        "results/multiqc_report.html"

rule fastqc:
    input:
        "data/raw/{sample}.fastq.gz"
    output:
        "results/fastqc/{sample}_fastqc.html"
    shell:
        "fastqc {input} -o results/fastqc"

rule multiqc:
    input:
        expand("results/fastqc/{sample}_fastqc.html", sample=["S1", "S2"])
    output:
        "results/multiqc_report.html"
    shell:
        "multiqc results/fastqc -o results"
```

---

## Nextflow

Nextflow é muito usado em produção e HPC/cloud.

Características:

- processos;
- canais;
- containers;
- execução local, HPC ou cloud;
- forte ecossistema nf-core.

---

## Containers

Docker/Singularity ajudam a fixar ambiente.

Registre:

- imagem;
- tag;
- digest quando possível;
- ferramentas internas;
- versão.

---

## Projeto 1: Análise FASTA

Funcionalidades:

- contar sequências;
- calcular tamanho médio;
- calcular GC content;
- filtrar por tamanho;
- gerar relatório.

---

## Projeto 2: QC de FASTQ

Funcionalidades:

- ler FASTQ;
- calcular qualidade média;
- filtrar reads;
- resumir métricas;
- gerar gráficos;
- comparar antes/depois.

---

## Projeto 3: Pipeline de Variantes

Etapas:

- QC;
- trimming;
- alinhamento;
- BAM sort/index;
- chamada de variantes;
- filtragem;
- anotação;
- relatório.

---

## Projeto 4: RNA-seq Exploratório

Etapas:

- ler matriz de contagens;
- normalizar;
- PCA;
- heatmap;
- volcano plot;
- enriquecimento funcional conceitual.

---

## Projeto 5: Filogenia Simples

Etapas:

- coletar sequências;
- alinhamento múltiplo;
- trimming de alinhamento;
- inferência de árvore;
- visualização;
- interpretação.

---

## Checklist de Entrega

- README explica objetivo.
- Dados brutos preservados.
- Metadados validados.
- Ambiente documentado.
- Ferramentas e versões registradas.
- Parâmetros explícitos.
- Logs salvos.
- Resultados em pasta separada.
- Figuras com legenda.
- Limitações descritas.

---

## Estrutura Recomendada

```text
projeto-bioinfo/
├── README.md
├── config/
├── data/
│   ├── raw/
│   ├── reference/
│   └── processed/
├── results/
├── reports/
├── workflows/
├── scripts/
├── notebooks/
└── envs/
```

---

## Exercícios Finais

1. Crie projeto de análise FASTA.
2. Crie projeto de QC FASTQ.
3. Escreva um Snakefile simples.
4. Gere relatório com métricas e gráficos.
5. Documente versões, parâmetros e limitações.
