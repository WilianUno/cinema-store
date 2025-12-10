#Relatório de Desenvolvimento – Sistema “Cinema Store”

##1. Fase de Planejamento
A Cinema Store é uma loja virtual fictícia especializada na venda de filmes clássicos e lançamentos em mídia digital. Inserida no nicho de entretenimento e e-commerce, a aplicação foi idealizada para disponibilizar um catálogo completo de filmes e permitir aos usuários realizar compras de maneira intuitiva e segura.

###Modelo de Dados (CRUD)
Usuários:Contém as informações de clientes e administradores, diferenciados por meio de uma flag de privilégio denominada 'role'.
Filmes:Representa o catálogo principal do sistema, contendo título, descrição, gênero, preço, URL da capa, duração e ano de lançamento.
Carrinho:Tabela temporária responsável por vincular produtos ao usuário antes da finalização da compra.
Pedidos e Itens_Pedido:Registra permanentemente o histórico de transações, garantindo rastreabilidade das vendas.
Nota: Deverão ser incluídos os prints dos wireframes desenvolvidos antes da etapa de programação.

##2. Desenvolvimento do Front-End
A interface do sistema foi desenvolvida utilizando tecnologias essenciais para garantir leveza, compatibilidade e boa experiência ao usuário.
HTML5: Utilizado para estruturação semântica das páginas.
CSS3: Aplicado para estilização e responsividade, assegurando adaptação a dispositivos móveis e desktop.
JavaScript: Responsável pela lógica do lado do cliente e consumo da API via Fetch API. O JWT é armazenado no localStorage para manter a sessão ativa.

##3. Desenvolvimento do Back-End
O servidor foi construído com foco em escalabilidade e organização, utilizando a arquitetura MVC.

###Tecnologias Utilizadas
Linguagem e Framework:Back-End desenvolvido com TypeScript e Node.js, utilizando o framework Express.
Banco de Dados:SQLite utilizando a biblioteca better-sqlite3, facilitando a execução sem configurações adicionais.

###Autenticação e Segurança
Senhas: Criptografadas utilizando a biblioteca bcryptjs.
Sessão: Autenticação via JSON Web Tokens (JWT), validada por middlewares.

##4. Integração e Desafios
Durante a integração entre Front-End e Back-End, foram identificados desafios relacionados ao CORS, estruturação de arquivos e transações no banco de dados.

##5. Divisão de Tarefas
Guilherme Luiz Sutille: Desenvolvimento do Back-End, autenticação e lógica de checkout.
Nicole Schwarz: Desenvolvimento do Front-End e integração.
Wilian Robal: Testes, povoamento do banco e ligação entre fron-end e back-end