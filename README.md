# HelpDesk TI

Sistema de Gerenciamento de Chamados e Inventário de TI desenvolvido para otimizar o fluxo de trabalho do departamento de tecnologia. O sistema permite a abertura, acompanhamento e resolução de chamados, além de controle de SLA e gerenciamento de inventário.

## 🚀 Funcionalidades

- **Gestão de Chamados**: Abertura, editção, acompanhamento e encerramento de tickets.
- **Perfis de Usuário**:
  - **Solicitante**: Abre chamados.
  - **Técnico**: Atende e resolve chamados.
  - **Coordenador**: Gerencia equipe e visualiza relatórios.
  - **Admin**: Acesso total ao sistema.
- **Dashboard**: Visão geral métricas e indicadores.
- **SLA (Service Level Agreement)**: Controle de prazos de atendimento e resolução prioridades.
- **Inventário e Insumos**: Controle de estoque de toner, cabos e peças.
- **Auditoria**: Logs de ações realizadas no sistema.
- **Anexos e Comentários**: Upload de arquivos e chat dentro do chamado.

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js com Express
- **Banco de Dados**: MySQL gerenciado pelo Prisma ORM
- **Frontend**: EJS (Embedded JavaScript) com Bootstrap 5
- **Autenticação**: Sessão express-session e proteção CSRF
- **Outros**: Chart.js (Dashboards), Multer (Uploads), Dotenv

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [MySQL](https://www.mysql.com/)

## 🔧 Instalação e Configuração

1.  **Clone o projeto** (se aplicável)
    ```bash
    git clone <url-do-repositorio>
    cd helpdesk-ti
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure o Banco de Dados**
    - Crie um arquivo `.env` na raiz do projeto copiando o exemplo (se houver) ou configure a variável `DATABASE_URL`:
    ```env
    DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
    SESSION_SECRET="sua_chave_secreta"
    ```

4.  **Execute as Migrations e Seed**
    Para criar as tabelas e popular o banco com dados iniciais (admin, categorias, etc):
    ```bash
    npm run db:migrate
    npm run db:seed
    ```

## 🚀 Executando o Projeto

Para iniciar o servidor em ambiente de desenvolvimento:

```bash
npm run dev
```

Ou utilize o arquivo batch se estiver no Windows:
- Execute `start.bat`

O servidor iniciará geralmente em `http://localhost:3000` (ou a porta definida no seu server.js).

## 📂 Estrutura do Projeto

- `src/`: Código fonte do backend (controllers, middlewares, routes).
- `views/`: Templates EJS para o frontend.
- `public/`: Arquivos estáticos (CSS, JS do cliente, imagens).
- `prisma/`: Schema do banco de dados, migrations e seeds.
- `uploads/`: Diretório de armazenamento de arquivos anexados.

## 🤝 Contribuição

1.  Faça um Fork do projeto
2.  Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`)
3.  Faça o Commit de suas mudanças (`git commit -m 'Adiciona a MinhaFeature'`)
4.  Faça o Push para a Branch (`git push origin feature/MinhaFeature`)
5.  Abra um Pull Request
