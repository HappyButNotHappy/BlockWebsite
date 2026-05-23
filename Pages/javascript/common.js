const STORAGE_CART = 'blocklabCart';
const STORAGE_THEME = 'theme';

function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_CART) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const count = getCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
  badge.textContent = count;
  badge.classList.toggle('d-none', count === 0);
}

function parsePrice(value) {
  return parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0;
}

function formatPrice(value) {
  return '$' + value.toFixed(2);
}

window.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('theme-toggle');
  if (button) {
    if (localStorage.getItem(STORAGE_THEME) === 'dark') document.body.classList.add('dark-mode');
    const setLabel = () => button.textContent = document.body.classList.contains('dark-mode') ? 'Light' : 'Dark';
    setLabel();
    button.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem(STORAGE_THEME, document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      setLabel();
    });
  }
  updateCartCount();
});

window.addEventListener('storage', updateCartCount);
