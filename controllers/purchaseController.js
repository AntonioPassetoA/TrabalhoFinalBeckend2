const { Purchase, Ticket } = require('../models');

// Função para exibir a página de vendas com os preços
exports.showSalesPage = (req, res) => {
  // Preços dos ingressos
  const prices = {
    VIP: 50,  // Preço do ingresso VIP
    Normal: 20  // Preço do ingresso Normal
  };

  // Passa os preços para o template (página de vendas)
  res.render('vendas', { prices });
};

// Função para confirmar a compra
exports.createPurchase = async (req, res) => {
  const { vip, normal } = req.body;  // Recebe a quantidade de ingressos VIP e Normais selecionados

  // Verifica se algum ingresso foi selecionado
  if (!vip && !normal) {
    return res.status(400).json({ message: 'Nenhum ingresso selecionado para compra.' });
  }

  try {
    // Cria a compra para o usuário autenticado com status 'pendente'
    const purchase = await Purchase.create({ usuarioId: req.user.id, status: 'pendente' });

    // Se houver ingressos VIP
    if (vip > 0) {
      const ticketVIP = await Ticket.findOne({ where: { nome: 'VIP' } });  // Busca o ingresso VIP no banco de dados
      const totalPriceVIP = ticketVIP.preco * vip;  // Calcula o total para o ingresso VIP

      // Verifica se há estoque suficiente para o ingresso VIP
      if (ticketVIP.quantidadeDisponivel < vip) {
        return res.status(400).json({ message: 'Estoque insuficiente para o ingresso VIP.' });
      }

      // Associa o ingresso VIP à compra e atualiza o estoque
      await purchase.addTicket(ticketVIP, { through: { quantidade: vip } });
      await ticketVIP.update({ quantidadeDisponivel: ticketVIP.quantidadeDisponivel - vip });
    }

    // Se houver ingressos Normais
    if (normal > 0) {
      const ticketNormal = await Ticket.findOne({ where: { nome: 'Normal' } });  // Busca o ingresso Normal no banco de dados
      const totalPriceNormal = ticketNormal.preco * normal;  // Calcula o total para o ingresso Normal

      // Verifica se há estoque suficiente para o ingresso Normal
      if (ticketNormal.quantidadeDisponivel < normal) {
        return res.status(400).json({ message: 'Estoque insuficiente para o ingresso Normal.' });
      }

      // Associa o ingresso Normal à compra e atualiza o estoque
      await purchase.addTicket(ticketNormal, { through: { quantidade: normal } });
      await ticketNormal.update({ quantidadeDisponivel: ticketNormal.quantidadeDisponivel - normal });
    }

    // Após o processo de compra, redireciona para a página de confirmação
    res.redirect(`/confirmacaoCompra/${purchase.id}`);
  } catch (error) {
    console.error('Erro ao confirmar a compra:', error.message);  // Adicionando a mensagem de erro para depuração
    res.status(500).json({ message: 'Erro ao confirmar a compra' });
  }
};

// Função para listar as compras do usuário
exports.getPurchaseHistory = async (req, res) => {
  try {
    // Recupera as compras do usuário logado
    const purchases = await Purchase.findAll({
      where: { usuarioId: req.user.id },
      include: [{
        model: Ticket,
        through: { attributes: ['quantidade'] },  // Inclui a quantidade de ingressos comprados
      }],
    });

    // Exibe no console a última compra do usuário
    console.log(purchases[purchases.length - 1].Tickets[0]);

    // Renderiza a página de histórico de compras com as compras do usuário
    res.render('historico', { purchases });
  } catch (error) {
    console.error('Erro ao buscar histórico de compras:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico de compras' });
  }
};

// Função para confirmar a compra
exports.confirmPurchase = async (req, res) => {
  const { purchaseId } = req.params;  // Recebe o ID da compra a ser confirmada

  try {
    const purchase = await Purchase.findByPk(purchaseId);  // Busca a compra pelo ID

    if (!purchase) {
      return res.status(404).json({ message: 'Compra não encontrada.' });
    }

    // Atualiza o status da compra para 'confirmada'
    purchase.status = 'confirmada';
    await purchase.save();  // Salva a alteração no banco de dados

    // Redireciona para o histórico de compras após confirmar a compra
    res.redirect('/historico');
  } catch (error) {
    console.error('Erro ao confirmar a compra:', error);
    res.status(500).json({ message: 'Erro ao confirmar a compra' });
  }
};

// Função para cancelar a compra
exports.cancelPurchase = async (req, res) => {
  const { purchaseId } = req.params;  // Recebe o ID da compra a ser cancelada

  try {
    const purchase = await Purchase.findByPk(purchaseId);  // Busca a compra pelo ID

    if (!purchase) {
      return res.status(404).json({ message: 'Compra não encontrada.' });
    }

    // Atualiza o status da compra para 'cancelada'
    purchase.status = 'cancelada';
    await purchase.save();  // Salva a alteração no banco de dados

    // Redireciona para o histórico de compras após cancelar a compra
    res.redirect('/historico');
  } catch (error) {
    console.error('Erro ao cancelar a compra:', error);
    res.status(500).json({ message: 'Erro ao cancelar a compra' });
  }
};

// Função para exibir os detalhes da compra confirmada
exports.showConfirmPurchase = async (req, res) => {
  // Recupera os detalhes da compra com os ingressos e suas quantidades
  const purchase = await Purchase.findOne({
    where: { id: req.params.purchaseId },
    include: [{
      model: Ticket,
      through: { attributes: ['quantidade'] },
    }]
  });

  // Prepara os detalhes dos ingressos comprados
  const ticketDetails = purchase.Tickets.map(ticket => {
    return {
      nome: ticket.dataValues.nome,  // Nome do ingresso
      preco: ticket.dataValues.preco,  // Preço do ingresso
      quantidade: ticket.PurchaseTicket.dataValues.quantidade,  // Quantidade comprada
      total: ticket.dataValues.preco * ticket.PurchaseTicket.dataValues.quantidade  // Total de cada tipo de ingresso
    };
  });

  // Calcula o valor total dos ingressos
  const valorTotalIngressos = ticketDetails.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);

  // Renderiza a página de confirmação de compra com os detalhes
  res.render('confirmacaoCompra', { ticketDetails, valorTotalIngressos, purchaseId: req.params.purchaseId });
};
