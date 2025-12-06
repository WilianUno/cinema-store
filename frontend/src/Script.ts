const hamburger = document.querySelector('.hamburger') as HTMLElement | null;
const navMenu = document.querySelector('.nav-menu') as HTMLElement | null;

hamburger?.addEventListener('click', () => {
  if (navMenu) {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
  }
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu) navMenu.style.display = 'none';
  });
});

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();

    const href = anchor.getAttribute('href');
    if (!href) return;

    const target = document.querySelector(href) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const newsletterForm = document.querySelector('.newsletter-form') as HTMLFormElement | null;

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]') as HTMLInputElement | null;

    if (emailInput?.value) {
      alert(`Obrigado por se inscrever! Confirme o link enviado para ${emailInput.value}`);
      newsletterForm.reset();
    }
  });
}

const ctaButton = document.querySelector('.cta-button') as HTMLElement | null;

if (ctaButton) {
  ctaButton.addEventListener('click', () => {
    alert('Redirecionando para compra de ingressos...');
  });
}

document.querySelectorAll('.comprar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.filme-card') as HTMLElement | null;
    const filmeName = card?.querySelector('h3')?.textContent;

    if (filmeName) {
      alert(`Você selecionou: ${filmeName}\nRedirecionando para a página de compra...`);
    }
  });
});

document.querySelectorAll('.play-btn').forEach(btn => {
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
  .querySelectorAll('.filme-card, .promocao-card, .proximo-card')
  .forEach(card => {
    (card as HTMLElement).style.opacity = '0';
    observer.observe(card);
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
