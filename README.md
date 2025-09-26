# Projeto de Gerenciamento de Chamados

Aplicação front-end desenvolvida em React para gerenciar um sistema de chamados, consumindo uma API para autenticação, listagem, visualização de detalhes e criação de novos registros.
Com mais funcionalidades a serem implementada, no momentom, o foco estava apenas no consumo da api, fazendo o minimo de estilzação, pois foi uma das praticas que desenvolvi, costumo fazer apenas a logia de implementação primeriro para que tudo esteja funcionando e depois adiciono os estilos.

## Funcionalidades Implementadas

Autenticação de Usuário: Tela de login que consome a API para validar credenciais e obter um token JWT para acesso seguro.
Gerenciamento de Sessão: O token do usuário é salvo localmente, permitindo que a sessão persista ao recarregar a página. Inclui funcionalidade de Logout.
Listagem de Chamados: Exibição dos chamados em uma tabela com paginação.
Filtro e Pesquisa: Funcionalidade para filtrar a lista de chamados por status (Atendidos, Pendentes, etc.) e realizar buscas por texto.
Visualização de Detalhes: Rota dedicada (`/chamados/:id`) para exibir todas as informações de um chamado específico.
Criação de Chamado: Formulário completo para a criação de um novo chamado, com campos de texto e seletores dinâmicos que consultam a API em tempo real para autocompletar.

## Tecnologias Utilizadas

Esta seção detalha as principais tecnologias e o porquê de suas escolhas para este projeto.

React com Vite:
Descrição: O uso do React para a construção de uma interface de usuário reativa e componentizada. O Vite foi escolhido como a ferramenta de build por sua incrível velocidade de desenvolvimento (Hot Module Replacement) e configuração simplificada.
A combinação React + Vite oferece um ambiente de desenvolvimento moderno, rápido e eficiente, ideal para criar Single-Page Applications (SPAs).

TypeScript:
Adiciona tipagem estática ao JavaScript.
Garante maior segurança e manutenibilidade ao código. Permite identificar erros em tempo de desenvolvimento, facilita o autocompletar e melhora a clareza sobre as estruturas de dados (DTOs, props, etc.) trocadas com a API.

React Router v6:
Biblioteca para gerenciamento de rotas na aplicação.
Essencial para criar a estrutura de navegação da SPA, permitindo a criação de rotas públicas (`/login`), rotas protegidas (`/chamados`) e rotas com parâmetros dinâmicos (`/chamados/:id`).

Axios:
Cliente HTTP baseado em Promises para realizar requisições à API.
Facilita a comunicação com o backend. Foi configurado com uma instância base para centralizar a URL da API e para interceptar requisições, permitindo a adição automática do token JWT no cabeçalho `Authorization` após o login.

React Select:
Componente avançado para campos de seleção.
Foi fundamental para implementar os campos de "Pessoa Assistida" e "Bairro" no formulário de criação, que exigiam uma busca assíncrona na API para popular as opções de autocomplete conforme o usuário digita.

Durante o desenvolvimento, alguns desafios foram encontrados, principalmente relacionados à integração com a API e à lógica de UI.

#### 1. Integração com a API

A API apresentava algumas particularidades que exigiram depuração e adaptação:

Método de Login: O endpoint de login utilizava o método `PUT`, enquanto o convencional para "criar uma sessão" seria o `POST`. Embora funcional, foi um ponto de atenção inicial.
Formato da Resposta de Login: O token JWT era retornado no corpo da resposta (`response.data.dados.token`), e não no cabeçalho `Authorization` como é comum. A lógica de autenticação foi ajustada para ler o token do local correto.
Endpoint de Bairro com Erro `500`: O endpoint `POST /api/Chamado/select/bairro` apresentou um erro interno no servidor (500), impedindo a implementação do seletor dinâmico para bairros.
Solução de Contorno: Para não bloquear o desenvolvimento, o campo de autocomplete foi temporariamente substituído por um campo de texto simples, permitindo a continuidade do fluxo.
Requisitos Implícitos no `ChamadoDTO`: Durante a implementação do formulário de criação, a API retornou erros `400 (Bad Request)`. A depuração revelou que campos não presentes no formulário, como `dataCadastro`, `latitude` e `longitude`, eram obrigatórios. A solução foi gerar esses dados no frontend no momento da submissão.

#### 2. Lógica da Interface (UI)

A funcionalidade de pesquisa na lista de chamados passou por um refinamento. Inicialmente, foi implementada uma busca instantânea no frontend, mas, por preferência de design, foi revertida para um modelo mais controlado, com um botão "Filtrar" que dispara a busca no backend, oferecendo um feedback de carregamento claro ao usuário.

## Como Executar o Projeto Localmente

1.  Clone o repositório:
    git clone <https://github.com/Guilherme-jpg-max/chamados-app.git>
2.  Navegue até a pasta do projeto:
    cd <NOME_DA_PASTA>
3.  Instale as dependências:
    npm install
4.  Execute o servidor de desenvolvimento:
    npm run dev

A aplicação estará disponível em `http://localhost:5173`.
