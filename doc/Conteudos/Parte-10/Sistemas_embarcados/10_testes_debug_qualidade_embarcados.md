# Testes, Debug, Simulacao e Qualidade

Testar sistemas embarcados e mais dificil porque ha hardware, tempo, sinais eletricos, ambiente fisico e comunicacao. Ainda assim, projetos profissionais precisam de testes em camadas.

---

## Camadas de Teste

- teste de funcao pura;
- teste de driver com mock;
- teste em hardware real;
- teste de integracao;
- teste de comunicacao;
- teste de energia;
- teste de longa duracao;
- teste de falha;
- teste de atualizacao.

---

## Separando Logica de Hardware

Codigo dificil de testar:

```python
def controlar():
    valor = adc.read()
    if valor > 1000:
        rele.value(1)
```

Melhor:

```python
def deve_ligar(valor, limite):
    return valor > limite
```

Agora a regra pode ser testada em CPython.

---

## Testes com Pytest

```python
def deve_ligar(valor, limite):
    return valor > limite


def test_deve_ligar():
    assert deve_ligar(1200, 1000) is True
    assert deve_ligar(800, 1000) is False
```

---

## Mock de Driver

```python
class SensorFake:
    def __init__(self, valor):
        self.valor = valor

    def ler(self):
        return self.valor


def ler_temperatura(sensor):
    return sensor.ler()
```

Mocks permitem testar regra sem hardware conectado.

---

## Debug Serial

O console serial e ferramenta essencial.

Boas praticas:

- mensagens curtas;
- incluir estado;
- incluir erros;
- nao imprimir em loop muito rapido;
- permitir nivel de log;
- nao expor segredo.

---

## Ferramentas de Hardware

- multimetro;
- osciloscopio;
- analisador logico;
- fonte de bancada;
- conversor USB-serial;
- medidor de consumo;
- gravador/debugger.

Software nao corrige ligacao eletrica errada.

---

## Simulacao

Simulacao ajuda a validar logica:

- maquina de estados;
- filtros;
- controle;
- protocolos;
- payloads;
- erros de rede;
- buffers.

Nao substitui teste em hardware real.

---

## Teste de Longa Duracao

Teste de longa duracao revela:

- vazamento de memoria;
- reconexao ruim;
- aquecimento;
- corrompimento de arquivo;
- drift de tempo;
- falha de fonte;
- travamentos raros.

---

## Qualidade de Codigo

- funcoes pequenas;
- nomes claros;
- constantes para pinos;
- configuracao separada;
- logs controlados;
- drivers isolados;
- tratamento de excecao;
- watchdog;
- documentacao de pinagem;
- testes de regra.

---

## Exercicios

1. Separe uma regra de controle do hardware.
2. Crie teste com `pytest` para a regra.
3. Crie sensor fake.
4. Planeje teste de longa duracao.
5. Liste ferramentas necessarias para debug de I2C.
