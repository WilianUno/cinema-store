const API_BASE_URL = 'http://localhost:3000/api';

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}

const AuthAPI = {
  login: async (email, password) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('userId');
    window.location.href = '/login.html';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: async () => {
    return fetchAPI('/auth/me');
  },
};

const MovieAPI = {
  getAll: async () => {
    return fetchAPI('/movies');
  },
  
  getById: async (id) => {
    return fetchAPI(`/movies/${id}`);
  },
  
  getByCategory: async (category) => {
    return fetchAPI(`/movies/category/${category}`);
  },
  
  search: async (query) => {
    return fetchAPI(`/movies/search?q=${encodeURIComponent(query)}`);
  },

  getFeatured: async () => {
    return fetchAPI('/movies/featured');
  },

  getUpcoming: async () => {
    return fetchAPI('/movies/upcoming');
  },
};

const CartAPI = {
  get: async () => {
    return fetchAPI('/cart');
  },
  
  add: async (movieId, quantity = 1) => {
    return fetchAPI('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ movieId, quantity }),
    });
  },
  
  update: async (itemId, quantity) => {
    return fetchAPI('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ itemId, quantity }),
    });
  },
  
  remove: async (itemId) => {
    return fetchAPI(`/cart/remove/${itemId}`, {
      method: 'DELETE',
    });
  },
  
  clear: async () => {
    return fetchAPI('/cart/clear', {
      method: 'DELETE',
    });
  },

  getTotal: async () => {
    const cart = await CartAPI.get();
    return cart.items.reduce((sum, item) => 
      sum + (item.movie.price * item.quantity), 0
    );
  },

  getCount: async () => {
    const cart = await CartAPI.get();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },
};

const CheckoutAPI = {
  process: async (paymentData) => {
    return fetchAPI('/checkout', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  
  getOrders: async () => {
    return fetchAPI('/checkout/orders');
  },

  getOrderById: async (orderId) => {
    return fetchAPI(`/checkout/orders/${orderId}`);
  },

  calculateShipping: async (zipCode) => {
    return fetchAPI('/checkout/shipping', {
      method: 'POST',
      body: JSON.stringify({ zipCode }),
    });
  },

  applyCoupon: async (couponCode) => {
    return fetchAPI('/checkout/coupon', {
      method: 'POST',
      body: JSON.stringify({ couponCode }),
    });
  },
};

const UserAPI = {
  getProfile: async () => {
    return fetchAPI('/user/profile');
  },

  updateProfile: async (userData) => {
    return fetchAPI('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return fetchAPI('/user/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  getFavorites: async () => {
    return fetchAPI('/user/favorites');
  },

  addFavorite: async (movieId) => {
    return fetchAPI('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    });
  },

  removeFavorite: async (movieId) => {
    return fetchAPI(`/user/favorites/${movieId}`, {
      method: 'DELETE',
    });
  },
};

const Utils = {
  formatPrice: (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  formatDate: (dateString) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
  },

  generateStars: (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '⯨' : '') + 
           '☆'.repeat(emptyStars);
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  isMobile: () => {
    return window.innerWidth <= 768;
  },

  showToast: (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
      color: white;
      border-radius: 5px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
};

window.API = {
  Auth: AuthAPI,
  Movie: MovieAPI,
  Cart: CartAPI,
  Checkout: CheckoutAPI,
  User: UserAPI,
  Utils: Utils,
};

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);