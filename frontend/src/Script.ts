function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  content?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag) as HTMLElementTagNameMap[K];
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
  navMenu.innerHTML = `
    <a href="inicio.html#filmes" class="nav-link">Novidades</a>
    <a href="inicio.html#breve" class="nav-link">Em breve</a>
    <a href="catalogo.html" class="nav-link signup-btn">Catálogo</a>
    <a href="carrinho.html" class="fa-solid fa-cart-shopping"></a>
    <a href="login.html" class="nav-link login-btn">Entrar</a>
  `;

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
  const hamburger = document.querySelector<HTMLElement>(".hamburger");
  const navMenu = document.querySelector<HTMLElement>(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
    });
  }

  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
  navLinks.forEach((link) => {
    if (!link) return;
    link.addEventListener("click", () => {
      if (navMenu) navMenu.style.display = "none";
    });
  });
}

document.addEventListener("DOMContentLoaded", loadHeader);


const newsletterForm = document.querySelector<HTMLFormElement>('.newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector<HTMLInputElement>('input[type="email"]');

    if (emailInput && emailInput.value) {
      alert(`Obrigado por se inscrever! Confirme o link enviado para ${emailInput.value}`);
      newsletterForm.reset();
    }
  });
}

const ctaButton = document.querySelector<HTMLElement>('.cta-button');

if (ctaButton) {
  ctaButton.addEventListener('click', () => {
    alert('Redirecionando para compra de ingressos...');
  });
}

document.querySelectorAll<HTMLButtonElement>('.comprar-btn').forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    const card = btn.closest('.filme-card') as HTMLElement | null;
    const filmeName = card?.querySelector('h3')?.textContent;

    if (filmeName) {
      alert(`Você selecionou: ${filmeName}\nRedirecionando para a página de compra...`);
    }
  });
});

document.querySelectorAll<HTMLButtonElement>('.play-btn').forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    const filmeCard = btn.closest('.filme-card') as HTMLElement | null;
    const filmeName = filmeCard?.querySelector('h3')?.textContent;

    if (filmeName) {
      alert(`Assistindo trailer de: ${filmeName}`);
    }
  });
});

const observerOptions: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      (entry.target as HTMLElement).style.animation = 'fadeInUp 0.6s ease forwards';
      obs.unobserve(entry.target);
    }
  });
}, observerOptions);

document
  .querySelectorAll<HTMLElement>('.filme-card, .promocao-card, .proximo-card')
  .forEach(card => {
    card.style.opacity = '0';
    observer.observe(card as Element);
  });

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar') as HTMLElement | null;

  if (navbar) {
    navbar.style.boxShadow =
      window.scrollY > 50
        ? '0 6px 10px rgba(0, 0, 0, 0.5)'
        : '0 4px 6px rgba(0, 0, 0, 0.3)';
  }
});

window.addEventListener('load', () => {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (usuarioLogado) {
    console.log(`Bem-vindo ${usuarioLogado}!`);
  }
});

console.log('🎬 CinemaMax - Bem-vindo!');
