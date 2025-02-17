// Middleware para verificar se o usuário é administrador
exports.isAdmin = (req, res, next) => {
  // Verifica se o tipo de usuário no objeto `req.user` é 'admin'
  if (req.user.tipo !== 'admin') {
    // Se não for um administrador, retorna um erro 403 (acesso restrito)
    return res.status(403).json({ message: 'Acesso restrito a administradores.' });
  }

  // Se for um administrador, o controle é passado para a próxima função
  // (geralmente, o controlador que processa a requisição)
  next();  
};
