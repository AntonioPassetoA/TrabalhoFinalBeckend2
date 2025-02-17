const { User } = require('../models');  // Certifique-se de que você está importando o modelo User corretamente
const bcrypt = require('bcryptjs');  // Biblioteca para criptografar a senha
const jwt = require('jsonwebtoken');  // Biblioteca para criar tokens JWT

// Função para registrar o usuário
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;  // Recebe os dados enviados pelo usuário (nome, email, senha)

  try {
    // Verifica se o usuário já existe no banco de dados, procurando pelo e-mail
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      // Se o e-mail já estiver cadastrado, retorna um erro
      return res.status(400).json({ message: 'E-mail já cadastrado!' });
    }

    // Criptografa a senha do usuário antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(senha, 10);  // Criptografando a senha com o salt de 10

    // Cria um novo usuário com as informações fornecidas (nome, email e senha criptografada)
    const user = await User.create({ nome, email, senha: hashedPassword });

    // Após o cadastro, redireciona o usuário para a página de login
    res.redirect('/auth/login');
  } catch (error) {
    // Se ocorrer algum erro durante o processo de registro, retorna um erro 500
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
};

// Função para login do usuário
exports.login = async (req, res) => {
  const { email, senha } = req.body;  // Recebe o e-mail e a senha fornecidos pelo usuário

  try {
    // Verifica se o usuário existe no banco de dados pelo e-mail
    const usuario = await User.findOne({ where: { email } });

    // Se o usuário não for encontrado, retorna um erro
    if (!usuario) {
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    // Verifica se a senha fornecida corresponde à senha armazenada no banco de dados
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      // Se a senha não for válida, retorna um erro
      return res.status(400).json({ message: 'E-mail ou senha inválidos' });
    }

    // Se a senha for correta, gera um token JWT com as informações do usuário (id e e-mail)
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Armazena o token no cookie para ser utilizado em futuras requisições (seguro com httpOnly)
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });  // O cookie expira em 1 hora (3600000 ms)

    // Após o login bem-sucedido, redireciona o usuário para a página de vendas
    res.redirect('/vendas');
  } catch (error) {
    // Se ocorrer um erro durante o login, retorna um erro 500
    console.error('Erro ao tentar fazer login:', error);
    res.status(500).json({ message: 'Erro ao tentar fazer login.' });
  }
};
