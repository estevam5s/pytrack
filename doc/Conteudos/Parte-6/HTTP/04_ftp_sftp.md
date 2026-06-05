# FTP e SFTP: Transferência de Arquivos com Python

FTP é um protocolo antigo para transferência de arquivos. SFTP é transferência de arquivos sobre SSH. Apesar de APIs modernas e object storage serem comuns, FTP/SFTP ainda aparece em bancos, ERPs, integrações legadas, governo, logística e sistemas corporativos.

Sempre que possível, prefira SFTP a FTP puro, porque FTP sem TLS transmite credenciais e dados sem criptografia.

---

## FTP, FTPS e SFTP

FTP:

- antigo;
- sem criptografia por padrão;
- usa canal de controle e dados;
- pode ter problemas com firewall/NAT.

FTPS:

- FTP com TLS;
- ainda carrega complexidade do FTP.

SFTP:

- protocolo sobre SSH;
- usa porta 22 normalmente;
- criptografado;
- mais simples para firewall.

---

## FTP com ftplib

```python
from ftplib import FTP


with FTP("ftp.example.com", timeout=30) as ftp:
    ftp.login(user="usuario", passwd="senha")
    ftp.cwd("/entrada")
    print(ftp.nlst())
```

Baixar arquivo:

```python
from pathlib import Path


def baixar_ftp(host: str, user: str, password: str, remoto: str, local: Path) -> None:
    with FTP(host, timeout=30) as ftp:
        ftp.login(user=user, passwd=password)
        with local.open("wb") as arquivo:
            ftp.retrbinary(f"RETR {remoto}", arquivo.write)
```

---

## Enviar Arquivo por FTP

```python
def enviar_ftp(host: str, user: str, password: str, local: Path, remoto: str) -> None:
    with FTP(host, timeout=30) as ftp:
        ftp.login(user=user, passwd=password)
        with local.open("rb") as arquivo:
            ftp.storbinary(f"STOR {remoto}", arquivo)
```

---

## FTPS

```python
from ftplib import FTP_TLS


with FTP_TLS("ftp.example.com", timeout=30) as ftps:
    ftps.login("usuario", "senha")
    ftps.prot_p()
    print(ftps.nlst())
```

`prot_p()` protege canal de dados.

---

## SFTP com Paramiko

```bash
pip install paramiko
```

```python
import paramiko


transport = paramiko.Transport(("sftp.example.com", 22))
transport.connect(username="usuario", password="senha")

with paramiko.SFTPClient.from_transport(transport) as sftp:
    print(sftp.listdir("/entrada"))

transport.close()
```

---

## SFTP com Chave Privada

```python
import paramiko


key = paramiko.RSAKey.from_private_key_file("/caminho/id_rsa")
transport = paramiko.Transport(("sftp.example.com", 22))
transport.connect(username="usuario", pkey=key)

with paramiko.SFTPClient.from_transport(transport) as sftp:
    sftp.get("/entrada/arquivo.csv", "arquivo.csv")

transport.close()
```

Proteja permissões da chave privada.

---

## Processamento Idempotente

Padrão comum:

```text
/entrada
/processando
/processados
/erro
```

Fluxo:

1. listar `/entrada`;
2. mover para `/processando`;
3. baixar/processar;
4. mover para `/processados` ou `/erro`;
5. registrar log.

Isso evita reprocessamento duplicado.

---

## Upload Atômico

Envie com nome temporário e depois renomeie:

```python
sftp.put("relatorio.csv", "/saida/relatorio.csv.tmp")
sftp.rename("/saida/relatorio.csv.tmp", "/saida/relatorio.csv")
```

Consumidor não lê arquivo incompleto.

---

## Segurança

- prefira SFTP;
- não coloque credenciais no código;
- valide host key no SSH;
- use usuário com permissão mínima;
- limite diretórios;
- use timeout;
- registre arquivos processados;
- cuidado com path traversal;
- criptografe arquivos sensíveis quando necessário.

---

## Checklist FTP/SFTP

- protocolo é criptografado?
- credenciais vêm de secret manager/env?
- há timeout?
- arquivos são processados de forma idempotente?
- upload usa nome temporário?
- permissões do usuário remoto são mínimas?
- logs registram nome, tamanho e resultado?
- falhas movem arquivo para área de erro?

