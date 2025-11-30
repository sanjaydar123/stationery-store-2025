function getProducts() {
  return [
    {
      id: 1,
      name: "Classic Ruled Notebook",
      category: "Notebooks",
      price: 80,
      description: "A5 size, 180 pages, smooth paper for everyday notes.",
      image: "img/notebook-1.jpg",
      featured: true
    },
    {
      id: 2,
      name: "Premium Spiral Notebook",
      category: "Notebooks",
      price: 120,
      description: "Hard cover spiral notebook with tear-out sheets.",
      image: "img/notebook-spiral.jpg",
      featured: true
    },
    {
      id: 3,
      name: "Smooth Ball Pen Pack",
      category: "Pens",
      price: 60,
      description: "Pack of 5 blue ball pens with quick-dry ink.",
      image: "img/pen-pack.jpg",
      featured: true
    },
    {
      id: 4,
      name: "Highlighter Set",
      category: "Art",
      price: 150,
      description: "Set of 4 pastel highlighters for clear revision notes.",
      image: "img/highlighters.jpg",
      featured: false
    },
    {
      id: 5,
      name: "Sticky Notes Cube",
      category: "Supplies",
      price: 70,
      description: "Colorful sticky notes for quick reminders and bookmarks.",
      image: "img/sticky-notes.jpg",
      featured: false
    },
    {
      id: 6,
      name: "Geometry Box",
      category: "Supplies",
      price: 180,
      description: "Complete metal geometry box for exams and daily use.",
      image: "img/geometry-box.jpg",
      featured: false
    },
    {
      id: 7,
      name: "Fine Liner Pens",
      category: "Art",
      price: 199,
      description: "Set of 4 fineliners for diagrams and doodles.",
      image: "img/fineliner.jpg",
      featured: false
    },
    {
      id: 8,
      name: "USB Pen Drive 32GB",
      category: "Electronics",
      price: 499,
      description: "Compact USB drive for projects, assignments and media.",
      image: "img/pendrive.jpg",
      featured: false
    }
  ];
}

function getCart() {
  const raw = localStorage.getItem("cart");
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function getUsers() {
  const raw = localStorage.getItem("users");
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUserId() {
  return localStorage.getItem("currentUserId");
}

function setCurrentUserId(id) {
  if (id === null) {
    localStorage.removeItem("currentUserId");
  } else {
    localStorage.setItem("currentUserId", id);
  }
}

function getOrders() {
  const raw = localStorage.getItem("orders");
  return raw ? JSON.parse(raw) : [];
}

function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function formatCurrency(value) {
  return "₹" + value.toFixed(0);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId,
      quantity: 1
    });
  }
  saveCart(cart);
  alert("Added to cart: " + product.name);
}

