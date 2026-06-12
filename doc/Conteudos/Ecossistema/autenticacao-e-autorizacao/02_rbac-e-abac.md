# RBAC e ABAC

Controle de acesso por papéis e atributos.

> **Tema:** Segurança · **Nível:** avancado · **Trilha:** Autenticação e Autorização

## Conceitos-chave

Nesta lição você vai entender:

- **RBAC: permissões por papel**
- **ABAC: decisões por atributos e contexto**
- **Dependências de autorização no FastAPI**
- **Princípio do menor privilégio**

## Exemplo prático

```python
def require_role(role):
    def dep(user = Depends(get_user)):
        if role not in user.roles:
            raise HTTPException(403)
    return dep
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Negue por padrão
- Audite acessos sensíveis

## Pratique

Para fixar, escreva um pequeno script que combine **rbac: permissões por papel** e **abac: decisões por atributos e contexto** em um caso do seu dia a dia. Depois refatore aplicando "Negue por padrão".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: RBAC: permissões por papel
- [ ] Explicar e aplicar: ABAC: decisões por atributos e contexto
- [ ] Explicar e aplicar: Dependências de autorização no FastAPI
- [ ] Explicar e aplicar: Princípio do menor privilégio

## Saiba mais

- [Documentação oficial](https://owasp.org/www-project-top-ten/)
