# Envio de e-mails

Automatize comunicação por e-mail.

## Pontos-chave

- smtplib e EmailMessage
- Anexos e HTML
- Templates com Jinja2
- Agendamento de envios

## Exemplo

```python
import smtplib
from email.message import EmailMessage
msg = EmailMessage()
msg['Subject'] = 'Relatório'
msg['To'] = 'dest@x.com'
msg.set_content('Segue o relatório.')
# smtp.send_message(msg)
```

## Boas práticas

- Use App Passwords/credenciais seguras
- Respeite limites de envio

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/email.examples.html)
