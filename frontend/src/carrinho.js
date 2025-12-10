if (!API.Auth.isAuthenticated()) {
  API.Utils.showToast('Faça login para acessar o carrinho', 'error');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 1500);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadCart();
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = '/checkout.html';
    });
  }
});

async function loadCart() {
  try {
    const cart = await API.Cart.get();
    
    if (!cart.items || cart.items.length === 0) {
      document.getElementById('conteudo-carrinho').style.display = 'none';
      document.getElementById('carrinho-vazio').style.display = 'block';
      return;
    }

    renderCartItems(cart.items);
    updateCartTotals(cart.items);

  } catch (error) {
    API.Utils.showToast('Erro ao carregar carrinho', 'error');
  }
}

function renderCartItems(items) {
  const tbody = document.getElementById('itens-carrinho');
  
  tbody.innerHTML = items.map(item => `
    <tr data-item-id="${item.item_id}">
      <td>
        <div class="filme-info">
          <img src="${item.capa_url || 'https://via.placeholder.com/50x75?text=Sem+Imagem'}" alt="${item.titulo}">
          <span>${item.titulo}</span>
        </div>
      </td>
      <td>${API.Utils.formatPrice(item.preco)}</td>
      <td>
        <div class="quantidade">
          <button class="btn-menos" data-item-id="${item.item_id}">−</button>
          <span class="qty">${item.quantidade}</span>
          <button class="btn-mais" data-item-id="${item.item_id}">+</button>
        </div>
      </td>
      <td>${API.Utils.formatPrice(item.preco * item.quantidade)}</td>
      <td>
        <button class="remover" data-item-id="${item.item_id}" title="Remover item">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');

  attachCartEvents();
}

function updateCartTotals(items) {
  let subtotal = 0;
  
  items.forEach(item => {
    subtotal += item.preco * item.quantidade;
  });

  const taxa = subtotal * 0.1;
  const total = subtotal + taxa;

  document.getElementById('subtotal').textContent = API.Utils.formatPrice(subtotal);
  document.getElementById('taxa').textContent = API.Utils.formatPrice(taxa);
  document.getElementById('total').textContent = API.Utils.formatPrice(total);
}

function attachCartEvents() {
  document.querySelectorAll('.btn-mais').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const itemId = e.target.dataset.itemId;
      const qtySpan = e.target.previousElementSibling;
      const newQty = parseInt(qtySpan.textContent) + 1;
      
      await updateItemQuantity(itemId, newQty);
    });
  });

  document.querySelectorAll('.btn-menos').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const itemId = e.target.dataset.itemId;
      const qtySpan = e.target.nextElementSibling;
      const newQty = parseInt(qtySpan.textContent) - 1;
      
      if (newQty > 0) {
        await updateItemQuantity(itemId, newQty);
      } else {
        await removeItem(itemId);
      }
    });
  });

  document.querySelectorAll('.remover').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const itemId = e.currentTarget.dataset.itemId;
      await removeItem(itemId);
    });
  });
}

async function updateItemQuantity(itemId, quantity) {
  try {
    await API.Cart.update(itemId, quantity);
    API.Utils.showToast('Quantidade atualizada', 'success');
    await loadCart();
    updateCartCount();
  } catch (error) {
    API.Utils.showToast('Erro ao atualizar quantidade', 'error');
  }
}

async function removeItem(itemId) {
  try {
    await API.Cart.remove(itemId);
    API.Utils.showToast('Item removido do carrinho', 'success');
    await loadCart();
    updateCartCount();
  } catch (error) {
    API.Utils.showToast('Erro ao remover item', 'error');
  }
}

async function updateCartCount() {
  try {
    const count = await API.Cart.getCount();
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  } catch (error) {}
}
