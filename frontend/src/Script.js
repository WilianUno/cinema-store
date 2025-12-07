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

  const navMenu = createElement("nav", "nav-menu");
  navMenu.innerHTML = "\n    <a href=\"inicio.html#filmes\" class=\"nav-link\">Novidades</a>\n    <a href=\"inicio.html#breve\" class=\"nav-link\">Em breve</a>\n    <a href=\"catalogo.html\" class=\"nav-link signup-btn\">Catálogo</a>\n    <a href=\"carrinho.html\" class=\"fa-solid fa-cart-shopping\"></a>\n    <a href=\"login.html\" class=\"nav-link login-btn\">Entrar</a>\n  ";

  const hamb = createElement("div", "hamburger");
  hamb.innerHTML = "<span></span><span></span><span></span>";

  navContainer.appendChild(logo);
  navContainer.appendChild(navMenu);
  navContainer.appendChild(hamb);

  header.appendChild(navContainer);
  container.appendChild(header);

  initMenuEvents();
}

function initMenuEvents() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
    });
  }

  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navMenu) navMenu.style.display = "none";
    });
  });
}

document.addEventListener("DOMContentLoaded", loadHeader);

var newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var emailInput = newsletterForm.querySelector('input[type="email"]');

    if (emailInput && emailInput.value) {
      alert("Obrigado por se inscrever! Confirme o link enviado para " + emailInput.value);
      newsletterForm.reset();
    }
  });
}

var ctaButton = document.querySelector('.cta-button');

if (ctaButton) {
  ctaButton.addEventListener('click', function () {
    alert('Redirecionando para compra de ingressos...');
  });
}

document.querySelectorAll('.comprar-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var card = btn.closest('.filme-card');
    var filmeName = card && card.querySelector('h3') ? card.querySelector('h3').textContent : null;

    if (filmeName) {
      alert("Você selecionou: " + filmeName + "\nRedirecionando para a página de compra...");
    }
  });
});

document.querySelectorAll('.play-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var filmeCard = btn.closest('.filme-card');
    var filmeName = filmeCard && filmeCard.querySelector('h3') ? filmeCard.querySelector('h3').textContent : null;

    if (filmeName) {
      alert("Assistindo trailer de: " + filmeName);
    }
  });
});

var observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

var observer = new IntersectionObserver(function (entries, obs) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
      obs.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.filme-card, .promocao-card, .proximo-card').forEach(function (card) {
  card.style.opacity = '0';
  observer.observe(card);
});

window.addEventListener('scroll', function () {
  var navbar = document.querySelector('.navbar');

  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 50 ? '0 6px 10px rgba(0, 0, 0, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.3)';
  }
});

window.addEventListener('load', function () {
  var usuarioLogado = localStorage.getItem('usuarioLogado');
  if (usuarioLogado) {
    console.log("Bem-vindo " + usuarioLogado + "!");
  }
});

console.log('🎬 CinemaMax - Bem-vindo!');
