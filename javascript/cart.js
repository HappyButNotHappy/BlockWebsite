function updateSummary(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length ? 25 : 0;
  const tax = cart.length ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
  document.getElementById('subTotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = formatPrice(shipping);
  document.getElementById('tax').textContent = formatPrice(tax);
  document.getElementById('total').textContent = formatPrice(subtotal + shipping + tax);
}

function updateCartItem(id, quantity) {
  const cart = getCart();
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity = Math.min(5, Math.max(1, quantity));
  saveCart(cart);
  renderCart();
}

function removeCartItem(id) {
  saveCart(getCart().filter(item => item.id !== id));
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const items = document.getElementById('cartItems');
  const empty = document.getElementById('emptyCart');
  const actions = document.getElementById('cartActions');
  items.innerHTML = '';

  if (!cart.length) {
    empty.classList.remove('d-none');
    actions.classList.add('d-none');
    updateSummary([]);
    return;
  }

  empty.classList.add('d-none');
  actions.classList.remove('d-none');

  cart.forEach(item => {
    const productTotal = item.price * item.quantity;
    items.insertAdjacentHTML('beforeend', `
      <div class="card border shadow-none mb-4">
        <div class="card-body">
          <div class="d-flex align-items-start border-bottom pb-3">
            <div class="me-4">
              <img src="${item.image}" alt="${item.title}" class="avatar-lg rounded">
            </div>
            <div class="flex-grow-1 align-self-center overflow-hidden">
              <div>
                <h5 class="text-truncate font-size-18"><a href="product.html?id=${item.id}" class="text-dark">${item.title}</a></h5>
                <p class="mb-0 mt-1">SKU : <span class="fw-medium">${item.sku}</span></p>
              </div>
            </div>
            <div class="flex-shrink-0 ms-2">
              <button type="button" class="btn btn-link text-danger remove-item" data-id="${item.id}">
                <i class="mdi mdi-trash-can-outline"></i>
              </button>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-4">
              <p class="text-muted mb-2">Price</p>
              <h5 class="mb-0">${formatPrice(item.price)}</h5>
            </div>
            <div class="col-md-5">
              <p class="text-muted mb-2">Quantity</p>
              <input type="number" min="1" max="5" value="${item.quantity}" class="form-control form-control-sm cart-qty" data-id="${item.id}">
            </div>
            <div class="col-md-3">
              <p class="text-muted mb-2">Total</p>
              <h5>${formatPrice(productTotal)}</h5>
            </div>
          </div>
        </div>
      </div>
    `);
  });

  items.querySelectorAll('.cart-qty').forEach(input => {
    input.addEventListener('change', event => updateCartItem(event.target.dataset.id, parseInt(event.target.value, 10) || 1));
  });

  items.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => removeCartItem(button.dataset.id));
  });

  updateSummary(cart);
}

window.addEventListener('DOMContentLoaded', renderCart);
