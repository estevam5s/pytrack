# SOLID em Python

Trilha completa e avançada para dominar SOLID em Python, do básico de orientação a objetos até arquitetura limpa, ports and adapters, injeção de dependência, testes e refatoração profissional.

SOLID não é uma lista de regras para decorar. É um conjunto de princípios para reduzir acoplamento, aumentar coesão, proteger contratos, facilitar testes e permitir evolução sem quebrar código existente.

---

## Arquivos da Trilha

1. [Fundamentos de OO, Tipagem e Design em Python](./01_fundamentos_oo_design_python.md)
2. [SRP: Single Responsibility Principle](./02_srp_responsabilidade_unica.md)
3. [OCP: Open/Closed Principle](./03_ocp_aberto_fechado.md)
4. [LSP: Liskov Substitution Principle](./04_lsp_substituicao_liskov.md)
5. [ISP: Interface Segregation Principle](./05_isp_segregacao_interfaces.md)
6. [DIP: Dependency Inversion Principle](./06_dip_inversao_dependencia.md)
7. [SOLID Aplicado: Arquitetura Limpa, Padrões, Testes e Refatoração](./07_solid_aplicado_arquitetura_testes.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- identificar responsabilidades misturadas;
- separar regra de negócio, infraestrutura e apresentação;
- criar código aberto para extensão e fechado para modificação;
- usar polimorfismo, abstrações, `Protocol` e `ABC` com critério;
- reconhecer heranças que violam contratos;
- desenhar interfaces pequenas e orientadas ao consumidor;
- inverter dependências para reduzir acoplamento;
- aplicar Strategy, Factory, Adapter e Template Method;
- criar serviços de domínio, casos de uso, repositórios e adaptadores;
- testar com mocks, stubs e fakes sem acoplar testes à implementação;
- refatorar código legado em direção a SOLID sem reescrever tudo.

---

## Ideia Central

SOLID ajuda quando o software precisa mudar. Um script pequeno pode não precisar de camadas, interfaces e factories. Mas sistemas com regras de negócio, integrações, persistência, autenticação, filas, APIs e testes se beneficiam muito de design explícito.

O bom uso de SOLID em Python respeita a linguagem:

- usa duck typing quando basta;
- usa `typing.Protocol` para contratos estruturais;
- usa `abc.ABC` quando quer herança nominal e obrigatoriedade explícita;
- usa composição antes de herança;
- usa funções simples quando classe não agrega valor;
- usa dataclasses para dados;
- evita abstrações prematuras.

