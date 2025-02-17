require('dotenv').config();  // Carrega as variáveis de ambiente do arquivo .env
const { Sequelize, DataTypes } = require('sequelize');  // Importa o Sequelize e o tipo de dados (DataTypes)

// Conexão com o banco de dados usando Sequelize
const sequelize = new Sequelize({
  host: process.env.DB_HOST,         // Endereço do host do banco de dados (usualmente 'localhost' ou IP)
  username: process.env.DB_USER,     // Nome do usuário para se conectar ao banco de dados
  password: process.env.DB_PASSWORD, // Senha do usuário para o banco de dados
  database: process.env.DB_NAME,     // Nome do banco de dados a ser usado
  dialect: 'mysql',                  // O banco de dados utilizado é MySQL
  logging: false,                    // Desativa o log das queries SQL no console
});

// Importação dos modelos
// Importa os modelos de User, Purchase, Ticket e PurchaseTicket, passando a conexão com o Sequelize e DataTypes
const User = require('./User')(sequelize, DataTypes);
const Purchase = require('./Purchase')(sequelize, DataTypes);
const Ticket = require('./Ticket')(sequelize, DataTypes);
const PurchaseTicket = require('./purchaseTicket')(sequelize, DataTypes);

// Definindo as associações entre os modelos

// Associa o modelo Ticket com Purchase e PurchaseTicket
Ticket.associate({ Purchase, PurchaseTicket });

// Associa o modelo Purchase com Ticket e PurchaseTicket
Purchase.associate({ Ticket, PurchaseTicket });

// Exporta a conexão do Sequelize e os modelos para que possam ser usados em outras partes da aplicação
module.exports = { sequelize, User, Purchase, Ticket, PurchaseTicket };
