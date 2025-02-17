// Função para exibir a página de vendas
exports.showSalesPage = (req, res) => {
  // Preços dos ingressos definidos
  const prices = {
    VIP: 50,  // Preço do ingresso VIP
    Normal: 20  // Preço do ingresso Normal
  };

  // Renderiza a página de vendas e passa os preços para o template
  res.render('vendas', { prices });
};

// Função para exibir a confirmação da compra
exports.showPurchaseConfirmation = (req, res) => {
  // Recebe as quantidades de ingressos VIP e Normal selecionados pelo usuário
  const { vip, normal } = req.body;
  
  // Preços definidos novamente (poderiam ser passados como argumento, se necessário)
  const prices = {
    VIP: 50,
    Normal: 20
  };

  // Array para armazenar os detalhes dos ingressos
  const ticketDetails = [];
  let totalVIP = 0;
  let totalNormal = 0;

  // Verifica se o usuário selecionou ingressos VIP e calcula o total
  if (vip && vip > 0) {
    ticketDetails.push({
      nome: 'VIP',
      preco: prices.VIP,
      quantidade: vip,
      total: prices.VIP * vip
    });
    totalVIP = prices.VIP * vip;  // Calcula o valor total dos ingressos VIP
  }

  // Verifica se o usuário selecionou ingressos Normais e calcula o total
  if (normal && normal > 0) {
    ticketDetails.push({
      nome: 'Normal',
      preco: prices.Normal,
      quantidade: normal,
      total: prices.Normal * normal
    });
    totalNormal = prices.Normal * normal;  // Calcula o valor total dos ingressos Normais
  }

  // Calcula o valor total da compra (VIP + Normal)
  const total = totalVIP + totalNormal;

  // Renderiza a página de confirmação da compra com os detalhes dos ingressos e o valor total
  res.render('confirmacaoCompra', { ticketDetails, total });
};

// Função para confirmar a compra
exports.confirmPurchase = (req, res) => {
  // Aqui, a lógica de confirmação de compra seria implementada (ex: salvar a compra no banco de dados)
  // Neste caso, a função simula a confirmação da compra.
  res.redirect('/vendas');  // Após a confirmação, redireciona o usuário para a página de vendas
};

// Função para cancelar a compra
exports.cancelPurchase = (req, res) => {
  // Cancela a compra e redireciona o usuário para a página de vendas
  res.redirect('/vendas');
};
