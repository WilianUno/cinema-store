if (!API.Auth.isAuthenticated()) {
  window.location.href = '/login.html';
}

const userRole = localStorage.getItem('userRole');
if (userRole !== 'admin') {
  API.Utils.showToast('Acesso restrito a administradores', 'error');
  setTimeout(() => {
    window.location.href = '/catalogo';
  }, 1500);
}

const modal = document.getElementById('modal-filme');
const btnAddFilme = document.getElementById('btn-add-filme');
const closeBtn = document.querySelector('.close');
const formFilme = document.getElementById('form-filme');

btnAddFilme.addEventListener('click', () => {
  modal.style.display = 'block';
  formFilme.reset();
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

const adminLinks = document.querySelectorAll('.admin-link');
const adminTabs = document.querySelectorAll('.admin-tab');

adminLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tabName = link.getAttribute('data-tab');
    
    adminLinks.forEach(l => l.classList.remove('active'));
    adminTabs.forEach(t => t.classList.remove('active'));
    
    link.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  });
});

async function loadFilmes() {
  try {
    const movies = await API.Movie.getAll();
    const tbody = document.getElementById('filmes-list');
    
    if (!movies || movies.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Nenhum filme cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = movies.map(movie => `
      <tr>
        <td>${movie.id}</td>
        <td>${movie.titulo}</td>
        <td>${movie.genero}</td>
        <td>${API.Utils.formatPrice(movie.preco)}</td>
        <td>
          <button class="btn-edit" onclick="editFilme(${movie.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-delete" onclick="deleteFilme(${movie.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    API.Utils.showToast('Erro ao carregar filmes', 'error');
  }
}

async function loadUsuarios() {
  try {
    const users = await fetch('http://localhost:3000/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(r => r.json());

    const tbody = document.getElementById('usuarios-list');
    
    if (!users || users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">Nenhum usuário cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${API.Utils.formatDate(user.data_criacao)}</td>
        <td>
          <button class="btn-delete" onclick="deleteUsuario(${user.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    document.getElementById('usuarios-list').innerHTML = '<tr><td colspan="6">Erro ao carregar usuários</td></tr>';
  }
}

async function loadVendas() {
  try {
    const vendas = await fetch('http://localhost:3000/api/vendas', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(r => r.json());

    const stats = await fetch('http://localhost:3000/api/vendas/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(r => r.json());

    if (stats) {
      document.getElementById('total-vendas').textContent = API.Utils.formatPrice(stats.total);
      document.getElementById('total-pedidos').textContent = stats.pedidos;
      document.getElementById('total-clientes').textContent = stats.clientes;
    }

    const tbody = document.getElementById('vendas-list');
    
    if (!vendas || vendas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Nenhuma venda registrada</td></tr>';
      return;
    }

    tbody.innerHTML = vendas.map(venda => `
      <tr>
        <td>${venda.id}</td>
        <td>${venda.usuario_nome || 'Desconhecido'}</td>
        <td>${API.Utils.formatPrice(venda.total)}</td>
        <td>${API.Utils.formatDate(venda.data_compra)}</td>
        <td>${venda.status}</td>
      </tr>
    `).join('');
  } catch (error) {
    document.getElementById('vendas-list').innerHTML = '<tr><td colspan="5">Erro ao carregar vendas</td></tr>';
  }
}

formFilme.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const filmeData = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    genero: document.getElementById('genero').value,
    preco: parseFloat(document.getElementById('preco').value),
    duracao: parseInt(document.getElementById('duracao').value),
    ano: parseInt(document.getElementById('ano').value),
  };

  try {
    await fetch('http://localhost:3000/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(filmeData)
    });

    API.Utils.showToast('Filme adicionado com sucesso!', 'success');
    modal.style.display = 'none';
    loadFilmes();
  } catch (error) {
    API.Utils.showToast('Erro ao adicionar filme', 'error');
  }
});

function deleteFilme(id) {
  if (confirm('Tem certeza que deseja deletar este filme?')) {
    fetch(`http://localhost:3000/api/movies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(() => {
      API.Utils.showToast('Filme removido com sucesso!', 'success');
      loadFilmes();
    }).catch(error => {
      API.Utils.showToast('Erro ao deletar filme', 'error');
    });
  }
}

function deleteUsuario(id) {
  if (confirm('Tem certeza que deseja deletar este usuário?')) {
    fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(() => {
      API.Utils.showToast('Usuário removido com sucesso!', 'success');
      loadUsuarios();
    }).catch(error => {
      API.Utils.showToast('Erro ao deletar usuário', 'error');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFilmes();
  loadUsuarios();
  loadVendas();
});
