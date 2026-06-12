# Matriz de Cobertura dos Conceitos de POO

Este arquivo verifica a cobertura dos conceitos solicitados e aponta onde estudar cada tema dentro da trilha.

---

## Cobertura Geral

| Conceito | Status | Onde esta coberto |
| --- | --- | --- |
| Classe | Coberto | `01_fundamentos_classes_objetos.md`, `classes.md` |
| Objeto e instancia | Coberto | `01_fundamentos_classes_objetos.md`, `classes.md` |
| Atributos | Coberto | `01_fundamentos_classes_objetos.md`, `03_metodos_magicos_properties_dataclasses_slots.md` |
| Metodos | Coberto | `01_fundamentos_classes_objetos.md`, `03_metodos_magicos_properties_dataclasses_slots.md` |
| Encapsulamento | Coberto | `01_fundamentos_classes_objetos.md`, `03_metodos_magicos_properties_dataclasses_slots.md` |
| Heranca | Coberto | `01_fundamentos_classes_objetos.md`, `05_abstracoes_protocols_mixins_mro.md` |
| Polimorfismo | Coberto | `01_fundamentos_classes_objetos.md`, `05_abstracoes_protocols_mixins_mro.md` |
| Composicao | Coberto | `02_relacionamentos_design_objetos.md`, `06_solid_ddd_patterns_arquitetura.md` |
| Associacao e agregacao | Coberto | `02_relacionamentos_design_objetos.md` |
| Metodos magicos | Coberto | `03_metodos_magicos_properties_dataclasses_slots.md` |
| `@property` | Coberto | `01_fundamentos_classes_objetos.md`, `03_metodos_magicos_properties_dataclasses_slots.md` |
| `@classmethod` | Coberto | `03_metodos_magicos_properties_dataclasses_slots.md`, `04_decorators_descriptors_context_metaclasses.md` |
| `@staticmethod` | Coberto | `03_metodos_magicos_properties_dataclasses_slots.md`, `04_decorators_descriptors_context_metaclasses.md` |
| Classes abstratas com `abc` | Coberto | `05_abstracoes_protocols_mixins_mro.md` |
| Mixins | Coberto | `05_abstracoes_protocols_mixins_mro.md`, `poo_avancado.md` |
| Design patterns basicos | Coberto | `06_solid_ddd_patterns_arquitetura.md` |
| Decorators | Coberto | `04_decorators_descriptors_context_metaclasses.md`, `poo_avancado.md` |
| Descriptors | Coberto | `04_decorators_descriptors_context_metaclasses.md`, `poo_avancado.md` |
| Metaclasses | Coberto | `04_decorators_descriptors_context_metaclasses.md`, `poo_avancado.md` |
| Context managers | Coberto | `03_metodos_magicos_properties_dataclasses_slots.md`, `04_decorators_descriptors_context_metaclasses.md`, `07_persistencia_concorrencia_testes_performance.md` |
| `__slots__` | Coberto | `03_metodos_magicos_properties_dataclasses_slots.md`, `07_persistencia_concorrencia_testes_performance.md` |
| Protocols | Coberto | `05_abstracoes_protocols_mixins_mro.md`, `06_solid_ddd_patterns_arquitetura.md` |
| Patterns arquiteturais | Coberto | `06_solid_ddd_patterns_arquitetura.md`, `07_persistencia_concorrencia_testes_performance.md` |
| SOLID, DRY, KISS e YAGNI | Coberto | `06_solid_ddd_patterns_arquitetura.md`, `10_patterns_hexagonal_cqrs.md` |
| Patterns criacionais | Coberto | `06_solid_ddd_patterns_arquitetura.md`, `10_patterns_hexagonal_cqrs.md` |
| Patterns estruturais | Coberto | `06_solid_ddd_patterns_arquitetura.md`, `10_patterns_hexagonal_cqrs.md` |
| Patterns comportamentais | Coberto | `06_solid_ddd_patterns_arquitetura.md`, `10_patterns_hexagonal_cqrs.md` |
| Clean Architecture | Coberto | `06_solid_ddd_patterns_arquitetura.md`, `10_patterns_hexagonal_cqrs.md` |
| Hexagonal Architecture | Coberto | `10_patterns_hexagonal_cqrs.md` |
| CQRS | Coberto | `10_patterns_hexagonal_cqrs.md` |

