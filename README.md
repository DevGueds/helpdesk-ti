# HelpDesk TI 🚀

![NodeJS](https://img.shields.io/badge/Node.js-18.x-43853d?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-00758f?style=for-the-badge&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952b3?style=for-the-badge&logo=bootstrap&logoColor=white)

> Sistema completo para gerenciamento de chamados de T.I., focado em eficiência operacional, controle de SLA e gestão de ativos.

---

## 📸 Preview

![Dashboard Preview](public/screenshots/dashboard.png)

## 🎯 Sobre o Projeto

O **HelpDesk TI** foi desenvolvido para solucionar a desorganização no atendimento de suporte técnico em ambientes corporativos. Ele centraliza solicitações, automatiza o cálculo de SLA e fornece métricas claras para a tomada de decisão.

### ✨ Diferenciais Técnicos
Este projeto não é apenas um CRUD. Ele foi construído seguindo boas práticas de engenharia de software:

*   **Arquitetura MVC (Model-View-Controller)**: Separação clara de responsabilidades para facilitar a manutenção.
*   **Segurança em Primeiro Lugar**:
    *   **CSRF Protection**: Proteção contra ataques de falsificação de solicitação entre sites.
    *   **Helmet**: Configuração de headers HTTP seguros.
    *   **Bcrypt**: Hash seguro de senhas.
    *   **Sanitization**: Tratamento de inputs para prevenir injeção.
*   **Performance & Dados**:
    *   **Prisma ORM**: Modelagem de dados eficiente e typesafe.
    *   **Database Seeding**: Scripts automatizados para popular o banco de desenvolvimento.

## 🚀 Funcionalidades Principais

*   🎫 **Gestão de Tickets**: Workflow completo (Aberto -> Em Andamento -> Resolvido -> Fechado).
*   ⏱️ **Controle de SLA**: Monitoramento automático de prazos de atendimento e resolução.
*   📦 **Controle de Inventário**: Gestão de insumos (toners, peças) integrada aos chamados.
*   📊 **Dashboard Administrativo**: Visão macro com gráficos (Chart.js) e indicadores em tempo real.
*   👥 **Controle de Acesso (RBAC)**: Perfis distintos para Admin, Técnico, Coordenador e Solicitante.
*   📎 **Anexos e Chat**: Comunicação integrada dentro do ticket.

## � Roadmap (Em Desenvolvimento)

O projeto está em constante evolução. As próximas atualizações focarão em:

*   [ ] **Integração Estoque-Chamados**: Baixa automática de insumos no estoque ao registrar substituição de peças no chamado.
*   [ ] **Relatórios Avançados**: Exportação de dados e indicadores para Excel/CSV.
*   [ ] **Gestão de Senhas**: Funcionalidade para o Administrador redefinir senhas e fluxo de "Esqueci minha senha" para usuários.
*   [ ] **SLA Dinâmico**:
    *   Interface para configuração de prazos (SLA) por Categoria.
    *   Visualização de tempo estimado de atendimento para o solicitante.
    *   Refinamento das regras para atender especificidades da Secretaria de Saúde.
*   [ ] **Dashboard por Unidade**: Visão analítica para as USFs acompanharem suas categorias com maior demanda.

## �🛠️ Tecnologias

*   **Backend**: Node.js, Express
*   **Database**: MySQL, Prisma ORM
*   **Frontend**: EJS (Server-side rendering), Bootstrap 5, Vanilla JS
*   **Ferramentas**: Git, VS Code

## 🏁 Como Rodar o Projeto

### Pré-requisitos
*   Node.js (v18+)
*   MySQL rodando (Local ou Docker)

### Passo a Passo

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/DevGueds/helpdesk-ti.git
    cd helpdesk-ti
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure o Ambiente**
    Crie um arquivo `.env` na raiz:
    ```env
    DATABASE_URL="mysql://usuario:senha@localhost:3306/helpdesk"
    SESSION_SECRET="segredo_super_seguro"
    ```

4.  **Setup do Banco de Dados**
    ```bash
    npm run db:migrate  # Cria as tabelas
    npm run db:seed     # Cria usuário admin (Login: admin / Senha: Admin@123)
    ```

5.  **Execute**
    ```bash
    npm run dev
    ```
    Acesse: `http://localhost:3000`

## 👤 Autor

**Vinicius Guedes**
*   [LinkedIn](linkedin.com/in/devguedes)
*   [GitHub](https://github.com/DevGueds)

---
*Desenvolvido com ❤️ e café.*
