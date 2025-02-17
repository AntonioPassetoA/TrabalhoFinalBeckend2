require('dotenv').config();  // Carrega variáveis de ambiente do arquivo .env, como configurações de banco de dados
const express = require('express');  // Importa o framework Express para criação da API
const exphbs = require('express-handlebars');  // Importa o motor de templates Handlebars
const path = require('path');  // Importa o módulo para manipulação de caminhos de arquivos e diretórios
const morgan = require('morgan');  // Middleware para log de requisições HTTP
const cookieParser = require('cookie-parser');  // Middleware para parsing de cookies
const { sequelize } = require('./models');  // Importa a instância do Sequelize para conectar ao banco de dados
const authRoutes = require('./routes/authRoutes');  // Importa as rotas de autenticação
const ticketRoutes = require('./routes/purchaseRoutes');  // Importa as rotas de compra de ingressos (corrigido para purchaseRoutes)

const app = express();  // Cria uma instância da aplicação Express
const PORT = process.env.PORT || 3000;  // Define a porta para o servidor, usando a variável de ambiente ou 3000 por padrão

// Configuração do motor de templates Handlebars
app.engine('hbs', exphbs.engine({
  extname: 'hbs',  // Define a extensão dos arquivos de template
  defaultLayout: 'main',  // Define o layout padrão para os templates
  layoutsDir: path.join(__dirname, 'views', 'layouts'),  // Define onde estão os layouts
  helpers: {
    multiply: (a, b) => a * b  // Define um helper para multiplicar dois números, disponível nos templates
  }
}));

app.set('view engine', 'hbs');  // Define o motor de templates da aplicação como Handlebars
app.set('views', path.join(__dirname, 'views'));  // Define o diretório onde os templates serão armazenados

// Middlewares
app.use(express.urlencoded({ extended: true }));  // Middleware para parse de dados de formulários (urlencoded)
app.use(express.json());  // Middleware para parse de dados JSON
app.use(cookieParser());  // Middleware para parsing de cookies
app.use(morgan('dev'));  // Middleware para log de requisições HTTP no modo de desenvolvimento

// Rotas
app.use('/auth', authRoutes);  // Define a rota de autenticação que será tratada pelas rotas de authRoutes
app.use('/', ticketRoutes);    // Define a rota de vendas que será tratada pelas rotas de purchaseRoutes

// Função para conectar ao banco de dados e iniciar o servidor
const startServer = async () => {
  try {
    // Tenta conectar ao banco de dados usando Sequelize
    await sequelize.authenticate();  
    console.log('Conectado ao banco de dados.');
    
    // Inicia o servidor Express na porta definida
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('Erro de conexão:', err);  // Caso ocorra algum erro na conexão com o banco de dados
  }
};

// Chama a função para iniciar o servidor
startServer();
