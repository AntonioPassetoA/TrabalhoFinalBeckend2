const jwt = require('jsonwebtoken');  // Biblioteca usada para gerar e verificar tokens JWT
const SECRET_KEY = process.env.JWT_SECRET;  // Use a chave secreta do arquivo .env

// Middleware para autenticação do usuário com JWT
const authenticate = (req, res, next) => {
  // Tenta pegar o token da requisição, seja dos cookies ou do cabeçalho Authorization
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];  

  // Se o token não foi encontrado, retorna um erro 401 (não autorizado)
  if (!token) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }

  try {
    // Verifica e decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;  // Armazena os dados do usuário (decodificados) no objeto `req` para uso posterior

    // Chama a próxima função no middleware (por exemplo, o controlador que processa a requisição)
    next();  
  } catch (error) {
    // Se ocorrer um erro durante a verificação do token (por exemplo, token inválido ou expirado)
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = { authenticate };  // Exporta o middleware para ser utilizado em outras partes da aplicação
