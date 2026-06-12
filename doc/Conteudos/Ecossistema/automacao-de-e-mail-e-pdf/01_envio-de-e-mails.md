# Envio de e-mails

Automatize comunicação por e-mail.

> **Tema:** Documentos · **Nível:** intermediario · **Trilha:** Automação de E-mail e PDF

## Conceitos-chave

Nesta lição você vai entender:

- **smtplib e EmailMessage**
- **Anexos e HTML**
- **Templates com Jinja2**
- **Agendamento de envios**

## Exemplo prático

```python
import smtplib
from email.message import EmailMessage
msg = EmailMessage()
msg['Subject'] = 'Relatório'
msg['To'] = 'dest@x.com'
msg.set_content('Segue o relatório.')
# smtp.send_message(msg)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use App Passwords/credenciais seguras
- Respeite limites de envio

## Pratique

Para fixar, escreva um pequeno script que combine **smtplib e emailmessage** e **anexos e html** em um caso do seu dia a dia. Depois refatore aplicando "Use App Passwords/credenciais seguras".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: smtplib e EmailMessage
- [ ] Explicar e aplicar: Anexos e HTML
- [ ] Explicar e aplicar: Templates com Jinja2
- [ ] Explicar e aplicar: Agendamento de envios

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/email.examples.html)
