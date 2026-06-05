# Segurança e Operação IoT: Identidade, TLS, OTA e Escala

Segurança em IoT é crítica porque dispositivos estão no mundo físico, frequentemente fora do controle direto da equipe. Um atacante pode capturar equipamento, extrair firmware, tentar credenciais, falsificar telemetria ou enviar comandos perigosos.

Operação também é central: dispositivos ficam meses ou anos em campo, com rede instável, energia limitada, firmware antigo e manutenção difícil.

---

## Princípios

- cada dispositivo deve ter identidade própria;
- comunicação deve usar TLS quando possível;
- comandos precisam de autorização;
- segredos não devem ser compartilhados por todos;
- firmware precisa ser atualizável;
- dados sensíveis devem ser minimizados;
- dispositivos comprometidos devem ser revogáveis;
- logs e métricas devem permitir investigação.

---

## Identidade por Dispositivo

Ruim:

```text
todos os dispositivos usam o mesmo token
```

Melhor:

```text
device-001 -> credencial/certificado proprio
device-002 -> credencial/certificado proprio
```

Benefícios:

- revogar um dispositivo sem derrubar todos;
- auditar ações;
- limitar permissões;
- detectar comportamento anômalo;
- associar dados ao equipamento correto.

---

## Autenticação MQTT

Opções:

- usuário/senha por dispositivo;
- token por dispositivo;
- certificado cliente mTLS;
- integração com IAM/cloud;
- ACL por tópico.

ACL exemplo:

```text
device-001 pode publicar devices/device-001/telemetry
device-001 pode assinar devices/device-001/commands
device-001 nao pode acessar devices/device-002/#
```

Autenticação sem autorização por tópico ainda é frágil.

---

## TLS

TLS protege dados em trânsito.

Use para:

- MQTT over TLS na porta 8883;
- HTTPS;
- comunicação gateway-cloud;
- APIs de provisionamento.

Cuidados:

- validar certificado do servidor;
- não desativar verificação TLS;
- armazenar CA/certificados com cuidado;
- planejar rotação;
- lidar com relógio incorreto em dispositivos.

---

## mTLS

mTLS usa certificado também no cliente.

Fluxo:

```text
dispositivo apresenta certificado
servidor valida certificado
servidor identifica device_id
ACL permite topicos especificos
```

É uma abordagem forte para IoT, mas exige provisionamento e rotação de certificados.

---

## Provisionamento

Provisionamento é o processo de registrar e configurar dispositivo.

Estratégias:

- credencial gravada em fábrica;
- QR code com claim code;
- portal local;
- BLE provisioning;
- certificado por dispositivo;
- ativação por operador;
- bootstrap token temporário.

Fluxo recomendado:

```text
1. dispositivo nasce sem acesso amplo
2. operador associa device ao cliente/local
3. backend emite credencial especifica
4. dispositivo passa a operar com ACL limitada
```

---

## Armazenamento de Segredos

Dispositivos limitados dificultam segredo perfeito.

Boas práticas:

- não hardcode credencial global;
- use secure element quando necessário;
- proteja arquivo de configuração em Linux;
- minimize escopo da credencial;
- permita revogação;
- não logue tokens;
- evite expor secret em endpoint local.

Em Raspberry Pi:

```bash
chmod 600 /opt/iot-device/.env
```

---

## OTA

OTA, over-the-air update, permite atualizar firmware remotamente.

Requisitos:

- versão de firmware;
- assinatura/verificação;
- download confiável;
- rollback;
- atualização gradual;
- relatório de sucesso/falha;
- janela de manutenção;
- compatibilidade com schema.

Fluxo:

```text
backend publica update disponivel
device baixa pacote
device verifica assinatura
device instala
device reinicia
device confirma versao
```

OTA sem rollback pode transformar bug em visita técnica massiva.

---

## Segurança de Comandos

Comandos podem causar ação física. Proteja:

- autenticação do operador;
- autorização por dispositivo/grupo;
- confirmação;
- expiração;
- trilha de auditoria;
- limite de taxa;
- validação de payload;
- modo seguro em caso de falha.

Comando perigoso deve exigir regra de negócio, não apenas endpoint HTTP.

---

## Hardening de Gateway

Para Raspberry Pi/Linux:

- SSH por chave;
- senha padrão removida;
- firewall;
- atualizações;
- usuário sem root;
- systemd com restart;
- logs;
- disco protegido;
- watchdog;
- acesso local autenticado;
- backups de configuração.

Gateway é servidor em campo. Trate como produção.

---

## Operação em Escala

Com muitos dispositivos, acompanhe:

- inventário;
- versão de firmware;
- online/offline;
- bateria;
- qualidade de sinal;
- última telemetria;
- falhas por modelo;
- alertas por local;
- certificados expirando;
- comandos pendentes;
- taxa de atualização OTA.

Sem inventário, não há operação.

---

## Resiliência

Dispositivo deve lidar com:

- queda de energia;
- perda de Wi-Fi;
- broker indisponível;
- backend lento;
- relógio errado;
- sensor desconectado;
- armazenamento cheio;
- firmware com exceção.

Padrões:

- retry com backoff;
- watchdog;
- buffer offline limitado;
- modo degradado;
- health heartbeat;
- restauração segura após reboot.

---

## Privacidade

IoT pode coletar dados sensíveis:

- localização;
- presença;
- hábitos;
- áudio/imagem;
- consumo de energia;
- dados industriais.

Práticas:

- coletar mínimo necessário;
- anonimizar quando possível;
- criptografar em trânsito;
- controlar acesso;
- definir retenção;
- auditar uso;
- documentar finalidade.

---

## Erros Comuns

- mesma senha para todos os dispositivos;
- broker MQTT anônimo;
- tópicos sem ACL;
- comando sem autorização;
- OTA sem assinatura;
- sem rollback;
- dispositivo sem inventário;
- firmware sem versão;
- logs com segredo;
- não planejar revogação.

---

## Checklist

- Cada dispositivo tem identidade própria?
- MQTT/HTTP usa TLS?
- ACL limita tópicos por dispositivo?
- Comandos são autorizados e auditados?
- Segredos podem ser revogados?
- Firmware tem versão e OTA?
- OTA valida assinatura e tem rollback?
- Gateway está hardenizado?
- Há inventário e saúde dos dispositivos?
- Retenção e privacidade foram definidas?

Segurança IoT precisa ser desenhada desde o início. Depois que dispositivos estão em campo, corrigir identidade, credenciais e OTA é caro e lento.

