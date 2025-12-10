function createElement(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content) el.innerHTML = content;
  return el;
}

function loadHeader() {
  const container = document.getElementById("site-header");
  if (!container) return;

  const header = createElement("header", "navbar");
  const navContainer = createElement("div", "navbar-container");

  const logo = createElement("div", "logo");
  logo.innerHTML = `<i class="fas fa-film"></i><span>CineCasa</span>`;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => window.location.href = '/inicio.html');

  const navMenu = createElement("nav", "nav-menu");
  
  const isLoggedIn = API.Auth.isAuthenticated();
  const userName = localStorage.getItem('usuarioLogado');

  navMenu.innerHTML = `
    <a href="inicio.html#filmes" class="nav-link">Novidades</a>
    <a href="inicio.html#breve" class="nav-link">Em breve</a>
    <a href="catalogo.html" class="nav-link signup-btn">Catálogo</a>
    <a href="carrinho.html" class="nav-link cart-link">
      <i class="fa-solid fa-cart-shopping"></i>
      <span class="cart-badge">0</span>
    </a>
    ${isLoggedIn 
      ? `
        <div class="user-menu">
          <span class="user-name">${userName || 'Usuário'}</span>
          <button class="nav-link logout-btn">Sair</button>
        </div>
      `
      : `<a href="login.html" class="nav-link login-btn">Entrar</a>`
    }
  `;

  const hamb = createElement("div", "hamburger");
  hamb.innerHTML = "<span></span><span></span><span></span>";

  navContainer.appendChild(logo);
  navContainer.appendChild(navMenu);
  navContainer.appendChild(hamb);

  header.appendChild(navContainer);
  container.appendChild(header);

  initMenuEvents();
  
  if (isLoggedIn) {
    updateCartCount();
  }

  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      API.Auth.logout();
    });
  }
}

function initMenuEvents() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
    });
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.style.display = "none";
    });
  });
}

async function loadMovies(container = '.filmes-grid', filter = null) {
  try {
    const gridElement = document.querySelector(container);
    if (!gridElement) return;

    gridElement.innerHTML = '<div class="loading">Carregando filmes...</div>';

    let movies;
    if (filter === 'featured') {
      movies = await API.Movie.getFeatured();
    } else if (filter === 'upcoming') {
      movies = await API.Movie.getUpcoming();
    } else {
      movies = await API.Movie.getAll();
    }

    renderMovies(movies, gridElement);
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    const gridElement = document.querySelector(container);
    if (gridElement) {
      gridElement.innerHTML = '<p class="error-message">Erro ao carregar filmes. Tente novamente.</p>';
    }
  }
}

function renderMovies(movies, container) {
  if (!movies || movies.length === 0) {
    container.innerHTML = '<p class="no-movies">Nenhum filme disponível no momento.</p>';
    return;
  }

  container.innerHTML = movies.map(movie => {
    const titulo = movie.titulo || movie.title || 'Filme sem título';
    const capa = movie.capa_url || movie.poster || 'https://via.placeholder.com/300x450?text=Sem+Poster';
    const genero = movie.genero || movie.genre || 'N/A';
    const duracao = movie.duracao || movie.duration || 0;
    const preco = movie.preco || movie.price || 0;
    const rating = movie.rating || 3.5;
    
    return `
      <div class="filme-card" data-id="${movie.id}">
        <div class="filme-poster" style="background-image: url('${capa}')">
          <div class="overlay">
            <button class="play-btn">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
        <div class="filme-info">
          <h3>${titulo}</h3>
          <p class="genero">${genero} ${duracao ? '• ' + duracao + 'min' : ''}</p>
          <div class="rating">
            <span class="stars">${API.Utils.generateStars(rating)}</span>
            <span class="nota">${(rating).toFixed(1)}/5</span>
          </div>
          <p class="preco">${API.Utils.formatPrice(preco)}</p>
          <button class="comprar-btn" data-movie-id="${movie.id}" data-movie-title="${titulo}">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    `;
  }).join('');

  attachMovieEvents();
}