function renderHomeProducts() {
  const container = document.getElementById("home-products");
  if (!container) return;
  const products = getProducts().filter(p => p.featured);
  container.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-tag">${product.category}</div>
      <div class="product-title">${product.name}</div>
      <div class="product-desc">${product.description}</div>
      <div class="product-footer">
        <div class="product-price">${formatCurrency(product.price)}</div>
        <button class="btn secondary" data-id="${product.id}">Add to cart</button>
      </div>
    `;
    container.appendChild(card);
  });
  container.addEventListener("click", e => {
    if (e.target.matches("button[data-id]")) {
      const id = parseInt(e.target.getAttribute("data-id"), 10);
      addToCart(id);
    }
  });
}

function renderProductsPage() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const products = getProducts();

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const filtered = products.filter(p => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
    grid.innerHTML = "";
    filtered.forEach(product => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-tag">${product.category}</div>
        <div class="product-title">${product.name}</div>
        <div class="product-desc">${product.description}</div>
        <div class="product-footer">
          <div class="product-price">${formatCurrency(product.price)}</div>
          <button class="btn secondary" data-id="${product.id}">Add to cart</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  grid.addEventListener("click", e => {
    if (e.target.matches("button[data-id]")) {
      const id = parseInt(e.target.getAttribute("data-id"), 10);
      addToCart(id);
    }
  });

  searchInput.addEventListener("input", applyFilter);
  categoryFilter.addEventListener("change", applyFilter);
  applyFilter();
}

function renderCartPage() {
  const itemsContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const buyNowBtn = document.getElementById("btn-buy-now");
  const payLaterBtn = document.getElementById("btn-pay-later");
  if (!itemsContainer || !totalEl) return;

  function refresh() {
    const cart = getCart();
    const products = getProducts();
    itemsContainer.innerHTML = "";
    if (cart.length === 0) {
      itemsContainer.innerHTML = "<p>Your cart is empty. Add some stationery from the products page.</p>";
      totalEl.textContent = formatCurrency(0);
      return;
    }
    let total = 0;
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;
      const lineTotal = product.price * item.quantity;
      total += lineTotal;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-thumb">${product.name.charAt(0)}</div>
        <div>
          <div class="cart-item-title">${product.name}</div>
          <div class="cart-item-meta">${product.category} • ${formatCurrency(product.price)} each</div>
        </div>
        <div class="cart-item-controls" data-id="${product.id}">
          <button class="qty-btn" data-action="dec">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-action="inc">+</button>
          <div style="margin-left:10px;font-weight:600;">${formatCurrency(lineTotal)}</div>
        </div>
      `;
      itemsContainer.appendChild(row);
    });
    totalEl.textContent = formatCurrency(total);
  }

  itemsContainer.addEventListener("click", e => {
    const actionBtn = e.target.closest(".qty-btn");
    if (!actionBtn) return;
    const action = actionBtn.getAttribute("data-action");
    const wrapper = actionBtn.closest(".cart-item-controls");
    const id = parseInt(wrapper.getAttribute("data-id"), 10);
    const cart = getCart();
    const entry = cart.find(item => item.productId === id);
    if (!entry) return;
    if (action === "inc") entry.quantity += 1;
    if (action === "dec") entry.quantity -= 1;
    if (entry.quantity <= 0) {
      const idx = cart.indexOf(entry);
      cart.splice(idx, 1);
    }
    saveCart(cart);
    refresh();
  });

  function placeOrder(orderType) {
    const cart = getCart();
    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }
    const userId = getCurrentUserId();
    if (!userId) {
      alert("Please login before placing an order.");
      window.location.href = "auth.html";
      return;
    }
    const products = getProducts();
    const orders = getOrders();
    const now = new Date();
    const items = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: product ? product.name : "Unknown",
        quantity: item.quantity,
        price: product ? product.price : 0
      };
    });
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const order = {
      id: "ORD" + (orders.length + 1).toString().padStart(4, "0"),
      userId,
      items,
      total,
      createdAt: now.toISOString(),
      orderType: orderType === "pay_later" ? "Pay Later" : "Immediate Payment",
      paymentStatus: orderType === "pay_later" ? "Pay Later" : "Paid"
    };
    orders.unshift(order);
    saveOrders(orders);
    saveCart([]);
    refresh();
    alert("Order placed successfully.");
    window.location.href = "orders.html";
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => placeOrder("pay_now"));
  }
  if (payLaterBtn) {
    payLaterBtn.addEventListener("click", () => placeOrder("pay_later"));
  }

  refresh();
}

