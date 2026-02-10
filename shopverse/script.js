

        // ===== CONFIGURATION =====
        const defaultConfig = {
            store_name: 'ShopVerse',
            hero_title: 'Discover Your <span class="gradient-text">Perfect</span> Style',
            hero_subtitle: 'Explore our curated collection of premium products designed to elevate your everyday life.',
            background_color: '#0a0a0f',
            surface_color: '#16161d',
            text_color: '#f8f8f8',
            primary_color: '#8b5cf6',
            secondary_color: '#6366f1',
            font_family: 'Outfit',
            font_size: 16
        };
        
        let config = { ...defaultConfig };
        
        // ===== PRODUCT DATA (for Spring Boot API integration) =====
        // In production, this would come from your Spring Boot microservices
        // const products = [
        //     { id: 1, name: 'Wireless Headphones Pro', price: 299, originalPrice: 399, category: 'electronics', rating: 4.8, reviews: 256, badge: 'Best Seller', icon: '🎧' },
        //     { id: 2, name: 'Smart Watch Ultra', price: 449, originalPrice: 549, category: 'electronics', rating: 4.9, reviews: 189, badge: 'New', icon: '⌚' },
        //     { id: 3, name: 'Premium Leather Jacket', price: 199, originalPrice: 299, category: 'fashion', rating: 4.7, reviews: 324, badge: 'Sale', icon: '🧥' },
        //     { id: 4, name: 'Designer Sneakers', price: 179, originalPrice: 249, category: 'fashion', rating: 4.6, reviews: 412, badge: '', icon: '👟' },
        //     { id: 5, name: 'Minimalist Desk Lamp', price: 89, originalPrice: 129, category: 'home', rating: 4.5, reviews: 167, badge: '', icon: '💡' },
        //     { id: 6, name: 'Ergonomic Office Chair', price: 399, originalPrice: 549, category: 'home', rating: 4.8, reviews: 203, badge: 'Hot', icon: '🪑' },
        //     { id: 7, name: 'Yoga Mat Premium', price: 69, originalPrice: 99, category: 'sports', rating: 4.7, reviews: 289, badge: '', icon: '🧘' },
        //     { id: 8, name: 'Fitness Tracker Band', price: 129, originalPrice: 179, category: 'sports', rating: 4.6, reviews: 356, badge: 'Popular', icon: '📱' }
        // ];

