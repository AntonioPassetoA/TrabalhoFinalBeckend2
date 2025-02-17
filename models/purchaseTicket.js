module.exports = (sequelize, DataTypes) => {
  // Define o modelo 'PurchaseTicket' que representa a tabela intermediária no relacionamento muitos-para-muitos
  const PurchaseTicket = sequelize.define('PurchaseTicket', {
    
    // 'purchaseId' é a chave estrangeira para a tabela 'Purchases', indicando a qual compra o ingresso pertence
    purchaseId: {
      type: DataTypes.INTEGER,  // Tipo de dado inteiro para armazenar o ID da compra
      allowNull: false,  // Não permite valores nulos para esta coluna
      references: {
        model: 'Purchases',  // A referência é para a tabela 'Purchases'
        key: 'id',  // A chave primária da tabela 'Purchases' que é a chave estrangeira aqui
      },
    },

    // 'ticketId' é a chave estrangeira para a tabela 'Tickets', indicando qual ingresso foi comprado
    ticketId: {
      type: DataTypes.INTEGER,  // Tipo de dado inteiro para armazenar o ID do ingresso
      allowNull: false,  // Não permite valores nulos para esta coluna
      references: {
        model: 'Tickets',  // A referência é para a tabela 'Tickets'
        key: 'id',  // A chave primária da tabela 'Tickets' que é a chave estrangeira aqui
      },
    },

    // 'quantidade' indica a quantidade de ingressos comprados para esta entrada
    quantidade: {
      type: DataTypes.INTEGER,  // Tipo de dado inteiro para armazenar a quantidade
      allowNull: false,  // Não permite valores nulos para esta coluna
      defaultValue: 1,  // Define o valor padrão como 1 (caso o usuário não forneça)
    },
  });

  // Retorna o modelo 'PurchaseTicket' para que ele possa ser utilizado em outras partes da aplicação
  return PurchaseTicket;
};
