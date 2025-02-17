module.exports = (sequelize, DataTypes) => {
  // Define o modelo 'Purchase' que representa uma tabela no banco de dados
  const Purchase = sequelize.define('Purchase', {
    // Definição da coluna 'usuarioId', que é obrigatória e do tipo inteiro
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,  // A coluna não pode ser nula
    },
    // Definição da coluna 'status', que tem um valor padrão de 'realizada' e não pode ser nula
    status: {
      type: DataTypes.STRING,
      defaultValue: 'realizada',  // A compra começa com status 'realizada'
      allowNull: false  // A coluna não pode ser nula
    }
  });
  
  // Associações entre o modelo 'Purchase' e outros modelos
  Purchase.associate = (models) => {
    // Relacionamento muitos-para-muitos entre 'Purchase' e 'Ticket' através da tabela intermediária 'PurchaseTicket'
    Purchase.belongsToMany(models.Ticket, {
      through: models.PurchaseTicket,  // Define a tabela intermediária 'PurchaseTicket'
      foreignKey: 'purchaseId',        // A chave estrangeira no modelo 'PurchaseTicket' para 'Purchase'
      otherKey: 'ticketId'             // A chave estrangeira no modelo 'PurchaseTicket' para 'Ticket'
    });
  };

  // Retorna o modelo 'Purchase' para que possa ser usado em outras partes da aplicação
  return Purchase;
};
