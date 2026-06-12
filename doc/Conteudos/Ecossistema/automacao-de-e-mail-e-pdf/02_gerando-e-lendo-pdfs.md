# Gerando e lendo PDFs

Crie e extraia conteúdo de PDFs.

## Pontos-chave

- reportlab para gerar PDFs
- pypdf/pdfplumber para ler
- Mesclar e dividir páginas
- Extrair tabelas

## Exemplo

```python
from pypdf import PdfReader
r = PdfReader('doc.pdf')
print(r.pages[0].extract_text())
```

## Boas práticas

- Valide PDFs de fontes não confiáveis
- Cuide da formatação

## Saiba mais

- [Documentação oficial](https://pypdf.readthedocs.io/)
