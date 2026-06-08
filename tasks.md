- Na rota "/sobre", deve arrumar a parte de "trilhas de carreira" pois esta desatualizado.
- Na parte de entrar em contato, deve ser possivel recibimento de e-mails.
- Deve deixar a navbar das rotas mais profissional e elegante.
- Na rota "/inicio" do dashboard, deve melhorar a parte de "Progresso por área" pois a conclusao escrito esta em preto e fica dificil de ler, o mesmo quando se muda de tema (dark e light) e o mesmo em "Status dos conteúdos" na parte de "Nao iniciado", deve ficar na cor roxa igual a parte de "Mapa de proficiência no ecossistema" em "Dominio"
- Na rota "/perfil", deve melhorar a interface, deve ser possivel adicionar mais informacoes dos usuarios, ser possivel adicionar foto de capa (gif, png, jpg, jpeg, etc ...) deve fazer script sql e inserir no suspabase, quando outro usuario for visitar o perfil de outro usuario pela comunidade, vai ser possivel ver as habilidades, se conectar e/ou seguir o usuario igual ao linkedin, deve ser bem completo.
Quando o usuario cria a conta dele e acessa a plataforma, aparece um tutorial (Deve melhorar para ser mais completo e quando clica em proximo, vai para a rota onde esta o tuturial), na proxima vez que o usuario for realizar o login, nao pode ser mostrado novamente, deve fazer um script sql para salvar no banco.
- Deve conter um botao de instalar o app do site em PWA de forma completa e funcional e que fique visivel no site e tambem no dashboard.
- A rota "/suporte" nao precisa ser mostrada quando esta logado o usuario como admin, apenas deve ser mostrado aos usuarios normais.
- Deve testar a parte de ver se a plataforma, stripe e supabase suporta mais de 3000 usuarios com varios tipos de planos, deve separar em porcentagem, vamos supor que 10% pega o plano Vitalicio, 20% plano Supreme, etc. ...
- Na parte do site, na rota home ou a de preco, colocar que a minha plataforma esta em "trustmrr.com" e tem o badge "<a href="https://trustmrr.com/startup/pytrack" target="_blank"><img src="https://trustmrr.com/api/embed/pytrack?format=svg&theme=dark" alt="TrustMRR verified revenue badge" width="220" height="90" /></a>", deve analisar e colocar de forma estrategica. "https://trustmrr.com/startup/pytrack". E falando de "trustmrr", gostaria de colocar uma rota no dashboard que so o usuario admin possa acessar que seria o Analytics de "trustmrr", dados da API:
API Key: "tmrr_deb61e0487c40abf66ef3d1f9fd08076"
Quick start:
Base URL: https://trustmrr.com/api/v1
Authentication: Authorization: Bearer tmrr_...
List startups:
curl -H "Authorization: Bearer YOUR_KEY" \
  https://trustmrr.com/api/v1/startups
Get a single startup:
curl -H "Authorization: Bearer YOUR_KEY" \
  https://trustmrr.com/api/v1/startups/{slug}
Rate limit: 20 requests per minute per API key
- Quando se pesquisa "pytrack" no google, a busca eh bem basica, so aparece "public/pytrack-busca-google.png", quando se pesquisa "rocketseat" ja aparece mais busca como na imagem anexada "public/rocketseat.png", essa parte de busca, deve ser bem completa e altamente eficiente e funcional, deve mostrar todas as informacoes que deve ser mostrada no google e que deve ter uma rota no usuario admin que seria a parte de configurar tudo isso em buscas do google, deve tambem anlisar o SEO do site para ver a performance e rapidez e eficiencia. Deve conter tambem o Analytics da pagina, quantos usuarios navegam na pagina.
- Deve verificar se o supabase suporta quantos usuarios e caso o supabase bane a conta, deve ter um backup seguro.
- Na rota "/ide", deve conter um botao de mudar o tema de fundo do editor de codigo, temas como dracula, ou outros 20 tipos de temas. Deve conter tambem snippets em python, uma lista completa e imensa e mais exemplos de codigos.
- Quando o usuario for se registrar, deve verificar se o email eh falso, email verdadeiros como gmail, outlook, hotmail, yahol, emails de estudantes de faculdades, deve utilizar uma ferramenta de checagem de emails verdadeiros.
- Deve melhorar a parte de seguranca para que quando hackers fazem ataques DDoS, Dos, Hydra, ataque de forca bruta, nao cae a plataforma e que tambem, nao tenha vazamento de dados ou hackear contas.
- Na rota home do site, deve implementar uma secao de print de tela onde mostra como eh por dentro da plataforma, imagem "public/dashboard.png", deve ser bem completo e profissional, isso seria um unboarding e que deve ser bem completo e profissional.
- Deve criar uma nova rota, mas so disponivel no plano "Suprema" (de R$46 reais) que seria se preparando para entrevista de emprego (deve mostrar essa funcionalidade na parte "O que cada plano inclui" da rota de "/precos"), essa nova rota vai ser completa e deve utilizar a IA, onde com base em todas as informacoes de experiencia do usuario, vai interagindo com ele, fazendo perguntas, dando dicas, tudo de forma completa e avancada.
- Implementar Newslatter

- *Com base no sistema saas atual, deve implementar em novos sistema saas, tudo que esta nesse saas atual (pagamentos via stripe e configuracao por la com webhook e conexao com supabase, tudo integrado e funcional igual a esse sistema saas atual.)*
*Chave privada: "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", Publishable key: "pk_live_51QIyurCB6Dz1wPeiqSW14I9x21dZpwith28Ys80f4HdFDy0GMyEy9p7qfK4nEA6GcHstvcE5fNMn2CKkyfDM2UmQ00es8uYUYi",*
*NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QIyurCB6Dz1wPeiqSW14I9x21dZpwith28Ys80f4HdFDy0GMyEy9p7qfK4nEA6GcHstvcE5fNMn2CKkyfDM2UmQ00es8uYUYi*
*STRIPE_SECRET_KEY=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*