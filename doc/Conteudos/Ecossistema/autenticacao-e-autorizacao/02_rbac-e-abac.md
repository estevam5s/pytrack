# RBAC e ABAC

Controle de acesso por papéis e atributos.

## Pontos-chave

- RBAC: permissões por papel
- ABAC: decisões por atributos e contexto
- Dependências de autorização no FastAPI
- Princípio do menor privilégio

## Exemplo

```python
def require_role(role):
    def dep(user = Depends(get_user)):
        if role not in user.roles:
            raise HTTPException(403)
    return dep
```

## Boas práticas

- Negue por padrão
- Audite acessos sensíveis

## Saiba mais

- [Documentação oficial](https://owasp.org/www-project-top-ten/)
