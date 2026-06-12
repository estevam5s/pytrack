Classe: Estrutura que armazena trechos de codigo relacionado entre si.
Instancia: Referencia ao nome da classe que nos permite acessar seus codigos internos.
Objeto: Variavel que recebera como valor uma instancia.
Atributo: Variavel declarada no escopo global da classe.
Metodo: Funcao nativa do Python que nao possui retorno declarado dentro de uma classe.
Funcao: Funcao nativa do Python que retorna um valor declarada dentro de uma classe.
Excecao: Controla o fluxo de execucao por meio de um erro.
Mensagem: Chamada a um atributo, metodo ou funcao.
Recursao: Metodo que invoca ele mesmo.
Abstracao: Acao de se utilizar mensagens para acessar recursos de um classe.
Associacao: Classe que herda atributos, metodos e/ou funcoes de outra classe.
Encapsulamento: Niveis de permissao de acesso a determinados atributos, metodos e/ou funcoes.
Sobreposicao: Classe herdeira que sobrescreve atributos, metodos e/ou funcoes que ja existiam com o mesmo nome em um classe herdada.
Polimorfismo: Capacidade de escolher entre os atributos, metodos e/ou funcoes que sobrescreveram ou os que foram sobrescritos.
Sobrecarga: Metodos ou funcoes que irao executar codigos diferentes a depender da quantidade ou tipo de parametro passado como argumento na chamada.
Interface: Uma ou mais declaracoes sem implementacao que deverao ser implementadas por uma classe herdeira.
Modulo: Arquivo de codificacao com uma ou mais classes relacionadas entre si que podera ser importado por outro arquivo.
Pacote: Diretorio com um ou mais modulos relacionados entre si.

---

## Complemento: Definicoes mais precisas em Python

As definicoes acima registram uma visao inicial. Em Python, para evitar confusoes importantes, use tambem estas definicoes:

Classe: molde que define estado e comportamento de objetos.

Instancia: objeto concreto criado a partir de uma classe.

Objeto: valor em memoria com identidade, tipo e estado. Em Python, praticamente tudo e objeto.

Atributo: nome associado a um valor em um objeto ou em uma classe.

Metodo: funcao definida em uma classe que normalmente recebe a instancia como primeiro parametro (`self`).

Funcao: bloco chamavel definido com `def` ou equivalente. Quando esta dentro de uma classe e e acessado pela instancia, comporta-se como metodo.

Associacao: relacao em que um objeto conhece ou usa outro, sem necessariamente controlar seu ciclo de vida.

Agregacao: relacao "tem um" em que as partes podem existir independentemente do todo.

Composicao: relacao "tem um" forte em que o objeto composto cria ou controla as partes.

Heranca: relacao "e um", em que uma classe especializa outra.

Encapsulamento: tecnica de proteger invariantes e expor uma API clara, usando convencoes como atributos publicos, `_internos`, properties e metodos.

Abstracao: selecao do que importa para o usuario da classe, escondendo detalhes internos.

Polimorfismo: capacidade de usar objetos diferentes pela mesma interface ou comportamento esperado.

Sobrescrita: redefinicao de um metodo da classe base em uma subclasse.

Sobrecarga: em Python, normalmente e representada por argumentos opcionais, `*args`, `@singledispatch`, type hints ou despacho manual, nao por multiplos metodos com o mesmo nome.
