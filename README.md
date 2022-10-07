# Minibanco

Projeto construído utilizando express.js e node.js, para a prática das tecnologias e conceitos da programação para a web

### Instalando e executando o projeto

1. Clone esse repositório

2. Dentro da pasta do projeto, instale as dependências

```bash
 npm install   
```

3. Para o banco de dados, o projeto utiliza o prisma. Migre o banco com:

```bash
npx prisma migrate dev
```

4. Inicie o projeto utilizando o nodemon

```bash
npm run dev
```

### Funcionalidades

1. Criação de conta - A API cria uma conta e a adiciona no banco
2. Lista de contas - É possível obter a lista de contas criadas
3. Login - É possível fazer login na conta criada com o CPF e a senha. O login gera um token, que é utilizado para autenticar as operações seguintes
4. Edição de conta - É possível alterar o nome da conta criada
5. Depósito - É possível depositar um valor na conta
6. Saque - É possível retirar um valor da conta
7. Extrato - É possível obter a lista de operações realizadas em dada conta
8. Deleção - É possível deletar uma conta

### Tecnologias

- Express ^4.18.1
- Prisma ^4.4.0
- Crypto.js ^4.1.1
- Dotenv ^16.03
- Jsonwebtoken ^8.5.1
- Uuid ^9.0.0
- Nodemon ^2.0.20