function attachMovieEvents() {
  document.querySelectorAll('.comprar-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const movieId = e.target.dataset.movieId;
      const movieTitle = e.target.dataset.movieTitle;
      await addToCart(movieId, movieTitle);
    });
  });

  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const trailerUrl = e.currentTarget.dataset.trailer;
      if (trailerUrl) {
        window.open(trailerUrl, '_blank');
      } else {
        API.Utils.showToast('Trailer não disponível', 'info');
      }
    });
  });
}

async function addToCart(movieId, movieTitle) {
  if (!API.Auth.isAuthenticated()) {
    API.Utils.showToast('Faça login para adicionar ao carrinho', 'error');
    setTimeout(() => window.location.href = '/login.html', 1500);
    return;
  }

  try {
    await API.Cart.add(movieId, 1);
    API.Utils.showToast(`${movieTitle} adicionado ao carrinho!`, 'success');
    updateCartCount();
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    API.Utils.showToast('Erro ao adicionar ao carrinho', 'error');
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
  } catch (error) {
    console.error('Erro ao atualizar contador do carrinho:', error);
  }
}

async function searchMovies(query) {
  if (!query || query.trim().length < 3) {
    API.Utils.showToast('Digite pelo menos 3 caracteres', 'info');
    return;
  }

  try {
    const movies = await API.Movie.search(query);
    const container = document.querySelector('.filmes-grid');
    if (container) {
      renderMovies(movies, container);
    }
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    API.Utils.showToast('Erro na busca', 'error');
  }
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');

    if (emailInput && emailInput.value) {
      API.Utils.showToast(`Inscrição realizada! Confirme o email em ${emailInput.value}`, 'success');
      newsletterForm.reset();
    }
  });
}

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
  ctaButton.addEventListener('click', () => {
    window.location.href = '/catalogo.html';
  });
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
      obs.unobserve(entry.target);
    }
  });
}, observerOptions);

function observeCards() {
  document.querySelectorAll('.filme-card, .promocao-card, .proximo-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
  });
}

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 50
      ? '0 6px 10px rgba(0, 0, 0, 0.5)'
      : '0 4px 6px rgba(0, 0, 0, 0.3)';
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  loadHeader();

  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (usuarioLogado) {
    console.log(`🎬 Bem-vindo de volta, ${usuarioLogado}!`);
  }

  const filmesContainer = document.querySelector('.filmes-grid');
  if (filmesContainer) {
    const isHomePage = window.location.pathname.includes('inicio.html') || window.location.pathname === '/';
    const isCatalogPage = window.location.pathname.includes('catalogo.html');

    if (isHomePage) {
      await loadMovies('.filmes-grid', 'featured');
    } else if (isCatalogPage) {
      await loadMovies('.filmes-grid');
    }

    setTimeout(observeCards, 100);
  }

  addSearchBar();
});

function addSearchBar() {
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu || document.querySelector('.search-bar')) return;

  const searchContainer = createElement('div', 'search-container');
  searchContainer.innerHTML = `
    <input type="text" class="search-input" placeholder="Buscar filmes..." />
    <button class="search-btn"><i class="fas fa-search"></i></button>
  `;

  const cartLink = navMenu.querySelector('.cart-link');
  if (cartLink) {
    navMenu.insertBefore(searchContainer, cartLink);
  }

  const searchInput = searchContainer.querySelector('.search-input');
  const searchBtn = searchContainer.querySelector('.search-btn');

  const debouncedSearch = API.Utils.debounce((query) => {
    searchMovies(query);
  }, 500);

  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });

  searchBtn.addEventListener('click', () => {
    searchMovies(searchInput.value);
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchMovies(searchInput.value);
    }
  });
}

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #e50914;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }

  .cart-link {
    position: relative;
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-name {
    color: #fff;
    font-size: 14px;
  }

  .logout-btn {
    background: #e50914;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .logout-btn:hover {
    background: #c40812;
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: #fff;
    font-size: 18px;
  }

  .error-message,
  .no-movies {
    text-align: center;
    padding: 40px;
    color: #999;
  }

  .search-container {
    display: flex;
    gap: 5px;
  }

  .search-input {
    padding: 8px 12px;
    border: 1px solid #333;
    background: #1a1a1a;
    color: #fff;
    border-radius: 4px;
    width: 200px;
  }

  .search-btn {
    background: #e50914;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  .search-btn:hover {
    background: #c40812;
  }

  .preco {
    color: #4caf50;
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(dynamicStyles);