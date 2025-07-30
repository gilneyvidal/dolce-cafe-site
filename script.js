//
// Script responsável pela lógica do pedido: popular lista de setores do hospital,
// capturar itens selecionados e montar uma mensagem formatada para envio via
// WhatsApp. O número de telefone de destino é definido abaixo e pode ser
// alterado conforme necessidade.
//

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Definição do cardápio. Cada categoria possui um nome, um conjunto de itens
   * (com nome e preço) e um ícone decorativo associado. O preço é mantido
   * como string para preservar o formato com vírgula.
   */
  const menuData = [
    {
      name: 'Salgados',
      icon: 'salgado.png',
      items: [
        { name: 'Calzone', price: '9,50' },
        { name: 'Coxinha', price: '9,50' },
        { name: 'Croissnat (Pizza | 4 Queijos | Presunto e Queijo)', price: '9,50' },
        { name: 'Esfiha de Carne | Calabresa', price: '9,00' },
        { name: 'Hamburguer C/ Mussarela', price: '11,50' },
        { name: 'Kibe', price: '8,50' },
        { name: 'Pastel De Frango', price: '9,50' },
        { name: 'Pastel Int. Brócolis Ou Ricota', price: '10,00' },
        { name: 'Pão De Batata', price: '8,00' },
        { name: 'Travesseirinho De Queijo', price: '9,00' },
        { name: 'Fohado De Presunto', price: '9,50' },
        { name: 'Pão De Quijo', price: '5,00' },
        { name: 'Lanche Natural', price: '19,00' },
        { name: 'Pão Francês', price: '5,00' },
        { name: 'Mini Pizza', price: '12,50' },
        { name: 'Torta De Frango', price: '11,50' }
      ]
    },
    {
      name: 'Cafeteria',
      icon: 'xicara.png',
      items: [
        { name: 'Café', price: '6,00' },
        { name: 'Cappuccino', price: '10,00' },
        { name: 'Média', price: '8,50' },
        { name: 'Chocolate Quente', price: '10,00' }
      ]
    },
    {
      name: 'Bebidas',
      icon: 'xicara.png',
      items: [
        { name: 'Água De Côco', price: '7,00' },
        { name: 'Água S/ Gás | C/ Gás', price: '5,00' },
        { name: 'Refrigerantes', price: '7,50' },
        { name: 'Chá Gelado Ice Tea', price: '9,50' },
        { name: 'Gatorade', price: '10,50' },
        { name: 'Greem People', price: '15,00' },
        { name: 'Iogurte', price: '5,00' },
        { name: 'Suco Del Vale', price: '8,50' },
        { name: 'Todinho', price: '6,00' },
        { name: 'Tônica', price: '7,50' },
        { name: 'Mini Refri', price: '5,00' },
        { name: 'Chá Quente', price: '6,00' }
      ]
    },
    {
      name: 'Comidinhas',
      icon: 'esfiha.png',
      items: [
        { name: 'Comida Brasileito (Pratos Rapidos)', price: '27,50' },
        { name: 'Cremes', price: '26,50' },
        { name: 'Prato Vegetariano', price: '40,00' },
        { name: 'Salada Verde', price: '25,00' },
        { name: 'Tapioca Básica', price: '7,00' },
        { name: 'Ovo', price: '13,00' }
      ]
    },
    {
      name: 'Doces',
      icon: 'bolo fatia.png',
      items: [
        { name: 'Halls', price: '3,00' },
        { name: 'Trident', price: '4,00' },
        { name: 'Povilho', price: '8,00' },
        { name: 'Bis', price: '7,00' },
        { name: 'Pururuca', price: '5,00' },
        { name: 'Chocolate 34g', price: '6,00' },
        { name: 'Chocolate 90g', price: '13,50' },
        { name: 'Clube Social', price: '3,00' },
        { name: 'Salgadinho 40g', price: '4,00' },
        { name: 'Baton', price: '3,00' },
        { name: 'Suflair', price: '8,50' },
        { name: 'Paçoca', price: '1,20' },
        { name: 'Mix De Nuts', price: '17,00' },
        { name: 'Castanha', price: '17,00' },
        { name: 'Bolacha Recheada Trakinas', price: '7,00' }
      ]
    },
    {
      name: 'Petit Four',
      icon: 'bolo decorado.png',
      items: [
        { name: 'Biscoito Petiti Four', price: '9,00' },
        { name: 'Jujuba', price: '7,00' },
        { name: 'Bolo Pedaço', price: '9,50' },
        { name: 'Torta Holandesa', price: '16,00' },
        { name: 'Bolo Festa', price: '16,00' },
        { name: 'Trufa', price: '5,50' },
        { name: 'Pirulito', price: '14,50' },
        { name: 'Tiramissu', price: '14,50' },
        { name: 'T. Morango E Maçã', price: '11,50' },
        { name: 'Quindim', price: '9,50' },
        { name: 'Donuts', price: '10,50' },
        { name: 'Muffins', price: '9,50' },
        { name: 'Salada De Frutas', price: '16,50' },
        { name: 'Frutas', price: '4,00' }
      ]
    }
  ];

  // Lista de setores que podem ser selecionados no cardápio. Estes setores
  // incluem alguns dos departamentos mais comuns em hospitais gerais,
  // conforme descrito na literatura sobre hospitais【964339475978022†L542-L551】【964339475978022†L552-L554】.
  const sectors = [
    'Emergência',
    'Trauma',
    'Queimados',
    'Cardiologia',
    'UTI (Terapia Intensiva)',
    'Neurologia',
    'Obstetrícia e Ginecologia',
    'Oncologia',
    'Farmácia',
    'Patologia',
    'Radiologia'
  ];

  /**
   * Gera dinamicamente as seções do cardápio de acordo com a estrutura
   * definida em menuData. Cada categoria produz um cartão com título,
   * ícone decorativo e linhas de itens com preço e campo de quantidade.
   */
  function renderMenu() {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = '';

    // Organiza o cardápio em duas colunas para refletir o layout do PDF. A
    // coluna da esquerda conterá Salgados, Comidinhas e Doces; a coluna da
    // direita conterá Cafeteria, Bebidas e Petit Four. Cada categoria
    // aparece empilhada dentro da sua coluna.
    const leftCategories = ['Salgados', 'Comidinhas', 'Doces'];
    const rightCategories = ['Cafeteria', 'Bebidas', 'Petit Four'];

    // Função auxiliar que cria um bloco de categoria (título + itens).
    function createCategoryBlock(catName) {
      const category = menuData.find(cat => cat.name === catName);
      if (!category) return null;
      const block = document.createElement('div');
      block.className = 'category-block';
      // Cabeçalho
      const h3 = document.createElement('h3');
      const iconImg = document.createElement('img');
      iconImg.src = `images/${category.icon}`;
      iconImg.alt = '';
      iconImg.className = 'category-icon';
      const titleSpan = document.createElement('span');
      titleSpan.textContent = category.name;
      h3.appendChild(iconImg);
      h3.appendChild(titleSpan);
      block.appendChild(h3);
      // Lista de itens
      const itemList = document.createElement('div');
      itemList.className = 'category-items';
      category.items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'menu-row';
        // Nome
        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        // Preço
        const priceSpan = document.createElement('span');
        priceSpan.textContent = `R$ ${item.price}`;
        // Quantidade
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = '0';
        qtyInput.value = '0';
        qtyInput.className = 'item-qty';
        qtyInput.dataset.itemName = item.name;
        qtyInput.dataset.itemPrice = item.price;
        row.appendChild(nameSpan);
        row.appendChild(priceSpan);
        row.appendChild(qtyInput);
        itemList.appendChild(row);
      });
      block.appendChild(itemList);
      return block;
    }

    // Cria as duas colunas do cardápio
    const leftCol = document.createElement('div');
    leftCol.className = 'menu-col';
    leftCategories.forEach(name => {
      const block = createCategoryBlock(name);
      if (block) leftCol.appendChild(block);
      // Espaço para futuras inserções decorativas na coluna esquerda (caso desejado)
      /* if (name === 'Comidinhas') {
        // Inserir imagens decorativas aqui, se necessário.
      } */
    });
    // Elemento decorativo no rodapé da coluna esquerda (por exemplo, saleiro)
    const leftBottomDecor = document.createElement('div');
    leftBottomDecor.className = 'decor-bottom';
    const saleiroImg = document.createElement('img');
    saleiroImg.src = 'images/saleiro.png';
    saleiroImg.alt = '';
    saleiroImg.className = 'decor-image';
    leftBottomDecor.appendChild(saleiroImg);
    leftCol.appendChild(leftBottomDecor);

    // Cria coluna da direita
    const rightCol = document.createElement('div');
    rightCol.className = 'menu-col';
    rightCategories.forEach(name => {
      const block = createCategoryBlock(name);
      if (block) rightCol.appendChild(block);
      // Após a categoria Cafeteria, insere imagens decorativas no meio da coluna direita
      if (name === 'Cafeteria') {
        const midDecor = document.createElement('div');
        midDecor.className = 'decor-middle';
        // Primeira fila: rocambole e rosquinha
        const row1 = document.createElement('div');
        const rocamboleImg = document.createElement('img');
        rocamboleImg.src = 'images/rocambole.png';
        rocamboleImg.alt = '';
        rocamboleImg.className = 'decor-image';
        const rosquinhaImg = document.createElement('img');
        rosquinhaImg.src = 'images/rosquinha.png';
        rosquinhaImg.alt = '';
        rosquinhaImg.className = 'decor-image';
        row1.appendChild(rocamboleImg);
        row1.appendChild(rosquinhaImg);
        row1.style.display = 'flex';
        row1.style.justifyContent = 'center';
        row1.style.gap = '20px';
        midDecor.appendChild(row1);
        // Segunda fila: xícara de café
        const row2 = document.createElement('div');
        const xicaraImg = document.createElement('img');
        xicaraImg.src = 'images/xicara.png';
        xicaraImg.alt = '';
        xicaraImg.className = 'decor-image';
        row2.appendChild(xicaraImg);
        row2.style.display = 'flex';
        row2.style.justifyContent = 'center';
        row2.style.marginTop = '10px';
        midDecor.appendChild(row2);
        rightCol.appendChild(midDecor);
      }
    });
    // Elemento decorativo no rodapé da coluna direita (por exemplo, torta doce)
    const rightBottomDecor = document.createElement('div');
    rightBottomDecor.className = 'decor-bottom';
    const tortaImg = document.createElement('img');
    tortaImg.src = 'images/torta doce.png';
    tortaImg.alt = '';
    tortaImg.className = 'decor-image';
    rightBottomDecor.appendChild(tortaImg);
    rightCol.appendChild(rightBottomDecor);

    menuContainer.appendChild(leftCol);
    menuContainer.appendChild(rightCol);
  }

  // Renderiza o cardápio ao carregar a página
  renderMenu();

  // Preenche o campo de seleção de setor com as opções acima.
  const sectorSelect = document.getElementById('customerSector');
  sectors.forEach(sector => {
    const option = document.createElement('option');
    option.value = sector;
    option.textContent = sector;
    sectorSelect.appendChild(option);
  });

  // Manipulador de envio do formulário. Constrói a mensagem de WhatsApp com
  // base nos itens selecionados e nos dados do cliente.
  const orderForm = document.getElementById('orderForm');
  orderForm.addEventListener('submit', event => {
    event.preventDefault();
    // Recupera os inputs de quantidade e calcula o valor total do pedido
    const qtyInputs = document.querySelectorAll('.item-qty');
    const orderLines = [];
    let totalOrder = 0;
    qtyInputs.forEach(input => {
      const qty = parseInt(input.value, 10);
      if (qty && qty > 0) {
        const name = input.dataset.itemName;
        const priceStr = input.dataset.itemPrice; // string formatada com vírgula
        // Converte a string de preço (ex.: "9,50") para número
        const priceNum = parseFloat(priceStr.replace(',', '.'));
        const itemTotal = priceNum * qty;
        totalOrder += itemTotal;
        // Formata o total do item para string com vírgula
        const itemTotalStr = itemTotal.toFixed(2).replace('.', ',');
        // Linha com nome, quantidade, preço unitário e total do item
        orderLines.push(`${name}: ${qty} x R$ ${priceStr} = R$ ${itemTotalStr}`);
      }
    });
    // Garante que pelo menos um item foi selecionado.
    if (orderLines.length === 0) {
      alert('Selecione pelo menos um item do cardápio.');
      return;
    }
    // Coleta os dados do cliente.
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerRoom = document.getElementById('customerRoom').value.trim();
    const customerSector = document.getElementById('customerSector').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const consumptionType = document.getElementById('consumptionType').value;
    // Formata o valor total do pedido
    const totalStr = totalOrder.toFixed(2).replace('.', ',');
    // Formata a mensagem a ser enviada via WhatsApp, incluindo valor total e tipo de serviço.
    const message =
      `Olá, gostaria de fazer um pedido:\n\n` +
      `Itens selecionados:\n${orderLines.join('\n')}\n\n` +
      `Total do pedido: R$ ${totalStr}\n\n` +
      `Nome: ${customerName}\n` +
      `Telefone: ${customerPhone}\n` +
      `Quarto: ${customerRoom}\n` +
      `Setor: ${customerSector}\n` +
      `Forma de pagamento: ${paymentMethod}\n` +
      `Serviço: ${consumptionType}`;
    // Número do WhatsApp de destino (DDI + DDD + número, sem caracteres especiais)
    const whatsappNumber = '5511982544973';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  });
});