let products = [];
        async function loadProductsFromBackend() {
    try {
        const res = await fetch("http://localhost:5050/api/v1/products");
        const data = await res.json();

        products.length = 0;      // clear old data
        products.push(...data);   // add backend data

        renderProducts();
    } catch (err) {
        console.log("Backend not running, using local data");
    }
}

        
        // ===== STATE MANAGEMENT =====
        let cart = [];
        let wishlist = [];
        let currentCategory = 'all';
        
        // ===== API ENDPOINTS (for Spring Boot integration) =====
        // These would be your actual microservice endpoints
      const API_BASE_URL = 'http://localhost:/api/v1';


        const API_ENDPOINTS = {
            products: `${API_BASE_URL}/products`,
            cart: `${API_BASE_URL}/cart`,
            orders: `${API_BASE_URL}/orders`,
            users: `${API_BASE_URL}/users`,
            auth: `${API_BASE_URL}/auth`,
            payments: `${API_BASE_URL}/payments`,
            inventory: `${API_BASE_URL}/inventory`,
            reviews: `${API_BASE_URL}/reviews`
        };


        function requireLogin(action = 'perform this action') {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    showToast('error', `Please login to ${action}`);
    openAuthModal();
    return false;
  }
  return true;
}

        
        // ===== ELEMENT SDK INITIALIZATION =====
        async function initializeApp() {
            if (window.elementSdk) {
                await window.elementSdk.init({
                    defaultConfig,
                    onConfigChange: async (newConfig) => {
                        config = { ...defaultConfig, ...newConfig };
                        updateUI();
                    },
                    mapToCapabilities: (cfg) => ({
                        recolorables: [
                            { get: () => cfg.background_color || defaultConfig.background_color, set: (v) => { cfg.background_color = v; window.elementSdk.setConfig({ background_color: v }); } },
                            { get: () => cfg.surface_color || defaultConfig.surface_color, set: (v) => { cfg.surface_color = v; window.elementSdk.setConfig({ surface_color: v }); } },
                            { get: () => cfg.text_color || defaultConfig.text_color, set: (v) => { cfg.text_color = v; window.elementSdk.setConfig({ text_color: v }); } },
                            { get: () => cfg.primary_color || defaultConfig.primary_color, set: (v) => { cfg.primary_color = v; window.elementSdk.setConfig({ primary_color: v }); } },
                            { get: () => cfg.secondary_color || defaultConfig.secondary_color, set: (v) => { cfg.secondary_color = v; window.elementSdk.setConfig({ secondary_color: v }); } }
                        ],
                        borderables: [],
                        fontEditable: { get: () => cfg.font_family || defaultConfig.font_family, set: (v) => { cfg.font_family = v; window.elementSdk.setConfig({ font_family: v }); } },
                        fontSizeable: { get: () => cfg.font_size || defaultConfig.font_size, set: (v) => { cfg.font_size = v; window.elementSdk.setConfig({ font_size: v }); } }
                    }),
                    mapToEditPanelValues: (cfg) => new Map([
                        ['store_name', cfg.store_name || defaultConfig.store_name],
                        ['hero_title', cfg.hero_title || defaultConfig.hero_title],
                        ['hero_subtitle', cfg.hero_subtitle || defaultConfig.hero_subtitle]
                    ])
                });
                config = { ...defaultConfig, ...window.elementSdk.config };
            }
            
            updateUI();
            renderProducts();
            startCountdown();
        }
        
        // ===== UI UPDATE FUNCTION =====
        function updateUI() {
            const root = document.documentElement;
            root.style.setProperty('--color-background', config.background_color || defaultConfig.background_color);
            root.style.setProperty('--color-surface', config.surface_color || defaultConfig.surface_color);
            root.style.setProperty('--color-text', config.text_color || defaultConfig.text_color);
            root.style.setProperty('--color-primary', config.primary_color || defaultConfig.primary_color);
            root.style.setProperty('--color-secondary', config.secondary_color || defaultConfig.secondary_color);
            
            document.body.style.backgroundColor = config.background_color || defaultConfig.background_color;
            document.body.style.color = config.text_color || defaultConfig.text_color;
            document.body.style.fontFamily = `${config.font_family || defaultConfig.font_family}, sans-serif`;
            
            const fontSize = config.font_size || defaultConfig.font_size;
            document.body.style.fontSize = `${fontSize}px`;
            
            // Update text content
            const storeName = document.getElementById('store-name');
            if (storeName) storeName.textContent = config.store_name || defaultConfig.store_name;
            
            const heroTitle = document.getElementById('hero-title');
            if (heroTitle) heroTitle.innerHTML = config.hero_title || defaultConfig.hero_title;
            
            const heroSubtitle = document.getElementById('hero-subtitle');
            if (heroSubtitle) heroSubtitle.textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
        }
        
        // ===== PRODUCT RENDERING =====
        function renderProducts() {
            const grid = document.getElementById('products-grid');
            const filteredProducts = currentCategory === 'all' 
                ? products 
                : products.filter(p => p.category === currentCategory);
            
            grid.innerHTML = filteredProducts.map(product => `
                <div class="product-card">
                    <div class="product-image relative">
                        <span class="text-6xl">${product.icon}</span>
                        ${product.badge ? `<span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium" style="background: var(--color-primary);">${product.badge}</span>` : ''}
          <button onclick="toggleWishlist('${product.id}')" 
class="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform">

                            <svg class="w-5 h-5 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}" fill="${wishlist.includes(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="p-5">
                        <div class="flex items-center gap-1 mb-2">
                            ${renderStars(product.rating)}
                            <span class="text-gray-400 text-sm ml-1">(${product.reviews})</span>
                        </div>
                        <h3 class="font-semibold mb-2">${product.name}</h3>
                        <div class="flex items-center gap-2 mb-4">
                            <span class="text-xl font-bold" style="color: var(--color-primary);">$${product.price}</span>
                            ${product.originalPrice > product.price ? `<span class="text-gray-500 line-through text-sm">$${product.originalPrice}</span>` : ''}
                        </div>
                        <button onclick="addToCart(${product.id})" class="btn-primary w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            Add to Cart
                        </button>
                    </div>
                </div>
            `).join('');
        }

        //=== render WhishList hearts correctly on load ===
function renderWishlist() {
    const container = document.getElementById('wishlist-items');

    if (wishlist.length === 0) {
        container.innerHTML = '<p class="text-gray-400">No items in wishlist</p>';
        return;
    }

    const likedProducts = products.filter(p => wishlist.includes(p.id));

    container.innerHTML = likedProducts.map(product => `
        <div class="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div class="flex items-center gap-3">
                <span class="text-2xl">${product.icon}</span>
                <div>
                    <h4 class="font-medium">${product.name}</h4>
                    <p class="text-sm text-gray-400">$${product.price}</p>
                </div>
            </div>

            <!-- REMOVE BUTTON -->
            <button onclick="toggleWishlist(${product.id})"
                class="text-red-500 text-xl hover:scale-110 transition">
                ❤️
            </button>
        </div>
    `).join('');
}

//==================== Oders page rendering ====================
async function openMyOrders() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    showToast('error', 'Please login to view orders');
    return;
  }

  // 🔓 OPEN MODAL
  document.getElementById('orders-modal').classList.add('active');
  document.getElementById('orders-content').classList.add('active');

  try {
    const res = await fetch(
      'http://localhost:5050/api/v1/orders/my',
      {
        headers: {
          'X-USER-EMAIL': user.email
        }
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    const orders = await res.json();
    renderOrders(orders);

  } catch (err) {
    console.error(err);
    showToast('error', 'Could not load orders');
  }
}


function closeOrders() {
  document.getElementById('orders-modal').classList.remove('active');
  document.getElementById('orders-content').classList.remove('active');
}


function renderOrders(orders) {
  const container = document.getElementById('orders-list');

  if (!orders || orders.length === 0) {
    container.innerHTML =
      '<p class="text-gray-400">No orders found</p>';
    return;
  }

  container.innerHTML = orders.map(o => `
    <div class="p-4 rounded-xl bg-white/5 flex justify-between">
      <div>
        <h4 class="font-semibold">${o.productName}</h4>
        <p class="text-sm text-gray-400">
          Qty: ${o.quantity}
        </p>
        <p class="text-xs text-gray-500">
          ${new Date(o.createdAt).toLocaleString()}
        </p>
      </div>
      <div class="text-purple-400 font-bold">
        $${o.totalPrice}
      </div>
    </div>
  `).join('');
}





//==================== END OF ORDERS RENDERING ====================



        
        // ===== STAR RATING RENDERER =====
        function renderStars(rating) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            let stars = '';
            
            for (let i = 0; i < fullStars; i++) {
                stars += '<svg class="w-4 h-4 star" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
            }
            if (hasHalfStar) {
                stars += '<svg class="w-4 h-4 star" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z"/></svg>';
            }
            
            return stars;
        }
        
        // ===== CATEGORY FILTER =====
        function filterByCategory(category) {
            currentCategory = category;
            
            // Update filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.dataset.category === category) {
                    btn.className = 'filter-btn px-4 py-2 rounded-xl text-sm font-medium transition-all bg-purple-500/20 text-purple-400 border border-purple-500/30';
                } else {
                    btn.className = 'filter-btn px-4 py-2 rounded-xl text-sm font-medium transition-all text-gray-400 hover:text-white';
                }
            });
            
            renderProducts();
        }

        function scrollToCategories() {
  document
    .getElementById('categories')
    .scrollIntoView({ behavior: 'smooth' });
}

        
        // ===== CART FUNCTIONS =====
    function addToCart(productId) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    showToast('error', 'Login required to add items');
    openAuthModal();
    return;
  }

  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartBadge();
  showToast('success', `${product.name} added to cart!`);
}


        
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartBadge();
            renderCartItems();
        }
        
        function updateQuantity(productId, delta) {
            const item = cart.find(i => i.id === productId);
            if (item) {
                item.quantity += delta;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    renderCartItems();
                }
            }
        }
        
        function updateCartBadge() {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cart-count').textContent = count;
        }
        
        function renderCartItems() {
            const container = document.getElementById('cart-items');
            const emptyState = document.getElementById('cart-empty');
            const footer = document.getElementById('cart-footer');
            const totalEl = document.getElementById('cart-total');
            
            if (cart.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                footer.classList.add('hidden');
                return;
            }
            
            emptyState.classList.add('hidden');
            footer.classList.remove('hidden');
            
            container.innerHTML = cart.map(item => `
                <div class="flex gap-4 p-3 rounded-xl" style="background: var(--color-surface);">
                    <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-2xl">
                        ${item.icon}
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium text-sm">${item.name}</h4>
                        <p style="color: var(--color-primary);" class="font-bold">$${item.price}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="updateQuantity(${item.id}, -1)" class="qty-btn">-</button>
                        <span class="w-8 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="qty-btn">+</button>
                    </div>
                </div>
            `).join('');
            
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            totalEl.textContent = `$${total.toFixed(2)}`;
        }
        
        // ===== WISHLIST FUNCTIONS =====
function toggleWishlist(productId) {
  if (!requireLogin('use wishlist')) return;

  productId = Number(productId);

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    showToast('info', 'Removed from wishlist');
  } else {
    wishlist.push(productId);
    showToast('success', 'Added to wishlist!');
  }

  document.getElementById('wishlist-count').textContent = wishlist.length;
  renderProducts();
  renderWishlist();
}



function removeFromWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);

    document.getElementById('wishlist-count').textContent = wishlist.length;

    renderWishlist();
    renderProducts();

    showToast('info', 'Removed from wishlist');
}


function openWishlist() {
  if (!requireLogin('view wishlist')) return;

  document.getElementById('wishlist-modal').classList.add('active');
  document.getElementById('wishlist-content').classList.add('active');
  renderWishlist();
}


function closeWishlist() {
    document.getElementById('wishlist-modal').classList.remove('active');
    document.getElementById('wishlist-content').classList.remove('active');
}


let isLogin = true;

function openAuthModal() {
  console.log("USER ICON CLICKED");
  document.getElementById('auth-modal').classList.remove('hidden');
  document.getElementById('auth-content').classList.remove('hidden');
}

function closeAuth() {
  document.getElementById('auth-modal').classList.add('hidden');
  document.getElementById('auth-content').classList.add('hidden');
}

function toggleAuthMode() {
  isLogin = !isLogin;
  document.getElementById('auth-title').textContent = isLogin ? 'Login' : 'Signup';
  document.getElementById('auth-switch').textContent = isLogin ? 'Signup' : 'Login';
  document.getElementById('auth-name').classList.toggle('hidden', isLogin);
}

function toggleUserMenu() {
  const menu = document.getElementById('user-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function handleUserClick() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    openAuthModal();   // 👈 login/signup
  } else {
    toggleUserMenu(); // 👈 dropdown
  }
}


document.addEventListener('click', (e) => {
  if (!e.target.closest('#user-btn')) {
    document.getElementById('user-menu')?.classList.add('hidden');
  }
});

function logout() {
  localStorage.removeItem('user');

  // 🔥 CLEAR SESSION DATA
  cart = [];
  wishlist = [];

  updateCartBadge();
  document.getElementById('wishlist-count').textContent = 0;

  updateUserUI();
  renderProducts();
  renderWishlist();

  showToast('info', 'Logged out successfully');
}





async function submitAuth() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const name = document.getElementById('auth-name').value;

  const url = isLogin
    ? 'http://localhost:5050/api/auth/login'
    : 'http://localhost:5050/api/auth/register';

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    showToast('error', data.message || 'Login failed');
    return;
  }

  // ✅ STORE USER
  localStorage.setItem('user', JSON.stringify(data));

  // ✅ UPDATE UI IMMEDIATELY
  updateUserUI();

  showToast('success', 'Login successful');
  closeAuth();
}


function updateUserUI() {
  const user = JSON.parse(localStorage.getItem('user'));

  const nameEl = document.getElementById('user-name');
  const iconEl = document.getElementById('user-icon');
  const menuEl = document.getElementById('user-menu');

  if (!nameEl || !iconEl) return;

  if (user && user.name) {
    iconEl.textContent = '👋';
    nameEl.textContent = user.name;
    nameEl.classList.remove('hidden');
  } else {
    iconEl.textContent = '👤';
    nameEl.textContent = '';
    nameEl.classList.add('hidden');
    if (menuEl) menuEl.classList.add('hidden');
  }
}









        
        // ===== MODAL FUNCTIONS =====
        function openSearch() {
            document.getElementById('search-modal').classList.add('active');
            document.getElementById('search-content').classList.add('active');
            document.getElementById('search-input').focus();
        }
        
        function closeSearch() {
            document.getElementById('search-modal').classList.remove('active');
            document.getElementById('search-content').classList.remove('active');
        }
        
       function openCart() {
  if (!requireLogin('view cart')) return;

  document.getElementById('cart-modal').classList.add('active');
  document.getElementById('cart-content').classList.add('active');
  renderCartItems();
}

        
        function closeCart() {
            document.getElementById('cart-modal').classList.remove('active');
            document.getElementById('cart-content').classList.remove('active');
        }
        
        // ===== SEARCH FUNCTION =====
        function searchProducts(query) {
            const results = products.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            );
            
            const container = document.getElementById('search-results');
            
            if (query.length === 0) {
                container.innerHTML = '<p class="text-gray-400 text-center py-4">Start typing to search...</p>';
                return;
            }
            
            if (results.length === 0) {
                container.innerHTML = '<p class="text-gray-400 text-center py-4">No products found</p>';
                return;
            }
            
            container.innerHTML = results.map(product => `
                <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors" onclick="closeSearch(); scrollToProducts();">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-xl">
                        ${product.icon}
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium">${product.name}</h4>
                        <p class="text-sm text-gray-400">$${product.price}</p>
                    </div>
                </div>
            `).join('');
        }
        
        // ===== COUNTDOWN TIMER =====
        function startCountdown() {
            // Set end date to 2 days from now
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 2);
            endDate.setHours(endDate.getHours() + 18);
            
            function updateCountdown() {
                const now = new Date();
                const diff = endDate - now;
                
                if (diff <= 0) {
                    document.getElementById('countdown-days').textContent = '00';
                    document.getElementById('countdown-hours').textContent = '00';
                    document.getElementById('countdown-minutes').textContent = '00';
                    document.getElementById('countdown-seconds').textContent = '00';
                    return;
                }
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
                document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
                document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
                document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
            }
            
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
        
        // ===== TOAST NOTIFICATION =====
        function showToast(type, message) {
            const toast = document.getElementById('toast');
            const icon = document.getElementById('toast-icon');
            const msg = document.getElementById('toast-message');
            
            msg.textContent = message;
            
            if (type === 'success') {
                icon.innerHTML = '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
                icon.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20';
            } else if (type === 'error') {
                icon.innerHTML = '<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
                icon.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20';
            } else {
                icon.innerHTML = '<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
                icon.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/20';
            }
            
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
        
        // ===== NEWSLETTER SUBSCRIPTION =====
        function subscribeNewsletter(event) {
            event.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            
            // In production, this would call your Spring Boot user microservice
            // fetch(API_ENDPOINTS.users + '/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
            
            showToast('success', 'Thanks for subscribing! Check your email for 10% off.');
            document.getElementById('newsletter-email').value = '';
        }
        
        // ===== CHECKOUT FUNCTION =====
async function checkout() {
  const user = JSON.parse(localStorage.getItem('user'));
console.log("ORDER EMAIL →", user?.email);


  if (!user) {
    showToast('error', 'Please login to place order');
    openAuthModal();
    return;
  }

  if (cart.length === 0) {
    showToast('error', 'Your cart is empty!');
    return;
  }

  try {
    for (let item of cart) {
      await fetch("http://localhost:5050/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-USER-EMAIL": user.email
        },
        body: JSON.stringify({
          productName: item.name,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity
        })
      });
    }

    showToast('success', 'Order placed successfully!');
    cart = [];
    updateCartBadge();
    closeCart();

  } catch (err) {
    console.error(err);
    showToast('error', 'Order failed');
  }
}




        
        // ===== NAVIGATION FUNCTIONS =====
        function scrollToProducts() {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
        
        function toggleMobileMenu() {
            document.getElementById('mobile-menu').classList.toggle('active');
        }
        
        // ===== EVENT LISTENERS =====
        document.getElementById('search-btn').addEventListener('click', openSearch);
        document.getElementById('cart-btn').addEventListener('click', openCart);
        document.getElementById('cart-modal').addEventListener('click', closeCart);
        document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);
        
        document.getElementById('search-input').addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });
        
        // Close modals on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
                closeCart();
            }
        });
        
        // Close mobile menu when clicking nav links
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', toggleMobileMenu);
        });
        
        // ===== SPRING BOOT API HELPER FUNCTIONS =====
        // These functions demonstrate how to integrate with your microservices
        
        async function fetchProducts() {
            try {
                const response = await fetch(API_ENDPOINTS.products);
                return await response.json();
            } catch (error) {
                console.error('Failed to fetch products:', error);
                return products; // Fallback to local data
            }
        }
        
        async function createOrder(orderData) {
            try {
                const response = await fetch(API_ENDPOINTS.orders, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                return await response.json();
            } catch (error) {
                console.error('Failed to create order:', error);
                throw error;
            }
        }
        
        async function updateCart(cartData) {
            try {
                const response = await fetch(API_ENDPOINTS.cart, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cartData)
                });
                return await response.json();
            } catch (error) {
                console.error('Failed to update cart:', error);
                throw error;
            }
        }
        
        // ===== INITIALIZE APP =====
        initializeApp();
        loadProductsFromBackend();
        renderWishlist();




     // 🔥 IMPORTANT: expose globally
window.openAuthModal = openAuthModal;
window.closeAuth = closeAuth;
window.toggleAuthMode = toggleAuthMode;
window.submitAuth = submitAuth;
window.handleUserClick = handleUserClick;
window.logout = logout;

document.addEventListener('DOMContentLoaded', () => {
  updateUserUI();
});


