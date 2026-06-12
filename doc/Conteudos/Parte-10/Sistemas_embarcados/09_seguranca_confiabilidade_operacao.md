# Seguranca, Confiabilidade e Operacao

Sistemas embarcados frequentemente operam fora do ambiente de desenvolvimento: campo, fabrica, veiculo, residencia, equipamento remoto ou local sem acesso facil. Por isso, confiabilidade e operacao sao tao importantes quanto o codigo.

---

## Ameacas Comuns

- credenciais expostas;
- firmware adulterado;
- comunicacao sem criptografia;
- porta de debug aberta;
- atualizacao insegura;
- dispositivo fisicamente acessivel;
- replay de mensagens;
- comandos nao autorizados;
- dados sensiveis em logs;
- default password.

---

## Credenciais

Evite:

```python
WIFI_PASSWORD = "senha123"
```

Prefira:

- arquivo de configuracao fora do repositorio;
- provisionamento por dispositivo;
- variaveis de ambiente em Linux;
- armazenamento seguro quando disponivel;
- rotacao de credenciais.

---

## Comunicacao Segura

Use TLS quando possivel.

Cuidados:

- validar certificado;
- nao desabilitar verificacao em producao;
- usar tokens por dispositivo;
- limitar permissoes por topico/API;
- expirar credenciais;
- registrar tentativas invalidas.

---

## Watchdog e Recuperacao

Watchdog reinicia o sistema quando ele trava. Mas reiniciar sem diagnostico pode esconder falhas.

Inclua:

- contador de resets;
- motivo do reset quando disponivel;
- log do ultimo erro;
- modo seguro se falhar repetidamente;
- telemetria de saude.

---

## Falhas de Rede

Dispositivo deve continuar operando quando rede cair, se possivel.

Estrategias:

- buffer local;
- retry com backoff;
- modo offline;
- sincronizacao posterior;
- comandos com idempotencia;
- timeout curto;
- status claro.

---

## Atualizacao

Atualizacoes podem ser:

- manuais por USB;
- via serial;
- por rede;
- OTA;
- por pacote em Linux embarcado.

Boas praticas:

- verificar integridade;
- manter versao anterior;
- rollback;
- nao interromper energia;
- registrar versao;
- validar compatibilidade de configuracao.

---

## Observabilidade

Inclua:

- logs;
- metricas;
- heartbeat;
- versao de firmware;
- uptime;
- memoria livre;
- qualidade de sinal;
- quantidade de reconexoes;
- ultimo erro;
- temperatura interna quando relevante.

---

## Operacao em Campo

Documente:

- como ligar/desligar;
- como resetar;
- como atualizar;
- como ler logs;
- significado de LEDs;
- pinagem;
- limites eletricos;
- procedimento de substituicao;
- contato de suporte.

---

## Checklist

- Existe watchdog?
- Falhas de rede sao tratadas?
- Credenciais estao protegidas?
- Comunicacao usa TLS?
- Ha logs suficientes?
- Existe health check?
- Atualizacao tem rollback?
- O dispositivo informa versao?
- Ha documentacao de operacao?

---

## Exercicios

1. Crie checklist de seguranca para sensor IoT.
2. Defina estrategia de reconexao com backoff.
3. Desenhe fluxo de atualizacao segura.
4. Liste metricas de saude de um gateway.
5. Crie plano de operacao em campo.
