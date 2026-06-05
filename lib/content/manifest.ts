// GERADO AUTOMATICAMENTE por scripts/generate-content.mjs — não edite à mão.
export interface Lesson {
  slug: string;
  title: string;
  file: string;
  order: number;
}

export interface ContentModule {
  slug: string;
  title: string;
  description: string;
  part: number;
  partLabel: string;
  folder: string;
  area: string;
  level: "basico" | "intermediario" | "avancado";
  category: string;
  orderIndex: number;
  estimatedHours: number;
  lessons: Lesson[];
}

export const MODULES: ContentModule[] = [
  {
    "slug": "parte-1-basico",
    "title": "Fundamentos de Python",
    "description": "Este diretório organiza os fundamentos essenciais de Python em uma progressão de estudo. A ideia é começar pela sintaxe e pelos tipos, avançar para controle de fluxo, funções e escopo, depois chegar em recursos profissionais como tipagem, d",
    "part": 1,
    "partLabel": "Parte 1",
    "folder": "Basico",
    "area": "Fundamentos",
    "level": "basico",
    "category": "Fundamentos de Python",
    "orderIndex": 1,
    "estimatedHours": 38,
    "lessons": [
      {
        "slug": "01-sintaxe-variaveis-tipos-operadores",
        "title": "Sintaxe, Variáveis, Tipos e Operadores em Python",
        "file": "doc/Conteudos/Parte-1/Basico/01_sintaxe_variaveis_tipos_operadores.md",
        "order": 1
      },
      {
        "slug": "02-controle-de-fluxo",
        "title": "Controle de Fluxo em Python: If, Match, For e While",
        "file": "doc/Conteudos/Parte-1/Basico/02_controle_de_fluxo.md",
        "order": 2
      },
      {
        "slug": "03-funcoes-escopo-comprehensions-geradores",
        "title": "Funções, Escopo, List Comprehensions e Geradores",
        "file": "doc/Conteudos/Parte-1/Basico/03_funcoes_escopo_comprehensions_geradores.md",
        "order": 3
      },
      {
        "slug": "04-decorators-context-managers-excecoes",
        "title": "Decorators, Context Managers e Tratamento de Exceções",
        "file": "doc/Conteudos/Parte-1/Basico/04_decorators_context_managers_excecoes.md",
        "order": 4
      },
      {
        "slug": "05-tipagem-pep8-boas-praticas",
        "title": "Tipagem, PEP 8 e Boas Práticas em Python",
        "file": "doc/Conteudos/Parte-1/Basico/05_tipagem_pep8_boas_praticas.md",
        "order": 5
      },
      {
        "slug": "06-ambientes-virtuais-empacotamento",
        "title": "Ambientes Virtuais e Empacotamento em Python",
        "file": "doc/Conteudos/Parte-1/Basico/06_ambientes_virtuais_empacotamento.md",
        "order": 6
      },
      {
        "slug": "07-entrada-saida-cli",
        "title": "Entrada, Saída, CLI e Interação com Usuário",
        "file": "doc/Conteudos/Parte-1/Basico/07_entrada_saida_cli.md",
        "order": 7
      },
      {
        "slug": "08-arquivos-json-csv-persistencia",
        "title": "Arquivos, Caminhos, JSON, CSV e Persistência",
        "file": "doc/Conteudos/Parte-1/Basico/08_arquivos_json_csv_persistencia.md",
        "order": 8
      },
      {
        "slug": "09-modulos-imports-biblioteca-padrao",
        "title": "Módulos, Imports, Pacotes e Biblioteca Padrão",
        "file": "doc/Conteudos/Parte-1/Basico/09_modulos_imports_biblioteca_padrao.md",
        "order": 9
      },
      {
        "slug": "10-debugging-logs-diagnostico",
        "title": "Depuração, Logs, Erros e Diagnóstico",
        "file": "doc/Conteudos/Parte-1/Basico/10_debugging_logs_diagnostico.md",
        "order": 10
      },
      {
        "slug": "11-testes-basicos-pytest-qualidade",
        "title": "Testes Básicos, Assert, Pytest e Qualidade Inicial",
        "file": "doc/Conteudos/Parte-1/Basico/11_testes_basicos_pytest_qualidade.md",
        "order": 11
      },
      {
        "slug": "12-projeto-guiado-cli",
        "title": "Projeto Guiado: Aplicação de Linha de Comando",
        "file": "doc/Conteudos/Parte-1/Basico/12_projeto_guiado_cli.md",
        "order": 12
      },
      {
        "slug": "13-mapa-proficiencia-python",
        "title": "Mapa de Proficiência Python: Do Básico ao Profissional",
        "file": "doc/Conteudos/Parte-1/Basico/13_mapa_proficiencia_python.md",
        "order": 13
      },
      {
        "slug": "14-runtime-memoria-gil-gc",
        "title": "Runtime Python: GIL, Memória e Garbage Collection",
        "file": "doc/Conteudos/Parte-1/Basico/14_runtime_memoria_gil_gc.md",
        "order": 14
      },
      {
        "slug": "15-core-python-bibliotecas-builtin",
        "title": "Core Python e Bibliotecas Built-in",
        "file": "doc/Conteudos/Parte-1/Basico/15_core_python_bibliotecas_builtin.md",
        "order": 15
      }
    ]
  },
  {
    "slug": "parte-2-calculo-complete",
    "title": "Matemática para Programadores",
    "description": "Trilha completa e avançada de matemática para programação, ciência de dados, engenharia, finanças, simulação e computação científica com Python. O conteúdo parte de matemática básica e avança até cálculo multivariável, séries, equações dife",
    "part": 2,
    "partLabel": "Parte 2",
    "folder": "Calculo_complete",
    "area": "Matemática",
    "level": "intermediario",
    "category": "Matemática",
    "orderIndex": 2,
    "estimatedHours": 30,
    "lessons": [
      {
        "slug": "01-matematica-basica-01-matematica-basica-completa",
        "title": "Matemática Básica Completa com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/01-Matematica-Basica/01_matematica_basica_completa.md",
        "order": 1
      },
      {
        "slug": "02-algebra-funcoes-01-algebra-funcoes",
        "title": "Álgebra e Funções com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/02-Algebra-Funcoes/01_algebra_funcoes.md",
        "order": 2
      },
      {
        "slug": "03-geometria-trigonometria-01-geometria-trigonometria",
        "title": "Geometria e Trigonometria com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/03-Geometria-Trigonometria/01_geometria_trigonometria.md",
        "order": 3
      },
      {
        "slug": "04-limites-continuidade-01-limites-continuidade",
        "title": "Limites e Continuidade com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/04-Limites-Continuidade/01_limites_continuidade.md",
        "order": 4
      },
      {
        "slug": "05-calculo-1-derivadas-01-derivadas-calculo-1",
        "title": "Cálculo 1: Derivadas com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/05-Calculo-1-Derivadas/01_derivadas_calculo_1.md",
        "order": 5
      },
      {
        "slug": "06-calculo-1-integrais-01-integrais-calculo-1",
        "title": "Cálculo 1: Integrais com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/06-Calculo-1-Integrais/01_integrais_calculo_1.md",
        "order": 6
      },
      {
        "slug": "07-calculo-2-series-integrais-01-calculo-2-series-integrais",
        "title": "Cálculo 2: Séries e Integrais Avançadas com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/07-Calculo-2-Series-Integrais/01_calculo_2_series_integrais.md",
        "order": 7
      },
      {
        "slug": "08-calculo-3-multivariavel-01-calculo-3-multivariavel",
        "title": "Cálculo 3: Multivariável com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/08-Calculo-3-Multivariavel/01_calculo_3_multivariavel.md",
        "order": 8
      },
      {
        "slug": "09-algebra-linear-01-algebra-linear",
        "title": "Álgebra Linear com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/09-Algebra-Linear/01_algebra_linear.md",
        "order": 9
      },
      {
        "slug": "10-equacoes-diferenciais-01-equacoes-diferenciais",
        "title": "Equações Diferenciais com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/10-Equacoes-Diferenciais/01_equacoes_diferenciais.md",
        "order": 10
      },
      {
        "slug": "11-matematica-avancada-01-matematica-avancada",
        "title": "Matemática Avançada com Python",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/11-Matematica-Avancada/01_matematica_avancada.md",
        "order": 11
      },
      {
        "slug": "12-python-calculo-projetos-01-python-calculo-projetos",
        "title": "Python para Cálculo e Projetos",
        "file": "doc/Conteudos/Parte-2/Calculo_complete/12-Python-Calculo-Projetos/01_python_calculo_projetos.md",
        "order": 12
      }
    ]
  },
  {
    "slug": "parte-2-estruturas",
    "title": "Estruturas de Dados e Algoritmos",
    "description": "Trilha completa e progressiva para dominar estruturas de dados, algoritmos e fundamentos práticos de Python. O conteúdo começa com primeiro programa, tipos, operadores e execução no terminal, avança por coleções, funções, iteradores, módulo",
    "part": 2,
    "partLabel": "Parte 2",
    "folder": "Estruturas",
    "area": "Algoritmos",
    "level": "intermediario",
    "category": "Estruturas de Dados",
    "orderIndex": 3,
    "estimatedHours": 20,
    "lessons": [
      {
        "slug": "01-fundamentos-execucao-controle-fluxo",
        "title": "Fundamentos, Execução e Controle de Fluxo em Python",
        "file": "doc/Conteudos/Parte-2/Estruturas/01_fundamentos_execucao_controle_fluxo.md",
        "order": 1
      },
      {
        "slug": "02-colecoes-nativas",
        "title": "Coleções Nativas: Listas, Tuplas, Dicionários e Sets",
        "file": "doc/Conteudos/Parte-2/Estruturas/02_colecoes_nativas.md",
        "order": 2
      },
      {
        "slug": "03-funcoes-iteradores-generators",
        "title": "Funções, Lambda, Comprehensions, Iteradores e Generators",
        "file": "doc/Conteudos/Parte-2/Estruturas/03_funcoes_iteradores_generators.md",
        "order": 3
      },
      {
        "slug": "04-modulos-pacotes-main",
        "title": "Módulos, Pacotes, Imports e `if __name__ == \"__main__\"`",
        "file": "doc/Conteudos/Parte-2/Estruturas/04_modulos_pacotes_main.md",
        "order": 4
      },
      {
        "slug": "05-pilhas-filas-deques",
        "title": "Estruturas Lineares: Pilhas, Filas e Deques",
        "file": "doc/Conteudos/Parte-2/Estruturas/05_pilhas_filas_deques.md",
        "order": 5
      },
      {
        "slug": "06-hash-busca-ordenacao",
        "title": "Hash Tables, Busca Binária e Ordenação",
        "file": "doc/Conteudos/Parte-2/Estruturas/06_hash_busca_ordenacao.md",
        "order": 6
      },
      {
        "slug": "07-recursao-arvores-grafos",
        "title": "Recursão, Árvores e Grafos",
        "file": "doc/Conteudos/Parte-2/Estruturas/07_recursao_arvores_grafos.md",
        "order": 7
      },
      {
        "slug": "08-programacao-dinamica-estrategias",
        "title": "Programação Dinâmica e Estratégias Algorítmicas",
        "file": "doc/Conteudos/Parte-2/Estruturas/08_programacao_dinamica_estrategias.md",
        "order": 8
      }
    ]
  },
  {
    "slug": "parte-3-arquivos",
    "title": "Arquivos, Formatos e Serialização",
    "description": "Trilha completa e profissional para manipulação de arquivos em Python, cobrindo leitura/escrita, TXT, Markdown, CSV, JSON, XML, YAML, TOML, Pickle, Excel, Parquet, Avro, ORC, PDF, compressão, upload/download, streams, imagens e vídeos.",
    "part": 3,
    "partLabel": "Parte 3",
    "folder": "Arquivos",
    "area": "Persistência",
    "level": "intermediario",
    "category": "Arquivos",
    "orderIndex": 4,
    "estimatedHours": 18,
    "lessons": [
      {
        "slug": "01-fundamentos-paths-leitura-escrita",
        "title": "Fundamentos de Arquivos, Paths, Leitura e Escrita",
        "file": "doc/Conteudos/Parte-3/Arquivos/01_fundamentos_paths_leitura_escrita.md",
        "order": 1
      },
      {
        "slug": "02-formatos-texto-estruturados",
        "title": "TXT, CSV, JSON, XML, YAML e Pickle",
        "file": "doc/Conteudos/Parte-3/Arquivos/02_formatos_texto_estruturados.md",
        "order": 2
      },
      {
        "slug": "03-excel-pdfs",
        "title": "Manipulação de Excel e PDFs com Python",
        "file": "doc/Conteudos/Parte-3/Arquivos/03_excel_pdfs.md",
        "order": 3
      },
      {
        "slug": "04-compressao-upload-download-streams",
        "title": "Compressão, Upload, Download e Streams",
        "file": "doc/Conteudos/Parte-3/Arquivos/04_compressao_upload_download_streams.md",
        "order": 4
      },
      {
        "slug": "05-imagens-videos-binarios",
        "title": "Imagens, Vídeos e Arquivos Binários",
        "file": "doc/Conteudos/Parte-3/Arquivos/05_imagens_videos_binarios.md",
        "order": 5
      },
      {
        "slug": "06-boas-praticas-seguranca-performance-projetos",
        "title": "Boas Práticas, Segurança, Performance e Projetos com Arquivos",
        "file": "doc/Conteudos/Parte-3/Arquivos/06_boas_praticas_seguranca_performance_projetos.md",
        "order": 6
      },
      {
        "slug": "07-markdown-toml-colunares",
        "title": "Markdown, TOML, Parquet, Avro, ORC, PyArrow e Fastparquet",
        "file": "doc/Conteudos/Parte-3/Arquivos/07_markdown_toml_colunares.md",
        "order": 7
      }
    ]
  },
  {
    "slug": "parte-3-conceitos",
    "title": "Fundamentos de Banco de Dados",
    "description": "Trilha completa para dominar conceitos essenciais de bancos de dados relacionais: CRUD, joins, índices, transações, procedures, views, normalização e modelagem.",
    "part": 3,
    "partLabel": "Parte 3",
    "folder": "Conceitos",
    "area": "Banco de Dados",
    "level": "intermediario",
    "category": "Banco de Dados",
    "orderIndex": 5,
    "estimatedHours": 20,
    "lessons": [
      {
        "slug": "01-crud",
        "title": "CRUD: Create, Read, Update e Delete",
        "file": "doc/Conteudos/Parte-3/Conceitos/01_crud.md",
        "order": 1
      },
      {
        "slug": "02-joins",
        "title": "Joins: Relacionando Dados com SQL",
        "file": "doc/Conteudos/Parte-3/Conceitos/02_joins.md",
        "order": 2
      },
      {
        "slug": "03-indices",
        "title": "Índices: Performance, Estratégia e Armadilhas",
        "file": "doc/Conteudos/Parte-3/Conceitos/03_indices.md",
        "order": 3
      },
      {
        "slug": "04-transactions",
        "title": "Transactions: ACID, Concorrência e Consistência",
        "file": "doc/Conteudos/Parte-3/Conceitos/04_transactions.md",
        "order": 4
      },
      {
        "slug": "05-procedures",
        "title": "Procedures: Rotinas no Banco de Dados",
        "file": "doc/Conteudos/Parte-3/Conceitos/05_procedures.md",
        "order": 5
      },
      {
        "slug": "06-views",
        "title": "Views: Consultas Reutilizáveis e Camadas de Leitura",
        "file": "doc/Conteudos/Parte-3/Conceitos/06_views.md",
        "order": 6
      },
      {
        "slug": "07-normalizacao",
        "title": "Normalização: Integridade, Redundância e Formas Normais",
        "file": "doc/Conteudos/Parte-3/Conceitos/07_normalizacao.md",
        "order": 7
      },
      {
        "slug": "08-modelagem",
        "title": "Modelagem: Do Domínio ao Schema Profissional",
        "file": "doc/Conteudos/Parte-3/Conceitos/08_modelagem.md",
        "order": 8
      }
    ]
  },
  {
    "slug": "parte-4-oop",
    "title": "Programação Orientada a Objetos",
    "description": "Esta trilha consolida e expande os conteúdos de `poo_completo.md` e `poo_avancado.md`, adicionando os tópicos modernos de POO em Python: fundamentos, métodos mágicos, decorators, descriptors, protocols, metaclasses, SOLID, DDD, design patte",
    "part": 4,
    "partLabel": "Parte 4",
    "folder": "OOP",
    "area": "Engenharia de Software",
    "level": "intermediario",
    "category": "POO",
    "orderIndex": 6,
    "estimatedHours": 35,
    "lessons": [
      {
        "slug": "01-fundamentos-classes-objetos",
        "title": "Fundamentos, Classes, Objetos e Pilares da POO",
        "file": "doc/Conteudos/Parte-4/OOP/01_fundamentos_classes_objetos.md",
        "order": 1
      },
      {
        "slug": "02-relacionamentos-design-objetos",
        "title": "Relacionamentos, Coesão, Acoplamento e Design de Objetos",
        "file": "doc/Conteudos/Parte-4/OOP/02_relacionamentos_design_objetos.md",
        "order": 2
      },
      {
        "slug": "03-metodos-magicos-properties-dataclasses-slots",
        "title": "Métodos Mágicos, Properties, Dataclasses e Slots",
        "file": "doc/Conteudos/Parte-4/OOP/03_metodos_magicos_properties_dataclasses_slots.md",
        "order": 3
      },
      {
        "slug": "04-decorators-descriptors-context-metaclasses",
        "title": "Decorators, Descriptors, Context Managers, Iteradores e Metaclasses",
        "file": "doc/Conteudos/Parte-4/OOP/04_decorators_descriptors_context_metaclasses.md",
        "order": 4
      },
      {
        "slug": "05-abstracoes-protocols-mixins-mro",
        "title": "Abstrações Avançadas: ABC, Interfaces, Protocols, Duck Typing, Mixins e MRO",
        "file": "doc/Conteudos/Parte-4/OOP/05_abstracoes_protocols_mixins_mro.md",
        "order": 5
      },
      {
        "slug": "06-solid-ddd-patterns-arquitetura",
        "title": "SOLID, DDD, Design Patterns e Arquiteturas Modernas",
        "file": "doc/Conteudos/Parte-4/OOP/06_solid_ddd_patterns_arquitetura.md",
        "order": 6
      },
      {
        "slug": "07-persistencia-concorrencia-testes-performance",
        "title": "Persistência, ORM, Concorrência, Testes, Segurança e Performance em POO",
        "file": "doc/Conteudos/Parte-4/OOP/07_persistencia_concorrencia_testes_performance.md",
        "order": 7
      },
      {
        "slug": "08-ecossistema-tendencias-roadmap",
        "title": "Ecossistema Python Aplicado à POO, Tendências e Roadmap Completo",
        "file": "doc/Conteudos/Parte-4/OOP/08_ecossistema_tendencias_roadmap.md",
        "order": 8
      },
      {
        "slug": "09-matriz-cobertura-oop",
        "title": "Matriz de Cobertura dos Conceitos de POO",
        "file": "doc/Conteudos/Parte-4/OOP/09_matriz_cobertura_oop.md",
        "order": 9
      },
      {
        "slug": "10-patterns-hexagonal-cqrs",
        "title": "Design Patterns por Categoria, Hexagonal Architecture e CQRS",
        "file": "doc/Conteudos/Parte-4/OOP/10_patterns_hexagonal_cqrs.md",
        "order": 10
      },
      {
        "slug": "classes",
        "title": "Classes",
        "file": "doc/Conteudos/Parte-4/OOP/classes.md",
        "order": 11
      },
      {
        "slug": "dicas-dicas-poo",
        "title": "Dicas Completas de POO em Python",
        "file": "doc/Conteudos/Parte-4/OOP/dicas/dicas_poo.md",
        "order": 12
      },
      {
        "slug": "poo-avancado",
        "title": "POO Avançada em Python - Tópicos Não Vistos em Faculdade",
        "file": "doc/Conteudos/Parte-4/OOP/poo_avancado.md",
        "order": 13
      },
      {
        "slug": "poo-completo",
        "title": "Programação Orientada a Objetos (POO) em Python",
        "file": "doc/Conteudos/Parte-4/OOP/poo_completo.md",
        "order": 14
      }
    ]
  },
  {
    "slug": "parte-4-solid",
    "title": "SOLID e Design de Software",
    "description": "Trilha completa e avançada para dominar SOLID em Python, do básico de orientação a objetos até arquitetura limpa, ports and adapters, injeção de dependência, testes e refatoração profissional.",
    "part": 4,
    "partLabel": "Parte 4",
    "folder": "SOLID",
    "area": "Engenharia de Software",
    "level": "avancado",
    "category": "SOLID & Design",
    "orderIndex": 7,
    "estimatedHours": 18,
    "lessons": [
      {
        "slug": "01-fundamentos-oo-design-python",
        "title": "Fundamentos de OO, Tipagem e Design em Python",
        "file": "doc/Conteudos/Parte-4/SOLID/01_fundamentos_oo_design_python.md",
        "order": 1
      },
      {
        "slug": "02-srp-responsabilidade-unica",
        "title": "SRP: Single Responsibility Principle",
        "file": "doc/Conteudos/Parte-4/SOLID/02_srp_responsabilidade_unica.md",
        "order": 2
      },
      {
        "slug": "03-ocp-aberto-fechado",
        "title": "OCP: Open/Closed Principle",
        "file": "doc/Conteudos/Parte-4/SOLID/03_ocp_aberto_fechado.md",
        "order": 3
      },
      {
        "slug": "04-lsp-substituicao-liskov",
        "title": "LSP: Liskov Substitution Principle",
        "file": "doc/Conteudos/Parte-4/SOLID/04_lsp_substituicao_liskov.md",
        "order": 4
      },
      {
        "slug": "05-isp-segregacao-interfaces",
        "title": "ISP: Interface Segregation Principle",
        "file": "doc/Conteudos/Parte-4/SOLID/05_isp_segregacao_interfaces.md",
        "order": 5
      },
      {
        "slug": "06-dip-inversao-dependencia",
        "title": "DIP: Dependency Inversion Principle",
        "file": "doc/Conteudos/Parte-4/SOLID/06_dip_inversao_dependencia.md",
        "order": 6
      },
      {
        "slug": "07-solid-aplicado-arquitetura-testes",
        "title": "SOLID Aplicado: Arquitetura Limpa, Padrões, Testes e Refatoração",
        "file": "doc/Conteudos/Parte-4/SOLID/07_solid_aplicado_arquitetura_testes.md",
        "order": 7
      }
    ]
  },
  {
    "slug": "parte-5-async",
    "title": "Async, Concorrência e Mensageria",
    "description": "Trilha completa para dominar desenvolvimento assíncrono em Python, começando pelos fundamentos de concorrência e `async/await`, avançando para `asyncio`, `aiohttp`, `httpx`, drivers async de banco/cache, multithreading, multiprocessing, Cel",
    "part": 5,
    "partLabel": "Parte 5",
    "folder": "Async",
    "area": "Performance & Async",
    "level": "avancado",
    "category": "Async",
    "orderIndex": 8,
    "estimatedHours": 23,
    "lessons": [
      {
        "slug": "01-fundamentos-concorrencia-async-await",
        "title": "Fundamentos: Concorrência, Paralelismo e Async/Await",
        "file": "doc/Conteudos/Parte-5/Async/01_fundamentos_concorrencia_async_await.md",
        "order": 1
      },
      {
        "slug": "02-asyncio-em-profundidade",
        "title": "Asyncio em Profundidade",
        "file": "doc/Conteudos/Parte-5/Async/02_asyncio_em_profundidade.md",
        "order": 2
      },
      {
        "slug": "03-aiohttp-http-async",
        "title": "Aiohttp, Clientes HTTP e APIs Assíncronas",
        "file": "doc/Conteudos/Parte-5/Async/03_aiohttp_http_async.md",
        "order": 3
      },
      {
        "slug": "04-threads-processos-paralelismo",
        "title": "Multithreading, Multiprocessing e Execução Paralela",
        "file": "doc/Conteudos/Parte-5/Async/04_threads_processos_paralelismo.md",
        "order": 4
      },
      {
        "slug": "05-celery-rabbitmq-filas",
        "title": "Filas, Celery e RabbitMQ",
        "file": "doc/Conteudos/Parte-5/Async/05_celery_rabbitmq_filas.md",
        "order": 5
      },
      {
        "slug": "06-kafka-streaming-eventos",
        "title": "Kafka, Streaming e Sistemas Orientados a Eventos",
        "file": "doc/Conteudos/Parte-5/Async/06_kafka_streaming_eventos.md",
        "order": 6
      },
      {
        "slug": "07-arquitetura-performance-testes-producao",
        "title": "Arquitetura, Performance, Testes e Produção em Sistemas Assíncronos",
        "file": "doc/Conteudos/Parte-5/Async/07_arquitetura_performance_testes_producao.md",
        "order": 7
      },
      {
        "slug": "08-clientes-drivers-async",
        "title": "Clientes e Drivers Assíncronos: HTTPX, AsyncPG, Aiomysql e Redis",
        "file": "doc/Conteudos/Parte-5/Async/08_clientes_drivers_async.md",
        "order": 8
      },
      {
        "slug": "09-filas-agendadores",
        "title": "Filas Alternativas e Agendadores: RQ, Dramatiq, Arq, APScheduler, Schedule e Cron",
        "file": "doc/Conteudos/Parte-5/Async/09_filas_agendadores.md",
        "order": 9
      }
    ]
  },
  {
    "slug": "parte-5-bigo",
    "title": "Algoritmos, Big O e Performance",
    "description": "Esta trilha organiza o conteúdo de Big O por categorias profissionais. O arquivo original `01_conceitos_completo.md` foi mantido como referência monolítica, mas o estudo principal deve seguir os diretórios abaixo.",
    "part": 5,
    "partLabel": "Parte 5",
    "folder": "BigO",
    "area": "Performance & Async",
    "level": "avancado",
    "category": "Performance",
    "orderIndex": 9,
    "estimatedHours": 25,
    "lessons": [
      {
        "slug": "01-conceitos-completo",
        "title": "Big O em Profundidade: do Básico ao Avançado",
        "file": "doc/Conteudos/Parte-5/BigO/01_conceitos_completo.md",
        "order": 1
      },
      {
        "slug": "01-fundamentos-big-o",
        "title": "Fundamentos de Big O: Crescimento, Notações e Classes",
        "file": "doc/Conteudos/Parte-5/BigO/01_fundamentos_big_o.md",
        "order": 2
      },
      {
        "slug": "02-regras-loops-espaco",
        "title": "Análise Prática: Regras, Loops, Espaço e Casos",
        "file": "doc/Conteudos/Parte-5/BigO/02_regras_loops_espaco.md",
        "order": 3
      },
      {
        "slug": "03-python-estruturas",
        "title": "Python e Estruturas de Dados: Custos Reais e Escolhas",
        "file": "doc/Conteudos/Parte-5/BigO/03_python_estruturas.md",
        "order": 4
      },
      {
        "slug": "04-recursao-recorrencias",
        "title": "Recursão, Árvores de Recursão, Recorrências e Teorema Mestre",
        "file": "doc/Conteudos/Parte-5/BigO/04_recursao_recorrencias.md",
        "order": 5
      },
      {
        "slug": "05-algoritmos-classicos",
        "title": "Busca, Ordenação, Grafos, Strings, DP e Backtracking",
        "file": "doc/Conteudos/Parte-5/BigO/05_algoritmos_classicos.md",
        "order": 6
      },
      {
        "slug": "06-otimizacao-sistemas",
        "title": "Otimização Prática, Sistemas Reais, Cache, I/O e Gargalos",
        "file": "doc/Conteudos/Parte-5/BigO/06_otimizacao_sistemas.md",
        "order": 7
      },
      {
        "slug": "07-teoria-avancada",
        "title": "Rigor Matemático, Limites Inferiores, P, NP e Aproximação",
        "file": "doc/Conteudos/Parte-5/BigO/07_teoria_avancada.md",
        "order": 8
      },
      {
        "slug": "08-medicao-estudos",
        "title": "Profiling, Benchmark, Estudos de Caso e Exercícios",
        "file": "doc/Conteudos/Parte-5/BigO/08_medicao_estudos.md",
        "order": 9
      },
      {
        "slug": "09-estruturas-algoritmos-avancados",
        "title": "Estruturas e Algoritmos Avançados: Cobertura Profissional",
        "file": "doc/Conteudos/Parte-5/BigO/09_estruturas_algoritmos_avancados.md",
        "order": 10
      }
    ]
  },
  {
    "slug": "parte-6-automacao",
    "title": "Automação, Scraping e Bots",
    "description": "Trilha completa e profissional para criar automações com Python: tarefas locais, scripts, CLI, web scraping, bots, Selenium, Playwright, BeautifulSoup, Scrapy, automação desktop, planilhas e agendamentos com `cron` e `schedule`.",
    "part": 6,
    "partLabel": "Parte 6",
    "folder": "Automacao",
    "area": "Automação",
    "level": "intermediario",
    "category": "Automação",
    "orderIndex": 10,
    "estimatedHours": 28,
    "lessons": [
      {
        "slug": "01-automacao-tarefas-scripts",
        "title": "Automação de Tarefas e Scripts Profissionais",
        "file": "doc/Conteudos/Parte-6/Automacao/01_automacao_tarefas_scripts.md",
        "order": 1
      },
      {
        "slug": "02-web-scraping-profissional",
        "title": "Web Scraping Profissional",
        "file": "doc/Conteudos/Parte-6/Automacao/02_web_scraping_profissional.md",
        "order": 2
      },
      {
        "slug": "03-bots-python",
        "title": "Bots com Python",
        "file": "doc/Conteudos/Parte-6/Automacao/03_bots_python.md",
        "order": 3
      },
      {
        "slug": "04-selenium-rpa-web",
        "title": "Selenium: Navegadores, Testes e RPA Web",
        "file": "doc/Conteudos/Parte-6/Automacao/04_selenium_rpa_web.md",
        "order": 4
      },
      {
        "slug": "05-beautifulsoup-parsing",
        "title": "BeautifulSoup: Parsing HTML e Extração de Dados",
        "file": "doc/Conteudos/Parte-6/Automacao/05_beautifulsoup_parsing.md",
        "order": 5
      },
      {
        "slug": "06-scrapy-crawlers-pipelines",
        "title": "Scrapy: Crawlers Profissionais e Pipelines",
        "file": "doc/Conteudos/Parte-6/Automacao/06_scrapy_crawlers_pipelines.md",
        "order": 6
      },
      {
        "slug": "07-automacao-desktop-rpa",
        "title": "Automação Desktop e RPA Local",
        "file": "doc/Conteudos/Parte-6/Automacao/07_automacao_desktop_rpa.md",
        "order": 7
      },
      {
        "slug": "08-automacao-planilhas",
        "title": "Automação de Planilhas com Excel, CSV e Google Sheets",
        "file": "doc/Conteudos/Parte-6/Automacao/08_automacao_planilhas.md",
        "order": 8
      },
      {
        "slug": "09-agendamentos-cron-schedule",
        "title": "Agendamentos com cron, schedule, APScheduler e Produção",
        "file": "doc/Conteudos/Parte-6/Automacao/09_agendamentos_cron_schedule.md",
        "order": 9
      },
      {
        "slug": "10-cli-moderna-click-typer-rich-textual",
        "title": "CLI Moderna: argparse, Click, Typer, Rich e Textual",
        "file": "doc/Conteudos/Parte-6/Automacao/10_cli_moderna_click_typer_rich_textual.md",
        "order": 10
      },
      {
        "slug": "11-playwright-bots-desktop-sheets",
        "title": "Playwright, Bots, Desktop e Planilhas Avançadas",
        "file": "doc/Conteudos/Parte-6/Automacao/11_playwright_bots_desktop_sheets.md",
        "order": 11
      }
    ]
  },
  {
    "slug": "parte-6-excel",
    "title": "Excel e Planilhas com Python",
    "description": "Trilha completa e progressiva sobre Excel solo e Excel integrado com Python: fundamentos, fórmulas, funções, tabelas, validação, análise de dados, gráficos, dashboards, Power Query, automação, relatórios, pandas, openpyxl, XlsxWriter e proj",
    "part": 6,
    "partLabel": "Parte 6",
    "folder": "Excel",
    "area": "Automação",
    "level": "basico",
    "category": "Excel",
    "orderIndex": 11,
    "estimatedHours": 20,
    "lessons": [
      {
        "slug": "01-fundamentos-excel",
        "title": "Fundamentos de Excel: Pastas, Planilhas, Células, Formatos e Boas Práticas",
        "file": "doc/Conteudos/Parte-6/Excel/01_fundamentos_excel.md",
        "order": 1
      },
      {
        "slug": "02-formulas-funcoes",
        "title": "Fórmulas e Funções: Do Básico ao Avançado",
        "file": "doc/Conteudos/Parte-6/Excel/02_formulas_funcoes.md",
        "order": 2
      },
      {
        "slug": "03-dados-tabelas",
        "title": "Dados e Tabelas: Bases Limpas, Filtros, Validação e Tabelas Dinâmicas",
        "file": "doc/Conteudos/Parte-6/Excel/03_dados_tabelas.md",
        "order": 3
      },
      {
        "slug": "04-graficos-dashboards",
        "title": "Gráficos e Dashboards: Visualização, KPIs e Comunicação Executiva",
        "file": "doc/Conteudos/Parte-6/Excel/04_graficos_dashboards.md",
        "order": 4
      },
      {
        "slug": "05-power-query-modelagem",
        "title": "Power Query e Modelagem: ETL, Limpeza, Transformações e Modelo de Dados",
        "file": "doc/Conteudos/Parte-6/Excel/05_power_query_modelagem.md",
        "order": 5
      },
      {
        "slug": "06-python-excel",
        "title": "Python com Excel: pandas, openpyxl, XlsxWriter e Integração de Dados",
        "file": "doc/Conteudos/Parte-6/Excel/06_python_excel.md",
        "order": 6
      },
      {
        "slug": "07-automacao-relatorios",
        "title": "Automação de Relatórios: Templates, Agendamentos, E-mails e Qualidade",
        "file": "doc/Conteudos/Parte-6/Excel/07_automacao_relatorios.md",
        "order": 7
      },
      {
        "slug": "08-projetos-praticos",
        "title": "Projetos Excel + Python: Financeiro, Vendas, Estoque e Auditoria",
        "file": "doc/Conteudos/Parte-6/Excel/08_projetos_praticos.md",
        "order": 8
      }
    ]
  },
  {
    "slug": "parte-6-financas",
    "title": "Finanças com Python",
    "description": "Trilha completa e progressiva sobre financas aplicadas com Python: fundamentos financeiros, matematica financeira, contabilidade, indicadores, renda fixa, renda variavel, derivativos, risco, carteira, backtesting, automacao de dados e proje",
    "part": 6,
    "partLabel": "Parte 6",
    "folder": "Financas",
    "area": "Finanças",
    "level": "intermediario",
    "category": "Finanças",
    "orderIndex": 12,
    "estimatedHours": 23,
    "lessons": [
      {
        "slug": "01-fundamentos-financas",
        "title": "Fundamentos de Financas",
        "file": "doc/Conteudos/Parte-6/Financas/01_fundamentos_financas.md",
        "order": 1
      },
      {
        "slug": "02-calculo-financeiro",
        "title": "Calculo Financeiro",
        "file": "doc/Conteudos/Parte-6/Financas/02_calculo_financeiro.md",
        "order": 2
      },
      {
        "slug": "03-contabilidade-indicadores",
        "title": "Contabilidade e Indicadores Financeiros",
        "file": "doc/Conteudos/Parte-6/Financas/03_contabilidade_indicadores.md",
        "order": 3
      },
      {
        "slug": "04-renda-fixa",
        "title": "Investimentos e Renda Fixa",
        "file": "doc/Conteudos/Parte-6/Financas/04_renda_fixa.md",
        "order": 4
      },
      {
        "slug": "05-renda-variavel",
        "title": "Renda Variavel",
        "file": "doc/Conteudos/Parte-6/Financas/05_renda_variavel.md",
        "order": 5
      },
      {
        "slug": "06-derivativos-risco",
        "title": "Derivativos e Risco",
        "file": "doc/Conteudos/Parte-6/Financas/06_derivativos_risco.md",
        "order": 6
      },
      {
        "slug": "07-portfolio-backtesting",
        "title": "Portfolio e Backtesting",
        "file": "doc/Conteudos/Parte-6/Financas/07_portfolio_backtesting.md",
        "order": 7
      },
      {
        "slug": "08-python-para-financas",
        "title": "Python para Financas",
        "file": "doc/Conteudos/Parte-6/Financas/08_python_para_financas.md",
        "order": 8
      },
      {
        "slug": "09-projetos-praticos",
        "title": "Projetos Praticos de Financas com Python",
        "file": "doc/Conteudos/Parte-6/Financas/09_projetos_praticos.md",
        "order": 9
      }
    ]
  },
  {
    "slug": "parte-6-financas-quantitativas",
    "title": "Finanças Quantitativas",
    "description": "Trilha completa e profissional de financas quantitativas com Python: dados de mercado, retornos, estatistica, series temporais, risco, otimizacao de carteiras, backtesting, modelos fatoriais, renda fixa quantitativa, derivativos, execucao, ",
    "part": 6,
    "partLabel": "Parte 6",
    "folder": "Financas_quantitativas",
    "area": "Finanças",
    "level": "avancado",
    "category": "Finanças Quant",
    "orderIndex": 13,
    "estimatedHours": 30,
    "lessons": [
      {
        "slug": "01-fundamentos-financas-quantitativas",
        "title": "Fundamentos de Financas Quantitativas",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/01_fundamentos_financas_quantitativas.md",
        "order": 1
      },
      {
        "slug": "02-dados-mercado-retornos",
        "title": "Dados de Mercado, Retornos e Preparacao",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/02_dados_mercado_retornos.md",
        "order": 2
      },
      {
        "slug": "03-estatistica-financeira",
        "title": "Estatistica Aplicada a Mercados Financeiros",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/03_estatistica_financeira.md",
        "order": 3
      },
      {
        "slug": "04-series-temporais-financeiras",
        "title": "Series Temporais Financeiras",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/04_series_temporais_financeiras.md",
        "order": 4
      },
      {
        "slug": "05-risco-quantitativo",
        "title": "Risco Quantitativo: VaR, Expected Shortfall, Drawdown e Stress",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/05_risco_quantitativo.md",
        "order": 5
      },
      {
        "slug": "06-portfolio-otimizacao",
        "title": "Portfolio Quantitativo e Otimizacao",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/06_portfolio_otimizacao.md",
        "order": 6
      },
      {
        "slug": "07-backtesting-validacao",
        "title": "Backtesting Profissional e Validacao",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/07_backtesting_validacao.md",
        "order": 7
      },
      {
        "slug": "08-modelos-fatoriais-alphas",
        "title": "Modelos Fatoriais e Alphas",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/08_modelos_fatoriais_alphas.md",
        "order": 8
      },
      {
        "slug": "09-renda-fixa-quantitativa",
        "title": "Renda Fixa Quantitativa",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/09_renda_fixa_quantitativa.md",
        "order": 9
      },
      {
        "slug": "10-derivativos-volatilidade-precificacao",
        "title": "Derivativos, Volatilidade e Precificacao",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/10_derivativos_volatilidade_precificacao.md",
        "order": 10
      },
      {
        "slug": "11-execucao-custos-microestrutura",
        "title": "Execucao, Custos, Liquidez e Microestrutura",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/11_execucao_custos_microestrutura.md",
        "order": 11
      },
      {
        "slug": "12-projetos-quantitativos",
        "title": "Projetos Profissionais de Financas Quantitativas",
        "file": "doc/Conteudos/Parte-6/Financas_quantitativas/12_projetos_quantitativos.md",
        "order": 12
      }
    ]
  },
  {
    "slug": "parte-6-http",
    "title": "Redes, HTTP e Protocolos",
    "description": "Trilha completa e progressiva sobre redes e protocolos para Python: TCP/IP, sockets, HTTP/HTTPS, FTP, UDP e MQTT com IoT e Arduino.",
    "part": 6,
    "partLabel": "Parte 6",
    "folder": "HTTP",
    "area": "Redes",
    "level": "intermediario",
    "category": "Redes & HTTP",
    "orderIndex": 14,
    "estimatedHours": 15,
    "lessons": [
      {
        "slug": "01-tcp-ip-fundamentos",
        "title": "TCP/IP: Fundamentos de Redes, Portas, DNS e Pacotes",
        "file": "doc/Conteudos/Parte-6/HTTP/01_tcp_ip_fundamentos.md",
        "order": 1
      },
      {
        "slug": "02-sockets-python",
        "title": "Sockets em Python: TCP, Servidores, Clientes e Concorrência",
        "file": "doc/Conteudos/Parte-6/HTTP/02_sockets_python.md",
        "order": 2
      },
      {
        "slug": "03-http-https",
        "title": "HTTP/HTTPS: Protocolo Web, APIs, TLS e Clientes Python",
        "file": "doc/Conteudos/Parte-6/HTTP/03_http_https.md",
        "order": 3
      },
      {
        "slug": "04-ftp-sftp",
        "title": "FTP e SFTP: Transferência de Arquivos com Python",
        "file": "doc/Conteudos/Parte-6/HTTP/04_ftp_sftp.md",
        "order": 4
      },
      {
        "slug": "05-udp",
        "title": "UDP: Datagramas, Baixa Latência, Broadcast e Protocolos Simples",
        "file": "doc/Conteudos/Parte-6/HTTP/05_udp.md",
        "order": 5
      },
      {
        "slug": "06-mqtt-iot-arduino",
        "title": "MQTT, IoT e Arduino: Telemetria, Controle e Automação",
        "file": "doc/Conteudos/Parte-6/HTTP/06_mqtt_iot_arduino.md",
        "order": 6
      }
    ]
  },
  {
    "slug": "parte-6-python-doc",
    "title": "Documentação de Software",
    "description": "Trilha completa e progressiva sobre documentação em projetos Python: Sphinx, MkDocs e Swagger/OpenAPI.",
    "part": 6,
    "partLabel": "Parte 6",
    "folder": "Python-doc",
    "area": "Qualidade",
    "level": "intermediario",
    "category": "Documentação",
    "orderIndex": 15,
    "estimatedHours": 13,
    "lessons": [
      {
        "slug": "01-fundamentos-documentacao",
        "title": "Fundamentos de Documentação Técnica em Python",
        "file": "doc/Conteudos/Parte-6/Python-doc/01_fundamentos_documentacao.md",
        "order": 1
      },
      {
        "slug": "02-sphinx",
        "title": "Sphinx: Documentação Técnica, API Reference e Read the Docs",
        "file": "doc/Conteudos/Parte-6/Python-doc/02_sphinx.md",
        "order": 2
      },
      {
        "slug": "03-mkdocs",
        "title": "MkDocs: Portais de Documentação com Material for MkDocs",
        "file": "doc/Conteudos/Parte-6/Python-doc/03_mkdocs.md",
        "order": 3
      },
      {
        "slug": "04-swagger-openapi",
        "title": "Swagger/OpenAPI: Contratos de APIs, Schemas e Documentação Interativa",
        "file": "doc/Conteudos/Parte-6/Python-doc/04_swagger_openapi.md",
        "order": 4
      },
      {
        "slug": "05-workflow-docs-profissional",
        "title": "Workflow Profissional: Docs as Code, CI, Versionamento e Qualidade",
        "file": "doc/Conteudos/Parte-6/Python-doc/05_workflow_docs_profissional.md",
        "order": 5
      }
    ]
  },
  {
    "slug": "parte-6-test",
    "title": "Testes Automatizados",
    "description": "Trilha completa e progressiva para dominar testes em Python: Pytest, unit tests, integration tests, mocking, TDD, coverage e benchmark.",
    "part": 6,
    "partLabel": "Parte 6",
    "folder": "Test",
    "area": "Qualidade",
    "level": "intermediario",
    "category": "Testes",
    "orderIndex": 16,
    "estimatedHours": 18,
    "lessons": [
      {
        "slug": "01-pytest",
        "title": "Pytest: Fundamentos, Fixtures, Parametrização e Plugins",
        "file": "doc/Conteudos/Parte-6/Test/01_pytest.md",
        "order": 1
      },
      {
        "slug": "02-unit-tests",
        "title": "Unit Tests: Testes Unitários Profissionais",
        "file": "doc/Conteudos/Parte-6/Test/02_unit_tests.md",
        "order": 2
      },
      {
        "slug": "03-integration-tests",
        "title": "Integration Tests: Banco, APIs, Filas e Serviços Externos",
        "file": "doc/Conteudos/Parte-6/Test/03_integration_tests.md",
        "order": 3
      },
      {
        "slug": "04-mocking",
        "title": "Mocking: Mocks, Stubs, Fakes, Spies e Patches",
        "file": "doc/Conteudos/Parte-6/Test/04_mocking.md",
        "order": 4
      },
      {
        "slug": "05-tdd",
        "title": "TDD: Test-Driven Development em Python",
        "file": "doc/Conteudos/Parte-6/Test/05_tdd.md",
        "order": 5
      },
      {
        "slug": "06-coverage",
        "title": "Coverage: Cobertura, Qualidade e Métricas Úteis",
        "file": "doc/Conteudos/Parte-6/Test/06_coverage.md",
        "order": 6
      },
      {
        "slug": "07-benchmark",
        "title": "Benchmark: Performance, pytest-benchmark e Profiling",
        "file": "doc/Conteudos/Parte-6/Test/07_benchmark.md",
        "order": 7
      }
    ]
  },
  {
    "slug": "parte-6-code-quality",
    "title": "Qualidade de Código",
    "description": "Trilha completa e avançada sobre ferramentas de qualidade de código em Python: Black, Ruff, Flake8, isort e MyPy.",
    "part": 6,
    "partLabel": "Parte 6",
    "folder": "code-quality",
    "area": "Qualidade",
    "level": "intermediario",
    "category": "Qualidade",
    "orderIndex": 17,
    "estimatedHours": 18,
    "lessons": [
      {
        "slug": "01-fundamentos-qualidade-codigo",
        "title": "Fundamentos de Qualidade de Código em Python",
        "file": "doc/Conteudos/Parte-6/code-quality/01_fundamentos_qualidade_codigo.md",
        "order": 1
      },
      {
        "slug": "02-black",
        "title": "Black: Formatação Automática e Padronização",
        "file": "doc/Conteudos/Parte-6/code-quality/02_black.md",
        "order": 2
      },
      {
        "slug": "03-ruff",
        "title": "Ruff: Linter e Formatter Moderno de Alta Performance",
        "file": "doc/Conteudos/Parte-6/code-quality/03_ruff.md",
        "order": 3
      },
      {
        "slug": "04-flake8",
        "title": "Flake8: Linting Clássico e Ecossistema de Plugins",
        "file": "doc/Conteudos/Parte-6/code-quality/04_flake8.md",
        "order": 4
      },
      {
        "slug": "05-isort",
        "title": "isort: Organização Profissional de Imports",
        "file": "doc/Conteudos/Parte-6/code-quality/05_isort.md",
        "order": 5
      },
      {
        "slug": "06-mypy",
        "title": "MyPy: Tipagem Estática Profissional em Python",
        "file": "doc/Conteudos/Parte-6/code-quality/06_mypy.md",
        "order": 6
      },
      {
        "slug": "07-workflow-qualidade-ci",
        "title": "Workflow Profissional: pyproject, pre-commit e CI",
        "file": "doc/Conteudos/Parte-6/code-quality/07_workflow_qualidade_ci.md",
        "order": 7
      }
    ]
  },
  {
    "slug": "parte-7-api",
    "title": "APIs: REST, GraphQL, gRPC e WebSockets",
    "description": "Trilha completa e progressiva para construir APIs e backends profissionais com Python, cobrindo REST, GraphQL, WebSockets, gRPC e os frameworks Flask, FastAPI e Tornado.",
    "part": 7,
    "partLabel": "Parte 7",
    "folder": "API",
    "area": "Backend",
    "level": "avancado",
    "category": "APIs",
    "orderIndex": 18,
    "estimatedHours": 25,
    "lessons": [
      {
        "slug": "01-rest-apis",
        "title": "REST: Fundamentos, Design, Segurança e Produção",
        "file": "doc/Conteudos/Parte-7/API/01_rest_apis.md",
        "order": 1
      },
      {
        "slug": "02-graphql",
        "title": "GraphQL: Schema, Resolvers, Queries, Mutations e Performance",
        "file": "doc/Conteudos/Parte-7/API/02_graphql.md",
        "order": 2
      },
      {
        "slug": "03-websockets",
        "title": "WebSockets: Tempo Real, Conexões Persistentes e Escala",
        "file": "doc/Conteudos/Parte-7/API/03_websockets.md",
        "order": 3
      },
      {
        "slug": "04-grpc",
        "title": "gRPC: Contratos, Protobuf, Streaming e Microsserviços",
        "file": "doc/Conteudos/Parte-7/API/04_grpc.md",
        "order": 4
      },
      {
        "slug": "05-flask",
        "title": "Flask: Do Básico ao Backend Profissional",
        "file": "doc/Conteudos/Parte-7/API/05_flask.md",
        "order": 5
      },
      {
        "slug": "06-fastapi",
        "title": "FastAPI: APIs Modernas, Async, OpenAPI e Produção",
        "file": "doc/Conteudos/Parte-7/API/06_fastapi.md",
        "order": 6
      },
      {
        "slug": "07-tornado",
        "title": "Tornado: Async Web, WebSockets e Alta Concorrência",
        "file": "doc/Conteudos/Parte-7/API/07_tornado.md",
        "order": 7
      },
      {
        "slug": "08-conceitos-essenciais-apis",
        "title": "Conceitos Essenciais de APIs: Cliente, Servidor, HTTP, Endpoints e Contratos",
        "file": "doc/Conteudos/Parte-7/API/08_conceitos_essenciais_apis.md",
        "order": 8
      },
      {
        "slug": "09-http-methods-status-codes",
        "title": "Métodos HTTP e Status Codes: Semântica Correta para APIs REST",
        "file": "doc/Conteudos/Parte-7/API/09_http_methods_status_codes.md",
        "order": 9
      },
      {
        "slug": "10-escolha-framework-fastapi-flask",
        "title": "Escolha de Framework: FastAPI, Flask, ASGI, WSGI, Tipagem e OpenAPI",
        "file": "doc/Conteudos/Parte-7/API/10_escolha_framework_fastapi_flask.md",
        "order": 10
      }
    ]
  },
  {
    "slug": "parte-7-orm",
    "title": "ORMs e Bancos NoSQL",
    "description": "Trilha completa e profissional para trabalhar com ORMs relacionais e bancos NoSQL em Python. O foco é sair do uso básico até práticas avançadas de modelagem, consultas, performance, transações, migrações, integração com aplicações e operaçã",
    "part": 7,
    "partLabel": "Parte 7",
    "folder": "ORM",
    "area": "Banco de Dados",
    "level": "intermediario",
    "category": "ORM & NoSQL",
    "orderIndex": 19,
    "estimatedHours": 20,
    "lessons": [
      {
        "slug": "01-sqlalchemy",
        "title": "SQLAlchemy: Core, ORM, Sessions e Arquitetura",
        "file": "doc/Conteudos/Parte-7/ORM/01_sqlalchemy.md",
        "order": 1
      },
      {
        "slug": "02-django-orm",
        "title": "Django ORM: Models, QuerySets, Migrations e Performance",
        "file": "doc/Conteudos/Parte-7/ORM/02_django_orm.md",
        "order": 2
      },
      {
        "slug": "03-tortoise-orm",
        "title": "Tortoise ORM: Async ORM para APIs Modernas",
        "file": "doc/Conteudos/Parte-7/ORM/03_tortoise_orm.md",
        "order": 3
      },
      {
        "slug": "04-peewee",
        "title": "Peewee: ORM Leve, Simples e Poderoso",
        "file": "doc/Conteudos/Parte-7/ORM/04_peewee.md",
        "order": 4
      },
      {
        "slug": "05-mongodb",
        "title": "MongoDB: Documentos, Modelagem e PyMongo",
        "file": "doc/Conteudos/Parte-7/ORM/05_mongodb.md",
        "order": 5
      },
      {
        "slug": "06-redis",
        "title": "Redis: Cache, Filas, Locks e Estruturas em Memória",
        "file": "doc/Conteudos/Parte-7/ORM/06_redis.md",
        "order": 6
      },
      {
        "slug": "07-cassandra",
        "title": "Cassandra: Dados Distribuídos, Particionamento e Alta Escala",
        "file": "doc/Conteudos/Parte-7/ORM/07_cassandra.md",
        "order": 7
      },
      {
        "slug": "08-elasticsearch",
        "title": "Elasticsearch: Busca, Índices, Relevância e Observabilidade",
        "file": "doc/Conteudos/Parte-7/ORM/08_elasticsearch.md",
        "order": 8
      }
    ]
  },
  {
    "slug": "parte-7-sql",
    "title": "SQL e Bancos Relacionais",
    "description": "Esta trilha organiza o conteúdo de SQL por categorias profissionais. O arquivo original `01_sql.md` foi mantido como referência monolítica, mas o estudo principal deve seguir os diretórios abaixo.",
    "part": 7,
    "partLabel": "Parte 7",
    "folder": "SQL",
    "area": "Banco de Dados",
    "level": "intermediario",
    "category": "SQL",
    "orderIndex": 20,
    "estimatedHours": 20,
    "lessons": [
      {
        "slug": "00-sql",
        "title": "Python com MySQL, Excel e Docker: Do Básico ao Avançado 🗄️📊🐳",
        "file": "doc/Conteudos/Parte-7/SQL/00_sql.md",
        "order": 1
      },
      {
        "slug": "01-fundamentos-sql",
        "title": "Fundamentos SQL: DDL, DML, Consultas e Modelagem Inicial",
        "file": "doc/Conteudos/Parte-7/SQL/01_fundamentos_sql.md",
        "order": 2
      },
      {
        "slug": "02-consultas-avancadas",
        "title": "Consultas Avançadas: JOINs, Agregações, Subqueries e Índices",
        "file": "doc/Conteudos/Parte-7/SQL/02_consultas_avancadas.md",
        "order": 3
      },
      {
        "slug": "03-mysql-docker",
        "title": "MySQL com Docker: Ambiente Reprodutível e Operação Local",
        "file": "doc/Conteudos/Parte-7/SQL/03_mysql_docker.md",
        "order": 4
      },
      {
        "slug": "04-python-mysql",
        "title": "Conexão Python com MySQL: Drivers, SQLAlchemy e Segurança",
        "file": "doc/Conteudos/Parte-7/SQL/04_python_mysql.md",
        "order": 5
      },
      {
        "slug": "05-crud-transacoes",
        "title": "CRUD Profissional: Repositórios, Transações e Tratamento de Erros",
        "file": "doc/Conteudos/Parte-7/SQL/05_crud_transacoes.md",
        "order": 6
      },
      {
        "slug": "06-excel-integracao",
        "title": "Excel com Python e SQL: Importação, Exportação e Relatórios",
        "file": "doc/Conteudos/Parte-7/SQL/06_excel_integracao.md",
        "order": 7
      },
      {
        "slug": "07-arquitetura-projetos",
        "title": "Arquitetura Profissional: Camadas, Configuração e Projetos Práticos",
        "file": "doc/Conteudos/Parte-7/SQL/07_arquitetura_projetos.md",
        "order": 8
      }
    ]
  },
  {
    "slug": "parte-8-infra",
    "title": "Infraestrutura, CI/CD e Servidores",
    "description": "Trilha completa para dominar infraestrutura de aplicações Python: autenticação, middlewares, CORS, rate limiting, serialização, upload, background tasks, cache, logs, Linux, Nginx, Apache, Gunicorn, Uvicorn e CI/CD.",
    "part": 8,
    "partLabel": "Parte 8",
    "folder": "Infra",
    "area": "DevOps",
    "level": "avancado",
    "category": "Infraestrutura",
    "orderIndex": 21,
    "estimatedHours": 25,
    "lessons": [
      {
        "slug": "actions-01-github-actions",
        "title": "CI/CD com GitHub Actions",
        "file": "doc/Conteudos/Parte-8/Infra/Actions/01_github_actions.md",
        "order": 1
      },
      {
        "slug": "actions-02-gitlab-jenkins-pipelines",
        "title": "GitLab CI, Jenkins e Pipelines Profissionais",
        "file": "doc/Conteudos/Parte-8/Infra/Actions/02_gitlab_jenkins_pipelines.md",
        "order": 2
      },
      {
        "slug": "actions-03-deploy-versionamento-release",
        "title": "Deploy Automatizado, Versionamento, Build e Release",
        "file": "doc/Conteudos/Parte-8/Infra/Actions/03_deploy_versionamento_release.md",
        "order": 3
      },
      {
        "slug": "conceitos-01-autenticacao-jwt-oauth2",
        "title": "Autenticação JWT e OAuth2",
        "file": "doc/Conteudos/Parte-8/Infra/Conceitos/01_autenticacao_jwt_oauth2.md",
        "order": 4
      },
      {
        "slug": "conceitos-02-middlewares-cors-rate-limiting",
        "title": "Middlewares, CORS e Rate Limiting",
        "file": "doc/Conteudos/Parte-8/Infra/Conceitos/02_middlewares_cors_rate_limiting.md",
        "order": 5
      },
      {
        "slug": "conceitos-03-serializacao-upload-background-tasks",
        "title": "Serialização, Uploads e Background Tasks",
        "file": "doc/Conteudos/Parte-8/Infra/Conceitos/03_serializacao_upload_background_tasks.md",
        "order": 6
      },
      {
        "slug": "conceitos-04-cache-logs-observabilidade",
        "title": "Cache e Logs em Aplicações Python",
        "file": "doc/Conteudos/Parte-8/Infra/Conceitos/04_cache_logs_observabilidade.md",
        "order": 7
      },
      {
        "slug": "servidores-01-linux-python-deploy",
        "title": "Linux para Deploy de Aplicações Python",
        "file": "doc/Conteudos/Parte-8/Infra/Servidores/01_linux_python_deploy.md",
        "order": 8
      },
      {
        "slug": "servidores-02-nginx-apache-reverse-proxy",
        "title": "Nginx e Apache como Reverse Proxy",
        "file": "doc/Conteudos/Parte-8/Infra/Servidores/02_nginx_apache_reverse_proxy.md",
        "order": 9
      },
      {
        "slug": "servidores-03-gunicorn-uvicorn",
        "title": "Gunicorn e Uvicorn",
        "file": "doc/Conteudos/Parte-8/Infra/Servidores/03_gunicorn_uvicorn.md",
        "order": 10
      }
    ]
  },
  {
    "slug": "parte-8-iot",
    "title": "Internet das Coisas (IoT)",
    "description": "Trilha completa e progressiva sobre Internet das Coisas com Python: fundamentos, sensores, atuadores, microcontroladores, Raspberry Pi, MicroPython, MQTT, HTTP, gateways, APIs, bancos de dados, observabilidade, segurança, operação e projeto",
    "part": 8,
    "partLabel": "Parte 8",
    "folder": "IoT",
    "area": "IoT",
    "level": "avancado",
    "category": "IoT",
    "orderIndex": 22,
    "estimatedHours": 20,
    "lessons": [
      {
        "slug": "01-fundamentos-iot",
        "title": "Fundamentos de IoT: Arquitetura, Dispositivos, Telemetria e Edge",
        "file": "doc/Conteudos/Parte-8/IoT/01_fundamentos_iot.md",
        "order": 1
      },
      {
        "slug": "02-hardware-sensores",
        "title": "Hardware IoT: Sensores, Atuadores, GPIO, I2C, SPI e UART",
        "file": "doc/Conteudos/Parte-8/IoT/02_hardware_sensores.md",
        "order": 2
      },
      {
        "slug": "03-protocolos-iot",
        "title": "Protocolos IoT: MQTT, HTTP, WebSocket, CoAP e Redes",
        "file": "doc/Conteudos/Parte-8/IoT/03_protocolos_iot.md",
        "order": 3
      },
      {
        "slug": "04-python-embarcado",
        "title": "Python em Dispositivos: Raspberry Pi, MicroPython e CircuitPython",
        "file": "doc/Conteudos/Parte-8/IoT/04_python_embarcado.md",
        "order": 4
      },
      {
        "slug": "05-gateways-backends",
        "title": "Gateways e Backends IoT com Python: FastAPI, MQTT e Filas",
        "file": "doc/Conteudos/Parte-8/IoT/05_gateways_backends.md",
        "order": 5
      },
      {
        "slug": "06-dados-observabilidade",
        "title": "Dados IoT: Séries Temporais, Dashboards, Alertas e Observabilidade",
        "file": "doc/Conteudos/Parte-8/IoT/06_dados_observabilidade.md",
        "order": 6
      },
      {
        "slug": "07-seguranca-operacao",
        "title": "Segurança e Operação IoT: Identidade, TLS, OTA e Escala",
        "file": "doc/Conteudos/Parte-8/IoT/07_seguranca_operacao.md",
        "order": 7
      },
      {
        "slug": "08-projetos-praticos",
        "title": "Projetos IoT com Python: Estação Ambiental, Automação e Telemetria",
        "file": "doc/Conteudos/Parte-8/IoT/08_projetos_praticos.md",
        "order": 8
      }
    ]
  },
  {
    "slug": "parte-8-observabilidade",
    "title": "Observabilidade e Monitoramento",
    "description": "Trilha completa e progressiva sobre observabilidade para aplicações Python e sistemas backend: logging, monitoring, Prometheus, Grafana, OpenTelemetry e Sentry.",
    "part": 8,
    "partLabel": "Parte 8",
    "folder": "Observabilidade",
    "area": "DevOps",
    "level": "avancado",
    "category": "Observabilidade",
    "orderIndex": 23,
    "estimatedHours": 15,
    "lessons": [
      {
        "slug": "01-logging",
        "title": "Logging: Logs Estruturados, Contexto e Produção",
        "file": "doc/Conteudos/Parte-8/Observabilidade/01_logging.md",
        "order": 1
      },
      {
        "slug": "02-monitoring",
        "title": "Monitoring: Métricas, Alertas, SLOs e Operação",
        "file": "doc/Conteudos/Parte-8/Observabilidade/02_monitoring.md",
        "order": 2
      },
      {
        "slug": "03-prometheus",
        "title": "Prometheus: Coleta, PromQL, Alertas e Boas Práticas",
        "file": "doc/Conteudos/Parte-8/Observabilidade/03_prometheus.md",
        "order": 3
      },
      {
        "slug": "04-grafana",
        "title": "Grafana: Dashboards, Alertas e Análise Operacional",
        "file": "doc/Conteudos/Parte-8/Observabilidade/04_grafana.md",
        "order": 4
      },
      {
        "slug": "05-opentelemetry",
        "title": "OpenTelemetry: Traces, Métricas, Logs e Instrumentação",
        "file": "doc/Conteudos/Parte-8/Observabilidade/05_opentelemetry.md",
        "order": 5
      },
      {
        "slug": "06-sentry",
        "title": "Sentry: Erros, Performance, Releases e Diagnóstico",
        "file": "doc/Conteudos/Parte-8/Observabilidade/06_sentry.md",
        "order": 6
      }
    ]
  },
  {
    "slug": "parte-8-productions",
    "title": "Deploy e Produção",
    "description": "Trilha completa e progressiva sobre colocar aplicações Python em produção: VPS, Docker Deploy, Kubernetes Deploy, Serverless, CI/CD pipelines, balanceamento de carga, escalabilidade e reverse proxy.",
    "part": 8,
    "partLabel": "Parte 8",
    "folder": "Productions",
    "area": "DevOps",
    "level": "avancado",
    "category": "Produção",
    "orderIndex": 24,
    "estimatedHours": 20,
    "lessons": [
      {
        "slug": "01-vps",
        "title": "VPS: Deploy Profissional em Servidores Linux",
        "file": "doc/Conteudos/Parte-8/Productions/01_vps.md",
        "order": 1
      },
      {
        "slug": "02-docker-deploy",
        "title": "Docker Deploy: Imagens, Containers e Entrega em Produção",
        "file": "doc/Conteudos/Parte-8/Productions/02_docker_deploy.md",
        "order": 2
      },
      {
        "slug": "03-kubernetes-deploy",
        "title": "Kubernetes Deploy: Manifests, Rollouts e Operação",
        "file": "doc/Conteudos/Parte-8/Productions/03_kubernetes_deploy.md",
        "order": 3
      },
      {
        "slug": "04-serverless",
        "title": "Serverless: Funções, Containers Gerenciados e Trade-offs",
        "file": "doc/Conteudos/Parte-8/Productions/04_serverless.md",
        "order": 4
      },
      {
        "slug": "05-ci-cd-pipelines",
        "title": "CI/CD Pipelines: Build, Teste, Release e Deploy Automatizado",
        "file": "doc/Conteudos/Parte-8/Productions/05_ci_cd_pipelines.md",
        "order": 5
      },
      {
        "slug": "06-balanceamento-carga",
        "title": "Balanceamento de Carga: Distribuição, Saúde e Alta Disponibilidade",
        "file": "doc/Conteudos/Parte-8/Productions/06_balanceamento_carga.md",
        "order": 6
      },
      {
        "slug": "07-escalabilidade",
        "title": "Escalabilidade: Capacidade, Gargalos e Arquitetura de Crescimento",
        "file": "doc/Conteudos/Parte-8/Productions/07_escalabilidade.md",
        "order": 7
      },
      {
        "slug": "08-reverse-proxy",
        "title": "Reverse Proxy: Nginx, TLS, Roteamento e Segurança",
        "file": "doc/Conteudos/Parte-8/Productions/08_reverse_proxy.md",
        "order": 8
      }
    ]
  },
  {
    "slug": "parte-9-data-science",
    "title": "Data Science e Engenharia de Dados",
    "description": "Trilha completa e progressiva para dominar Ciência de Dados, Análise de Dados e Engenharia de Dados com Python. Esta organização expande e reorganiza o conteúdo de data_science.md, mantendo o arquivo original como guia geral e criando arqui",
    "part": 9,
    "partLabel": "Parte 9",
    "folder": "Data_science",
    "area": "Data Science",
    "level": "intermediario",
    "category": "Data Science",
    "orderIndex": 25,
    "estimatedHours": 28,
    "lessons": [
      {
        "slug": "01-fundamentos-ambiente-fluxo",
        "title": "Fundamentos, Ambiente e Fluxo de Trabalho em Dados",
        "file": "doc/Conteudos/Parte-9/Data_science/01_fundamentos_ambiente_fluxo.md",
        "order": 1
      },
      {
        "slug": "02-numpy-scipy-computacao-cientifica",
        "title": "NumPy, SciPy e Computação Científica",
        "file": "doc/Conteudos/Parte-9/Data_science/02_numpy_scipy_computacao_cientifica.md",
        "order": 2
      },
      {
        "slug": "03-pandas-data-wrangling-limpeza",
        "title": "Pandas, Data Wrangling e Limpeza de Dados",
        "file": "doc/Conteudos/Parte-9/Data_science/03_pandas_data_wrangling_limpeza.md",
        "order": 3
      },
      {
        "slug": "04-polars-performance-dados-maiores",
        "title": "Polars, Performance e Dados Maiores",
        "file": "doc/Conteudos/Parte-9/Data_science/04_polars_performance_dados_maiores.md",
        "order": 4
      },
      {
        "slug": "05-estatistica-eda-analise",
        "title": "Estatística, EDA e Análise Exploratória",
        "file": "doc/Conteudos/Parte-9/Data_science/05_estatistica_eda_analise.md",
        "order": 5
      },
      {
        "slug": "06-visualizacao-dashboards",
        "title": "Visualização: Matplotlib, Seaborn, Plotly, Bokeh e Dashboards",
        "file": "doc/Conteudos/Parte-9/Data_science/06_visualizacao_dashboards.md",
        "order": 6
      },
      {
        "slug": "07-etl-qualidade-pipelines-engenharia",
        "title": "ETL, ELT, Qualidade, Pipelines e Engenharia de Dados",
        "file": "doc/Conteudos/Parte-9/Data_science/07_etl_qualidade_pipelines_engenharia.md",
        "order": 7
      },
      {
        "slug": "08-dashboards-storytelling-projetos-roadmap",
        "title": "Dashboards, Storytelling, Projetos e Roadmap de Especialista",
        "file": "doc/Conteudos/Parte-9/Data_science/08_dashboards_storytelling_projetos_roadmap.md",
        "order": 8
      },
      {
        "slug": "09-ecossistema-analytics-bibliotecas",
        "title": "Ecossistema Analytics: Bibliotecas, Estatística, Excel, Dashboards e Qualidade",
        "file": "doc/Conteudos/Parte-9/Data_science/09_ecossistema_analytics_bibliotecas.md",
        "order": 9
      },
      {
        "slug": "10-big-data-streaming-orquestracao-lakehouse",
        "title": "Big Data, Streaming, Orquestração, Cloud Warehouses e Lakehouse",
        "file": "doc/Conteudos/Parte-9/Data_science/10_big_data_streaming_orquestracao_lakehouse.md",
        "order": 10
      },
      {
        "slug": "data-science",
        "title": "Data Science e Engenharia de Dados com Python",
        "file": "doc/Conteudos/Parte-9/Data_science/data_science.md",
        "order": 11
      }
    ]
  },
  {
    "slug": "parte-10-bioinformatica",
    "title": "Bioinformática com Python",
    "description": "Trilha completa e profunda sobre bioinformática usando Python. O objetivo é conectar biologia molecular, estatística, programação, análise de sequências, genômica, transcriptômica, variantes, filogenia, proteômica, bancos biológicos, pipeli",
    "part": 10,
    "partLabel": "Parte 10",
    "folder": "Bioinformática",
    "area": "Especializações",
    "level": "avancado",
    "category": "Bioinformática",
    "orderIndex": 26,
    "estimatedHours": 30,
    "lessons": [
      {
        "slug": "01-fundamentos-bioinformatica-biologia-molecular",
        "title": "Fundamentos de Bioinformática e Biologia Molecular",
        "file": "doc/Conteudos/Parte-10/Bioinformática/01_fundamentos_bioinformatica_biologia_molecular.md",
        "order": 1
      },
      {
        "slug": "02-ambiente-python-bioinformatica",
        "title": "Ambiente Python, Bibliotecas e Organização de Projetos",
        "file": "doc/Conteudos/Parte-10/Bioinformática/02_ambiente_python_bioinformatica.md",
        "order": 2
      },
      {
        "slug": "03-formatos-biologicos",
        "title": "Formatos Biológicos: FASTA, FASTQ, SAM/BAM, VCF, GFF/GTF e BED",
        "file": "doc/Conteudos/Parte-10/Bioinformática/03_formatos_biologicos.md",
        "order": 3
      },
      {
        "slug": "04-biopython-sequencias",
        "title": "Biopython e Manipulação de Sequências",
        "file": "doc/Conteudos/Parte-10/Bioinformática/04_biopython_sequencias.md",
        "order": 4
      },
      {
        "slug": "05-qualidade-preprocessamento-ngs",
        "title": "Controle de Qualidade e Pré-processamento de Dados NGS",
        "file": "doc/Conteudos/Parte-10/Bioinformática/05_qualidade_preprocessamento_ngs.md",
        "order": 5
      },
      {
        "slug": "06-alinhamento-mapeamento-blast",
        "title": "Alinhamento, Mapeamento e Busca de Similaridade",
        "file": "doc/Conteudos/Parte-10/Bioinformática/06_alinhamento_mapeamento_blast.md",
        "order": 6
      },
      {
        "slug": "07-genomica-anotacao-variantes",
        "title": "Genômica, Anotação e Análise de Variantes",
        "file": "doc/Conteudos/Parte-10/Bioinformática/07_genomica_anotacao_variantes.md",
        "order": 7
      },
      {
        "slug": "08-transcriptomica-rnaseq",
        "title": "Transcriptômica, RNA-seq e Expressão Gênica",
        "file": "doc/Conteudos/Parte-10/Bioinformática/08_transcriptomica_rnaseq.md",
        "order": 8
      },
      {
        "slug": "09-filogenia-evolucao-comparativa",
        "title": "Filogenia, Evolução Molecular e Comparação de Genomas",
        "file": "doc/Conteudos/Parte-10/Bioinformática/09_filogenia_evolucao_comparativa.md",
        "order": 9
      },
      {
        "slug": "10-proteomica-estruturas-proteinas",
        "title": "Proteômica, Estruturas, Motivos e Análise de Proteínas",
        "file": "doc/Conteudos/Parte-10/Bioinformática/10_proteomica_estruturas_proteinas.md",
        "order": 10
      },
      {
        "slug": "11-bancos-dados-apis-reprodutibilidade",
        "title": "Bancos de Dados Biológicos, APIs e Reprodutibilidade",
        "file": "doc/Conteudos/Parte-10/Bioinformática/11_bancos_dados_apis_reprodutibilidade.md",
        "order": 11
      },
      {
        "slug": "12-pipelines-projetos-bioinformatica",
        "title": "Pipelines e Projetos Profissionais de Bioinformática",
        "file": "doc/Conteudos/Parte-10/Bioinformática/12_pipelines_projetos_bioinformatica.md",
        "order": 12
      }
    ]
  },
  {
    "slug": "parte-10-cyber-sec",
    "title": "Cibersegurança com Python",
    "description": "Trilha completa e progressiva sobre segurança para aplicações Python, APIs e backends: validação de entrada, secrets, criptografia, hashing, segurança em APIs, OAuth2, OpenID Connect, RBAC, ABAC, proteção contra SQL Injection, XSS, CSRF, au",
    "part": 10,
    "partLabel": "Parte 10",
    "folder": "Cyber-sec",
    "area": "Segurança",
    "level": "avancado",
    "category": "Segurança",
    "orderIndex": 27,
    "estimatedHours": 23,
    "lessons": [
      {
        "slug": "01-criptografia",
        "title": "Criptografia: Conceitos, Chaves, TLS e Uso Seguro em Python",
        "file": "doc/Conteudos/Parte-10/Cyber-sec/01_criptografia.md",
        "order": 1
      },
      {
        "slug": "02-hashing-senhas-integridade",
        "title": "Hashing: Senhas, Integridade, HMAC e Armazenamento Seguro",
        "file": "doc/Conteudos/Parte-10/Cyber-sec/02_hashing_senhas_integridade.md",
        "order": 2
      },
      {
        "slug": "03-seguranca-apis-autenticacao",
        "title": "Segurança em APIs e Autenticação",
        "file": "doc/Conteudos/Parte-10/Cyber-sec/03_seguranca_apis_autenticacao.md",
        "order": 3
      },
      {
        "slug": "04-sql-injection",
        "title": "Proteção contra SQL Injection",
        "file": "doc/Conteudos/Parte-10/Cyber-sec/04_sql_injection.md",
        "order": 4
      },
      {
        "slug": "05-xss",
        "title": "XSS: Cross-Site Scripting",
        "file": "doc/Conteudos/Parte-10/Cyber-sec/05_xss.md",
        "order": 5
      },
      {
        "slug": "06-csrf",
        "title": "CSRF: Cross-Site Request Forgery",
        "file": "doc/Conteudos/Parte-10/Cyber-sec/06_csrf.md",
        "order": 6
      },
      {
        "slug": "07-owasp",
        "title": "OWASP: Riscos, Controles e Checklist Profissional",
        "file": "doc/Conteudos/Parte-10/Cyber-sec/07_owasp.md",
        "order": 7
      },
      {
        "slug": "08-identidade-autorizacao-jwt",
        "title": "Identidade, Autorização, OAuth2, OpenID Connect e JWT",
        "file": "doc/Conteudos/Parte-10/Cyber-sec/08_identidade_autorizacao_jwt.md",
        "order": 8
      },
      {
        "slug": "09-validacao-secrets-ferramentas-sast",
        "title": "Validação, Secrets, Variáveis de Ambiente e Ferramentas de Segurança",
        "file": "doc/Conteudos/Parte-10/Cyber-sec/09_validacao_secrets_ferramentas_sast.md",
        "order": 9
      }
    ]
  },
  {
    "slug": "parte-10-devops",
    "title": "DevOps Avançado",
    "description": "Trilha completa e progressiva sobre containers e orquestração para aplicações Python, cobrindo Docker, Docker Compose e Kubernetes.",
    "part": 10,
    "partLabel": "Parte 10",
    "folder": "DevOPS",
    "area": "DevOps",
    "level": "avancado",
    "category": "DevOps",
    "orderIndex": 28,
    "estimatedHours": 8,
    "lessons": [
      {
        "slug": "01-docker-python",
        "title": "Docker com Python: Imagens, Containers, Segurança e Produção",
        "file": "doc/Conteudos/Parte-10/DevOPS/01_docker_python.md",
        "order": 1
      },
      {
        "slug": "02-docker-compose-python",
        "title": "Docker Compose com Python: Ambientes Locais, Serviços e Integração",
        "file": "doc/Conteudos/Parte-10/DevOPS/02_docker_compose_python.md",
        "order": 2
      },
      {
        "slug": "03-kubernetes-python",
        "title": "Kubernetes com Python: Deploy, Escala, Configuração e Operação",
        "file": "doc/Conteudos/Parte-10/DevOPS/03_kubernetes_python.md",
        "order": 3
      }
    ]
  },
  {
    "slug": "parte-10-engenharia",
    "title": "Arquitetura de Software",
    "description": "Trilha completa e progressiva sobre arquitetura de software para aplicações Python e sistemas backend: MVC, MVVM, microsserviços, monolitos, DDD, arquitetura orientada a eventos e arquitetura hexagonal.",
    "part": 10,
    "partLabel": "Parte 10",
    "folder": "Engenharia",
    "area": "Arquitetura",
    "level": "avancado",
    "category": "Arquitetura",
    "orderIndex": 29,
    "estimatedHours": 18,
    "lessons": [
      {
        "slug": "01-mvc",
        "title": "MVC: Model-View-Controller na Prática",
        "file": "doc/Conteudos/Parte-10/Engenharia/01_mvc.md",
        "order": 1
      },
      {
        "slug": "02-mvvm",
        "title": "MVVM: Model-View-ViewModel e Separação de Estado",
        "file": "doc/Conteudos/Parte-10/Engenharia/02_mvvm.md",
        "order": 2
      },
      {
        "slug": "03-microsservicos",
        "title": "Microsserviços: Arquitetura Distribuída, Operação e Trade-offs",
        "file": "doc/Conteudos/Parte-10/Engenharia/03_microsservicos.md",
        "order": 3
      },
      {
        "slug": "04-monolitos",
        "title": "Monolitos: Arquitetura Modular, Escalabilidade e Evolução",
        "file": "doc/Conteudos/Parte-10/Engenharia/04_monolitos.md",
        "order": 4
      },
      {
        "slug": "05-ddd",
        "title": "DDD: Domain-Driven Design do Básico ao Avançado",
        "file": "doc/Conteudos/Parte-10/Engenharia/05_ddd.md",
        "order": 5
      },
      {
        "slug": "06-event-driven-architecture",
        "title": "Event-Driven Architecture: Eventos, Mensageria e Consistência",
        "file": "doc/Conteudos/Parte-10/Engenharia/06_event_driven_architecture.md",
        "order": 6
      },
      {
        "slug": "07-hexagonal-architecture",
        "title": "Hexagonal Architecture: Ports, Adapters e Domínio Protegido",
        "file": "doc/Conteudos/Parte-10/Engenharia/07_hexagonal_architecture.md",
        "order": 7
      }
    ]
  },
  {
    "slug": "parte-10-sistemas-embarcados",
    "title": "Sistemas Embarcados",
    "description": "Trilha completa e profissional sobre sistemas embarcados usando Python, MicroPython, CircuitPython e Linux embarcado. O objetivo e conectar fundamentos de hardware, eletronica, firmware, comunicacao, sensores, atuadores, tempo real, IoT, se",
    "part": 10,
    "partLabel": "Parte 10",
    "folder": "Sistemas_embarcados",
    "area": "IoT",
    "level": "avancado",
    "category": "Embarcados",
    "orderIndex": 30,
    "estimatedHours": 28,
    "lessons": [
      {
        "slug": "01-fundamentos-sistemas-embarcados",
        "title": "Fundamentos de Sistemas Embarcados",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/01_fundamentos_sistemas_embarcados.md",
        "order": 1
      },
      {
        "slug": "02-hardware-eletronica-arquitetura",
        "title": "Hardware, Eletronica Basica e Arquitetura",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/02_hardware_eletronica_arquitetura.md",
        "order": 2
      },
      {
        "slug": "03-micropython-circuitpython-placas",
        "title": "MicroPython, CircuitPython e Placas",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/03_micropython_circuitpython_placas.md",
        "order": 3
      },
      {
        "slug": "04-gpio-sensores-atuadores",
        "title": "GPIO, Sensores e Atuadores",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/04_gpio_sensores_atuadores.md",
        "order": 4
      },
      {
        "slug": "05-protocolos-embarcados",
        "title": "Protocolos: UART, I2C, SPI, PWM, ADC e CAN",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/05_protocolos_embarcados.md",
        "order": 5
      },
      {
        "slug": "06-tempo-real-concorrencia-baixo-consumo",
        "title": "Tempo Real, Concorrencia, Interrupcoes e Baixo Consumo",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/06_tempo_real_concorrencia_baixo_consumo.md",
        "order": 6
      },
      {
        "slug": "07-iot-redes-mqtt-http-edge",
        "title": "IoT, Redes, MQTT, HTTP e Edge Computing",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/07_iot_redes_mqtt_http_edge.md",
        "order": 7
      },
      {
        "slug": "08-linux-embarcado-python",
        "title": "Linux Embarcado com Python",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/08_linux_embarcado_python.md",
        "order": 8
      },
      {
        "slug": "09-seguranca-confiabilidade-operacao",
        "title": "Seguranca, Confiabilidade e Operacao",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/09_seguranca_confiabilidade_operacao.md",
        "order": 9
      },
      {
        "slug": "10-testes-debug-qualidade-embarcados",
        "title": "Testes, Debug, Simulacao e Qualidade",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/10_testes_debug_qualidade_embarcados.md",
        "order": 10
      },
      {
        "slug": "11-projetos-praticos-embarcados",
        "title": "Projetos Praticos de Sistemas Embarcados com Python",
        "file": "doc/Conteudos/Parte-10/Sistemas_embarcados/11_projetos_praticos_embarcados.md",
        "order": 11
      }
    ]
  }
];

export const MODULE_BY_SLUG: Record<string, ContentModule> = Object.fromEntries(
  MODULES.map((m) => [m.slug, m]),
);