---

## Dunder Methods Cobertos

| Categoria | Metodos |
| --- | --- |
| Criacao e inicializacao | `__new__`, `__init__`, `__post_init__` |
| Representacao | `__str__`, `__repr__`, `__format__` |
| Comparacao | `__eq__`, `__lt__`, `__le__`, `__gt__`, `__ge__`, `__hash__` |
| Containers | `__len__`, `__iter__`, `__contains__`, `__getitem__`, `__setitem__`, `__delitem__`, `__reversed__` |
| Operadores | `__add__`, `__radd__`, `__iadd__`, `__sub__`, `__mul__`, `__truediv__`, `__neg__`, `__abs__` |
| Chamada | `__call__` |
| Contexto | `__enter__`, `__exit__` |
| Atributos | `__getattr__`, `__getattribute__`, `__setattr__` |
| Descriptors | `__get__`, `__set__`, `__delete__`, `__set_name__` |
| Classes | `__init_subclass__` |

---

## Patterns Cobertos

| Pattern | Onde |
| --- | --- |
| Singleton | `06_solid_ddd_patterns_arquitetura.md` |
| Factory | `06_solid_ddd_patterns_arquitetura.md` |
| Abstract Factory | `10_patterns_hexagonal_cqrs.md` |
| Builder | `06_solid_ddd_patterns_arquitetura.md`, `10_patterns_hexagonal_cqrs.md` |
| Prototype | `10_patterns_hexagonal_cqrs.md` |
| Adapter | `06_solid_ddd_patterns_arquitetura.md`, `10_patterns_hexagonal_cqrs.md` |
| Facade | `10_patterns_hexagonal_cqrs.md` |
| Decorator | `10_patterns_hexagonal_cqrs.md` |
| Composite | `10_patterns_hexagonal_cqrs.md` |
| Strategy | `06_solid_ddd_patterns_arquitetura.md` |
| Observer | `06_solid_ddd_patterns_arquitetura.md` |
| Repository | `06_solid_ddd_patterns_arquitetura.md`, `07_persistencia_concorrencia_testes_performance.md` |
| Command | `06_solid_ddd_patterns_arquitetura.md` |
| Template Method | `05_abstracoes_protocols_mixins_mro.md`, `06_solid_ddd_patterns_arquitetura.md` |
| Iterator | `03_metodos_magicos_properties_dataclasses_slots.md`, `10_patterns_hexagonal_cqrs.md` |
| State | `10_patterns_hexagonal_cqrs.md` |
| Unit of Work | `07_persistencia_concorrencia_testes_performance.md` |

---

## Ordem Recomendada de Estudo

1. Comece por `01_fundamentos_classes_objetos.md`.
2. Estude relacionamentos em `02_relacionamentos_design_objetos.md`.
3. Aprofunde Python idiomatico em `03_metodos_magicos_properties_dataclasses_slots.md`.
4. Passe para metaprogramacao em `04_decorators_descriptors_context_metaclasses.md`.
5. Estude contratos e abstracoes em `05_abstracoes_protocols_mixins_mro.md`.
6. Aplique design em `06_solid_ddd_patterns_arquitetura.md`.
7. Veja uso em sistemas reais em `07_persistencia_concorrencia_testes_performance.md`.
8. Use `08_ecossistema_tendencias_roadmap.md` como plano de evolucao.
9. Use `10_patterns_hexagonal_cqrs.md` para patterns por categoria, Hexagonal Architecture e CQRS.

---

## Observacao de Manutencao

Esta matriz deve ser atualizada sempre que novos arquivos forem adicionados ou quando algum conceito ganhar uma explicacao mais completa em outro ponto da trilha.
