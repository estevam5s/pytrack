# Django ORM: Models, QuerySets, Migrations e Performance

Django ORM é o mapeador objeto-relacional integrado ao Django. Ele oferece models, migrations, QuerySets, validações, relacionamentos, admin, transações e integração profunda com o framework.

É excelente para aplicações web, sistemas administrativos, APIs com Django REST Framework e projetos que valorizam produtividade com convenções fortes.

---

## Model Básico

```python
from django.db import models


class Cliente(models.Model):
    nome = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.nome
```

Campos importantes:

- `auto_now_add`: preenchido na criação.
- `auto_now`: atualizado em cada save.
- `unique=True`: cria restrição de unicidade.
- `blank` afeta validação de formulário.
- `null` afeta banco de dados.

---

## Migrations

Criar migration:

```bash
python manage.py makemigrations
```

Aplicar:

```bash
python manage.py migrate
```

Ver SQL:

```bash
python manage.py sqlmigrate app 0001
```

Boas práticas:

- revise migrations antes de aplicar;
- evite renames destrutivos sem checar;
- cuidado com defaults em tabelas grandes;
- separe migrations de schema e migrations de dados;
- teste migrations em cópia de produção quando possível.

---

## CRUD Básico

Create:

```python
cliente = Cliente.objects.create(nome="Ana Souza", email="ana@example.com")
```

Read:

```python
cliente = Cliente.objects.get(id=1)
cliente = Cliente.objects.filter(email="ana@example.com").first()
```

Update:

```python
cliente.nome = "Ana Maria"
cliente.save(update_fields=["nome", "atualizado_em"])
```

Delete:

```python
cliente.delete()
```

Update em massa:

```python
Cliente.objects.filter(ativo=False).update(ativo=True)
```

---

## QuerySets

QuerySets são lazy: a consulta só é executada quando o resultado é consumido.

```python
qs = Cliente.objects.filter(ativo=True).order_by("nome")
```

Executa:

```python
list(qs)
qs.count()
qs.exists()
qs.first()
```

Filtros comuns:

```python
Cliente.objects.filter(nome__icontains="ana")
Cliente.objects.filter(criado_em__date="2026-05-15")
Cliente.objects.filter(id__in=[1, 2, 3])
Cliente.objects.exclude(ativo=False)
```

---

## Relacionamentos

```python
class Pedido(models.Model):
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        related_name="pedidos",
    )
    status = models.CharField(max_length=30, default="aberto")
    total = models.DecimalField(max_digits=12, decimal_places=2)
    criado_em = models.DateTimeField(auto_now_add=True)
```

`on_delete`:

- `CASCADE`: apaga filhos.
- `PROTECT`: impede exclusão se houver dependentes.
- `SET_NULL`: define nulo, exige `null=True`.
- `RESTRICT`: restrição mais explícita em versões modernas.

Para dados de negócio, `PROTECT` costuma ser mais seguro que `CASCADE`.

---

## Many-to-Many

```python
class Grupo(models.Model):
    nome = models.CharField(max_length=80)


class Usuario(models.Model):
    nome = models.CharField(max_length=120)
    grupos = models.ManyToManyField(Grupo, related_name="usuarios")
```

Com tabela intermediária explícita:

```python
class Matricula(models.Model):
    aluno = models.ForeignKey("Aluno", on_delete=models.CASCADE)
    curso = models.ForeignKey("Curso", on_delete=models.CASCADE)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["aluno", "curso"], name="uq_aluno_curso")
        ]
```

Use tabela explícita quando a relação tem atributos próprios.

---

## select_related e prefetch_related

Problema N+1:

```python
pedidos = Pedido.objects.all()
for pedido in pedidos:
    print(pedido.cliente.nome)
```

Solução para ForeignKey:

```python
pedidos = Pedido.objects.select_related("cliente")
```

Solução para relação reversa ou many-to-many:

```python
clientes = Cliente.objects.prefetch_related("pedidos")
```

Regra prática:

- `select_related`: join para relações 1:1 e N:1.
- `prefetch_related`: consulta separada para coleções.

---

## Agregações e Anotações

```python
from django.db.models import Count, Sum, Avg


clientes = Cliente.objects.annotate(
    quantidade_pedidos=Count("pedidos"),
    total_gasto=Sum("pedidos__total"),
).order_by("-total_gasto")
```

Filtros em agregação:

```python
from django.db.models import Q


Cliente.objects.annotate(
    pedidos_pagos=Count("pedidos", filter=Q(pedidos__status="pago"))
)
```

---

## F Expressions

Evita lost update em incrementos.

```python
from django.db.models import F


Produto.objects.filter(id=10, estoque__gte=1).update(estoque=F("estoque") - 1)
```

O cálculo ocorre no banco, não em memória.

---

## Transações

```python
from django.db import transaction


@transaction.atomic
def criar_pedido(cliente, itens):
    pedido = Pedido.objects.create(cliente=cliente, status="aberto", total=0)
    total = 0

    for item in itens:
        total += item["quantidade"] * item["preco"]
        ItemPedido.objects.create(
            pedido=pedido,
            produto_id=item["produto_id"],
            quantidade=item["quantidade"],
            preco_unitario=item["preco"],
        )

    pedido.total = total
    pedido.save(update_fields=["total"])
    return pedido
```

Bloqueio pessimista:

```python
with transaction.atomic():
    produto = Produto.objects.select_for_update().get(id=10)
    produto.estoque -= 1
    produto.save(update_fields=["estoque"])
```

---

## Constraints e Índices

```python
class Produto(models.Model):
    sku = models.CharField(max_length=40)
    nome = models.CharField(max_length=120)
    preco = models.DecimalField(max_digits=12, decimal_places=2)
    ativo = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=["nome"], name="idx_produtos_nome"),
            models.Index(fields=["ativo", "nome"], name="idx_produtos_ativo_nome"),
        ]
        constraints = [
            models.UniqueConstraint(fields=["sku"], name="uq_produtos_sku"),
            models.CheckConstraint(check=models.Q(preco__gte=0), name="ck_produtos_preco")
        ]
```

---

## Managers e QuerySets Customizados

```python
class ClienteQuerySet(models.QuerySet):
    def ativos(self):
        return self.filter(ativo=True)

    def por_email(self, email: str):
        return self.filter(email__iexact=email)


class Cliente(models.Model):
    nome = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    ativo = models.BooleanField(default=True)

    objects = ClienteQuerySet.as_manager()
```

Uso:

```python
Cliente.objects.ativos().por_email("ana@example.com").first()
```

---

## Performance

Ferramentas:

```python
print(queryset.query)
queryset.explain()
```

Boas práticas:

- use `only` e `defer` para colunas grandes;
- use `values` quando não precisa de instâncias;
- use `bulk_create` e `bulk_update` para lotes;
- monitore queries com Django Debug Toolbar;
- evite lógica pesada em `save`;
- cuidado com signals em massa;
- use índices alinhados aos filtros reais.

---

## Checklist Profissional

- models refletem regras do domínio?
- `on_delete` foi escolhido conscientemente?
- há constraints no banco para regras críticas?
- migrations estão revisadas?
- QuerySets evitam N+1?
- agregações foram conferidas no SQL gerado?
- operações financeiras usam transação?
- updates concorrentes usam `F` ou locks?
- queries críticas têm índices?
- admin não expõe campos sensíveis indevidamente?

