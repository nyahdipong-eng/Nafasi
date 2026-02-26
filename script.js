// Important Notice Popup
const noticeOverlay = document.getElementById('noticeOverlay');
const noticePopup = document.getElementById('noticePopup');
const noticeCloseBtn = document.getElementById('noticeCloseBtn');
document.body.style.overflow = 'hidden';
noticeCloseBtn.addEventListener('click', function() {
    noticePopup.classList.remove('active');
    noticeOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Basket functionality
const basket = [];
const basketBtn = document.getElementById('basketBtn');
const basketSidebar = document.getElementById('basketSidebar');
const basketOverlay = document.getElementById('basketOverlay');
const basketClose = document.getElementById('basketClose');
const basketItems = document.getElementById('basketItems');
const basketEmpty = document.getElementById('basketEmpty');
const basketCount = document.getElementById('basketCount');
const basketTotal = document.getElementById('basketTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const products = {
    'hard-body-chicken': { name: 'Hard Body Chicken', price: 150, image: 'images/hard-body-chicken.webP' },
    'soft-chicken': { name: 'Soft Chicken (Broiler)', price: 120, image: 'images/soft-chicken.png' },
    'beef-ribs-750': { name: 'Smoked Beef Ribs 750g', price: 150, image: 'images/beef-ribs-large.webP' },
    'beef-ribs-500': { name: 'Smoked Beef Ribs 500g', price: 130, image: 'images/beef-ribs-medium.webP' }
};

function openBasket() { basketSidebar.classList.add('active'); basketOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeBasket() { basketSidebar.classList.remove('active'); basketOverlay.classList.remove('active'); document.body.style.overflow = ''; }

basketBtn.addEventListener('click', openBasket);
basketClose.addEventListener('click', closeBasket);
basketOverlay.addEventListener('click', closeBasket);

function addToBasket(productId) {
    const product = products[productId];
    const existing = basket.find(item => item.id === productId);
    if (existing) { existing.qty++; }
    else { basket.push({ id: productId, ...product, qty: 1 }); }
    updateBasket();
}

function updateQty(productId, change) {
    const item = basket.find(i => i.id === productId);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) { basket.splice(basket.indexOf(item), 1); }
    }
    updateBasket();
}

function removeItem(productId) {
    const index = basket.findIndex(i => i.id === productId);
    if (index > -1) { basket.splice(index, 1); }
    updateBasket();
}

function updateBasket() {
    const total = basket.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const count = basket.reduce((sum, item) => sum + item.qty, 0);
    basketCount.textContent = count;
    basketCount.classList.toggle('hidden', count === 0);
    basketTotal.textContent = 'R' + total;
    checkoutBtn.disabled = count === 0;
    if (basket.length === 0) {
        basketEmpty.style.display = 'block';
        basketItems.querySelectorAll('.basket-item').forEach(el => el.remove());
    } else {
        basketEmpty.style.display = 'none';
        basketItems.querySelectorAll('.basket-item').forEach(el => el.remove());
        basket.forEach(item => {
            const el = document.createElement('div');
            el.className = 'basket-item';
            el.innerHTML = `
                <div class="basket-item-image"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>
                <div class="basket-item-details">
                    <div class="basket-item-name">${item.name}</div>
                    <div class="basket-item-price">R${item.price}</div>
                    <div class="basket-item-controls">
                        <button class="qty-btn" onclick="updateQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
                        <button class="remove-btn" onclick="removeItem('${item.id}')" aria-label="Remove item">Remove</button>
                    </div>
                </div>`;
            basketItems.appendChild(el);
        });
    }
}

checkoutBtn.addEventListener('click', () => {
    if (basket.length === 0) return;
    const total = basket.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let message = "Hi! I'd like to place an order:\n\n";
    basket.forEach(item => { message += `• ${item.name} x${item.qty} - R${item.price * item.qty}\n`; });
    message += `\n*Total: R${total}*`;
    window.open(`https://wa.me/27671231122?text=${encodeURIComponent(message)}`, '_blank');
});

// Mobile menu toggle for new mobile-nav structure
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');

function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // focus management: focus first link inside mobileNav
    const focusable = mobileNav.querySelectorAll('a, button');
    if (focusable.length) focusable[0].focus();
}

function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (mobileMenuBtn) mobileMenuBtn.focus();
}

if (mobileMenuBtn && mobileNav && mobileNavOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });
    mobileNavOverlay.addEventListener('click', closeMobileNav);
    // close when any nav link is clicked
    mobileNav.querySelectorAll('a').forEach(el => el.addEventListener('click', closeMobileNav));
    window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMobileNav(); });
}

// Close on Escape and trap focus inside mobile nav when open
document.addEventListener('keydown', (e) => {
    if (!mobileNav) return;
    const isOpen = mobileNav.classList.contains('active');
    if (!isOpen) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeMobileNav();
        return;
    }
    if (e.key === 'Tab') {
        const focusable = Array.from(mobileNav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')).filter(el => !el.disabled && el.offsetParent !== null);
        if (focusable.length === 0) {
            e.preventDefault();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});