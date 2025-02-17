module.exports = (sequelize, DataTypes) => {
  // Define o modelo 'Purchase', representando a tabela 'Purchase' no banco de dados
  const Purchase = sequelize.define('Purchase', {
    
    // 'usuarioId' é a chave estrangeira para o usuário que fez a compra
    usuarioId: {
      type: DataTypes.INTEGER,  // Tipo de dado inteiro para armazenar o ID do usuário
      allowNull: false,         // Não permite valores nulos para esta coluna
    },
  });

  // Retorna o modelo 'Purchase' para ser utilizado em outras partes da aplicação
  return Purchase;
};

module.exports = (sequelize, DataTypes) => {
  // Define o modelo 'Ticket', representando a tabela 'Ticket' no banco de dados
  const Ticket = sequelize.define('Ticket', {
    
    // 'nome' é o nome do ingresso, por exemplo, 'VIP' ou 'Normal'
    nome: {
      type: DataTypes.STRING,  // Tipo de dado string para armazenar o nome do ingresso
      allowNull: false,        // Não permite valores nulos
    },

    // 'preco' é o preço do ingresso
    preco: {
      type: DataTypes.DECIMAL, // Tipo de dado decimal para armazenar o preço do ingresso
      allowNull: false,        // Não permite valores nulos
    },

    // 'quantidadeDisponivel' indica quantos ingressos desse tipo estão disponíveis
    quantidadeDisponivel: {
      type: DataTypes.INTEGER,  // Tipo de dado inteiro para armazenar a quantidade disponível
      allowNull: false,         // Não permite valores nulos
    },
  });

  // Definindo as associações entre 'Ticket' e 'Purchase'
  Ticket.associate = (models) => {
    // Relacionamento muitos-para-muitos entre 'Ticket' e 'Purchase' através da tabela intermediária 'PurchaseTicket'
    Ticket.belongsToMany(models.Purchase, {
      through: models.PurchaseTicket,  // Tabela intermediária que associa 'Ticket' e 'Purchase'
      foreignKey: 'ticketId',          // Chave estrangeira para 'Ticket' na tabela intermediária
      otherKey: 'purchaseId',          // Chave estrangeira para 'Purchase' na tabela intermediária
    });
  };

  // Retorna o modelo 'Ticket' para ser utilizado em outras partes da aplicação
  return Ticket;
};

