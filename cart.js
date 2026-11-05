// Simple cart with localStorage
const cart = {
  items: JSON.parse(localStorage.getItem('cosytail-cart')) || [],

  save() {
    localStorage.setItem('cosytail-cart', JSON.stringify(this.items));
    this.updateUI();
  },

  add(product) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this.save();
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  },

  updateQty(id, qty) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, qty);
      this.save();
    }
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  updateUI() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (countEl) countEl.textContent = this.count();
    if (totalEl) totalEl.textContent = this.total().toFixed(2).replace('.', ',') + ' €';

    if (itemsEl) {
      if (this.items.length === 0) {
        itemsEl.innerHTML = '<p class="empty">Votre panier est vide</p>';
        return;
      }
      itemsEl.innerHTML = this.items.map(i => `
        <div class="cart-item">
          <img src="${i.image}" alt="${i.name}">
          <div>
            <strong>${i.name}</strong>
            <p>${i.price.toFixed(2).replace('.', ',')} €</p>
            <div class="qty">
              <button onclick="cart.updateQty('${i.id}', ${i.qty - 1})">-</button>
              <span>${i.qty}</span>
              <button onclick="cart.updateQty('${i.id}', ${i.qty + 1})">+</button>
            </div>
          </div>
          <button class="remove" onclick="cart.remove('${i.id}')">×</button>
        </div>
      `).join('');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  cart.updateUI();

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        image: card.dataset.image
      };
      cart.add(product);
      document.getElementById('cart-sidebar').classList.add('open');
      document.getElementById('cart-overlay').classList.add('open');
    });
  });

  document.getElementById('cart-toggle').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
  });

  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);

  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.items.length === 0) return alert('Votre panier est vide');
    // Redirection vers Shopify (produits)
    const shopifyBase = 'https://51dz2c-ri.myshopify.com/products/';
    const first = cart.items[0];
    const handle = first.id === 'lit' 
      ? 'lit-orthopedique-grand-format-soutien-chaleur' 
      : 'jouet-puzzle-interactif-2-etages-mangeoire-slow-feeder-jeu-d-intelligence-pour-chiens';
    window.location.href = shopifyBase + handle;
  });
});

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}