const jwt = require('jsonwebtoken');  // Importando a biblioteca para manipulação de tokens JWT

// Middleware de autenticação
exports.authenticate = (req, res, next) => {
  // Verifica o token de autenticação nos cookies
  const token = req.cookies.auth_token;

  // Se o token não for encontrado, retorna um erro de não autorizado (401)
  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado, por favor faça login.' });
  }

  try {
    // Tenta verificar e decodificar o token usando a chave secreta definida no arquivo .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Se o token for válido, armazena as informações do usuário no objeto `req` para uso posterior
    req.user = decoded;
    
    // Chama o próximo middleware ou a próxima função na rota
    next();  
  } catch (error) {
    // Se ocorrer algum erro ao verificar o token (por exemplo, token expirado ou inválido),
    // retorna um erro de autenticação (401)
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

// Middleware para verificar se o usuário é administrador
exports.isAdmin = (req, res, next) => {
  // Verifica se o tipo de usuário armazenado no `req.user` é 'admin'
  if (req.user.tipo !== 'admin') {
    // Se o usuário não for administrador, retorna um erro 403 (acesso restrito)
    return res.status(403).json({ message: 'Acesso restrito a administradores.' });
  }
  // Se for administrador, permite o acesso e chama o próximo middleware ou a próxima função na rota
  next();
};


