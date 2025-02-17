module.exports = (sequelize, DataTypes) => {
  // Define o modelo 'User', representando a tabela 'User' no banco de dados
  const User = sequelize.define('User', {
    
    // 'nome' é o nome do usuário
    nome: {
      type: DataTypes.STRING,  // Tipo de dado string para armazenar o nome do usuário
      allowNull: false,        // Não permite valores nulos para esta coluna
    },

    // 'email' é o endereço de e-mail do usuário
    email: {
      type: DataTypes.STRING,  // Tipo de dado string para armazenar o e-mail
      unique: true,            // Garante que o e-mail seja único no banco de dados
      allowNull: false,        // Não permite valores nulos para esta coluna
    },

    // 'senha' é a senha do usuário
    senha: {
      type: DataTypes.STRING,  // Tipo de dado string para armazenar a senha
      allowNull: false,        // Não permite valores nulos para esta coluna
    }
  });

  // Retorna o modelo 'User' para ser utilizado em outras partes da aplicação
  return User;
};