function renderOrdersPage() {
  const container = document.getElementById("orders-list");
  if (!container) return;
  const userId = getCurrentUserId();
  if (!userId) {
    container.innerHTML = "<p>Please login to view your order history.</p>";
    return;
  }
  const orders = getOrders().filter(o => o.userId === userId);
  if (!orders.length) {
    container.innerHTML = "<p>No orders yet. Place your first order from the cart page.</p>";
    return;
  }
  container.innerHTML = "";
  orders.forEach(order => {
    const created = new Date(order.createdAt);
    const dateStr = created.toLocaleDateString();
    const timeStr = created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const card = document.createElement("article");
    card.className = "order-card";
    const itemsText = order.items.map(it => `${it.name} × ${it.quantity}`).join(", ");
    const isPayLater = order.paymentStatus === "Pay Later";
    card.innerHTML = `
      <div class="order-header">
        <div class="order-id">${order.id}</div>
        <div class="order-time">${dateStr} • ${timeStr}</div>
      </div>
      <div class="order-meta">
        <span class="order-pill">${order.orderType}</span>
        <span class="order-pill ${isPayLater ? "pay-later" : "paid"}">${order.paymentStatus}</span>
      </div>
      <div class="order-items">${itemsText}</div>
      <div class="order-total">Total: ${formatCurrency(order.total)}</div>
    `;
    container.appendChild(card);
  });
}

function setupAuthPage() {
  const tabs = document.querySelectorAll(".auth-tab");
  const panels = document.querySelectorAll(".auth-panel");
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-target");
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(panel => panel.classList.remove("active"));
      tab.classList.add("active");
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
    });
  });

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const profileForm = document.getElementById("profile-form");
  const profileStatus = document.getElementById("profile-status");
  const logoutBtn = document.getElementById("logout-btn");

  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim().toLowerCase();
      const mobile = document.getElementById("signup-mobile").value.trim();
      const password = document.getElementById("signup-password").value;
      const users = getUsers();
      if (users.some(u => u.email === email)) {
        alert("Account already exists with this email.");
        return;
      }
      const id = "U" + (users.length + 1).toString().padStart(4, "0");
      users.push({ id, name, email, mobile, password });
      saveUsers(users);
      setCurrentUserId(id);
      alert("Signup successful.");
      window.location.href = "index.html";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim().toLowerCase();
      const password = document.getElementById("login-password").value;
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        alert("Invalid email or password.");
        return;
      }
      setCurrentUserId(user.id);
      alert("Logged in successfully.");
      window.location.href = "index.html";
    });
  }

  function populateProfile() {
    if (!profileForm) return;
    const userId = getCurrentUserId();
    if (!userId) {
      profileStatus.textContent = "Login to manage your profile.";
      profileForm.querySelectorAll("input, button").forEach(el => {
        if (el.id !== "logout-btn") el.disabled = true;
      });
      return;
    }
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      profileStatus.textContent = "User not found. Please signup again.";
      return;
    }
    profileStatus.textContent = "You are logged in as " + user.email;
    document.getElementById("profile-name").value = user.name;
    document.getElementById("profile-email").value = user.email;
    document.getElementById("profile-mobile").value = user.mobile;
    document.getElementById("profile-password").value = user.password;
  }

  if (profileForm) {
    profileForm.addEventListener("submit", e => {
      e.preventDefault();
      const userId = getCurrentUserId();
      if (!userId) {
        alert("Please login first.");
        return;
      }
      const users = getUsers();
      const user = users.find(u => u.id === userId);
      if (!user) {
        alert("User not found.");
        return;
      }
      const newName = document.getElementById("profile-name").value.trim();
      const newEmail = document.getElementById("profile-email").value.trim().toLowerCase();
      const newMobile = document.getElementById("profile-mobile").value.trim();
      const newPassword = document.getElementById("profile-password").value;
      if (users.some(u => u.email === newEmail && u.id !== userId)) {
        alert("Another account already uses this email.");
        return;
      }
      user.name = newName;
      user.email = newEmail;
      user.mobile = newMobile;
      user.password = newPassword;
      saveUsers(users);
      populateProfile();
      alert("Profile updated.");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      setCurrentUserId(null);
      alert("Logged out.");
      window.location.href = "index.html";
    });
  }

  populateProfile();
}

function setupYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setupYear();
  renderHomeProducts();
  renderProductsPage();
  renderCartPage();
  renderOrdersPage();
  setupAuthPage();
});