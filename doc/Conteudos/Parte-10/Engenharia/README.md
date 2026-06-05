# Arquitetura e Engenharia de Software

Trilha completa e progressiva sobre arquitetura de software para aplicações Python e sistemas backend: MVC, MVVM, microsserviços, monolitos, DDD, arquitetura orientada a eventos e arquitetura hexagonal.

O objetivo é sair dos conceitos fundamentais até decisões profissionais de projeto: separação de responsabilidades, organização de código, limites de domínio, comunicação entre serviços, consistência, deploy, testes, evolução arquitetural e trade-offs de produção.

---

## Arquivos da Trilha

1. [MVC: Model-View-Controller na Prática](./01_mvc.md)
2. [MVVM: Model-View-ViewModel e Separação de Estado](./02_mvvm.md)
3. [Microsserviços: Arquitetura Distribuída, Operação e Trade-offs](./03_microsservicos.md)
4. [Monolitos: Arquitetura Modular, Escalabilidade e Evolução](./04_monolitos.md)
5. [DDD: Domain-Driven Design do Básico ao Avançado](./05_ddd.md)
6. [Event-Driven Architecture: Eventos, Mensageria e Consistência](./06_event_driven_architecture.md)
7. [Hexagonal Architecture: Ports, Adapters e Domínio Protegido](./07_hexagonal_architecture.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- separar responsabilidades entre interface, aplicação, domínio e infraestrutura;
- reconhecer quando usar MVC, MVVM ou arquiteturas em camadas;
- projetar monolitos modulares antes de partir para microsserviços;
- avaliar custos reais de sistemas distribuídos;
- modelar domínios com entidades, value objects, agregados, serviços e eventos;
- definir bounded contexts e contratos entre áreas do sistema;
- aplicar arquitetura orientada a eventos com filas, brokers, outbox e idempotência;
- usar arquitetura hexagonal para isolar regras de negócio de frameworks e bancos;
- escolher arquitetura com base em contexto, equipe, escala, deploy e risco;
- escrever sistemas Python mais testáveis, evolutivos e operáveis.

---

## Projeto Base Usado nos Exemplos

Muitos exemplos usam um sistema simples de pedidos:

```text
pedido/
├── cliente_id
├── itens
├── total
├── status
└── eventos
```

O mesmo problema será reorganizado com estilos diferentes para mostrar como a arquitetura muda a distribuição das responsabilidades.

---

## Regra Principal

Arquitetura não é uma coleção de nomes bonitos. Ela só é boa quando reduz risco real: mudança mais segura, regra de negócio mais clara, deploy mais previsível, operação mais observável e custo compatível com a capacidade da equipe.

