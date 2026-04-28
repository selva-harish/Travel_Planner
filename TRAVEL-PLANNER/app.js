/**
 * Trip Planner AI - Main Application JavaScript
 * Handles: Trip data, Cart management, Budget tracking, Page navigation
 */

// ===== TRIP DATA MANAGEMENT =====
const TripPlanner = {
    // Initialize or get trip data from localStorage
    getTripData() {
        const data = localStorage.getItem('tripData');
        return data ? JSON.parse(data) : {
            destination: '',
            budget: 0,
            budgetType: 'Midrange',
            travelers: 2, // Standard default for the new UI
            duration: 5,
            preferences: [],
            startDate: '',
            endDate: ''
        };
    },

    saveTripData(data) {
        localStorage.setItem('tripData', JSON.stringify(data));
    },

    // ===== CART MANAGEMENT =====
    getCart() {
        const cart = localStorage.getItem('tripCart');
        return cart ? JSON.parse(cart) : {
            hotels: [],
            activities: [],
            restaurants: []
        };
    },

    saveCart(cart) {
        localStorage.setItem('tripCart', JSON.stringify(cart));
        this.updateCartBadge();
    },

    addToCart(type, item) {
        const cart = this.getCart();

        // Check if item already exists
        const exists = cart[type].find(i => i.id === item.id);
        if (exists) {
            this.showNotification('Item already in cart!', 'warning');
            return false;
        }

        cart[type].push(item);
        this.saveCart(cart);
        this.showNotification(`${item.name} added to cart!`, 'success');
        return true;
    },

    removeFromCart(type, itemId) {
        const cart = this.getCart();
        cart[type] = cart[type].filter(i => i.id !== itemId);
        this.saveCart(cart);
        this.showNotification('Item removed from cart', 'info');
    },

    clearCart() {
        localStorage.removeItem('tripCart');
        this.updateCartBadge();
    },

    getCartTotal() {
        const cart = this.getCart();
        const tripData = this.getTripData();
        const travelers = tripData.travelers || 1;
        let total = 0;

        cart.hotels.forEach(h => total += h.price * (h.nights || 1));
        cart.activities.forEach(a => total += a.price * travelers);
        cart.restaurants.forEach(r => total += r.price);

        return total;
    },

    getCartItemCount() {
        const cart = this.getCart();
        return cart.hotels.length + cart.activities.length + cart.restaurants.length;
    },

    // ===== BUDGET TRACKING =====
    getBudgetStatus() {
        const tripData = this.getTripData();
        const spent = this.getCartTotal();
        const remaining = tripData.budget - spent;
        const percentage = Math.round((spent / tripData.budget) * 100);

        return {
            total: tripData.budget,
            spent: spent,
            remaining: remaining,
            percentage: Math.min(percentage, 100),
            isOverBudget: remaining < 0
        };
    },

    // ===== UI HELPERS =====
    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = this.getCartItemCount();

        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.tp-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `tp-notification tp-notification-${type}`;
        notification.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // ===== BUDGET SPLIT CALCULATION =====
    calculateBudgetSplit(totalBudget) {
        return {
            accommodation: Math.round(totalBudget * 0.40), // 40%
            food: Math.round(totalBudget * 0.25),          // 25%
            travel: Math.round(totalBudget * 0.20),        // 20%
            activities: Math.round(totalBudget * 0.15)     // 15%
        };
    }
};

// ===== AUTHENTICATION MANAGEMENT =====
const Auth = {
    getUser() {
        const user = localStorage.getItem('tripseroUser');
        return user ? JSON.parse(user) : null;
    },

    isLoggedIn() {
        return !!this.getUser();
    },

    logout() {
        localStorage.removeItem('tripseroUser');
        window.location.href = window.location.pathname.includes('/HP/') ? 'index.html' : 'HP/index.html';
    },

    updateNavBar() {
        const user = this.getUser();
        const navActions = document.querySelector('.nav-actions');
        const headerRight = document.querySelector('.header-right');
        const userAvatarEls = document.querySelectorAll('.user-avatar');

        if (user) {
            const userPicture = user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=random';
            
            // Update Homepage Style Nav
            if (navActions) {
                navActions.innerHTML = `
                    <div class="user-profile-nav">
                        <img src="${userPicture}" alt="${user.name}" class="nav-avatar" referrerpolicy="no-referrer" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random'">
                        <span class="nav-username">${user.name.split(' ')[0]}</span>
                        <button onclick="Auth.logout()" class="btn-logout" title="Logout">
                            <i class="fa-solid fa-right-from-bracket"></i>
                        </button>
                    </div>
                `;
            }

            // Update App Style Header
            userAvatarEls.forEach(el => {
                el.innerHTML = `
                    <div class="user-profile-header">
                        <img src="${userPicture}" alt="${user.name}" class="header-avatar" referrerpolicy="no-referrer" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random'">
                        <button onclick="Auth.logout()" class="header-logout-btn">
                            <i class="fa-solid fa-power-off"></i>
                        </button>
                    </div>
                `;
                el.style.display = 'block';
                el.style.background = 'none'; // Remove default gradient
            });

            // Update Settings Page Avatar
            const settingsAvatar = document.querySelector('.current-avatar');
            if (settingsAvatar) {
                settingsAvatar.style.backgroundImage = `url('${userPicture}')`;
            }

            // Update Settings Page Display Name
            const settingsNameInput = document.querySelector('#profile .form-input');
            if (settingsNameInput && (settingsNameInput.value === '')) {
                settingsNameInput.value = user.name;
            }

            // Hide Login buttons if they exist outside nav-actions
            const loginBtns = document.querySelectorAll('.btn-signup');
            loginBtns.forEach(btn => {
                if (!btn.closest('.nav-actions')) {
                    btn.style.display = 'none';
                }
            });
        } else {
            // Handle Logged Out State
            userAvatarEls.forEach(el => {
                el.innerHTML = '<i class="fa-solid fa-user" style="color: #64748b;"></i>';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
                el.style.background = '#f1f5f9';
            });

            const settingsAvatar = document.querySelector('.current-avatar');
            if (settingsAvatar) {
                settingsAvatar.innerHTML = '<i class="fa-solid fa-user" style="font-size: 32px; color: #94a3b8;"></i>';
                settingsAvatar.style.display = 'flex';
                settingsAvatar.style.alignItems = 'center';
                settingsAvatar.style.justifyContent = 'center';
                settingsAvatar.style.background = '#f1f5f9';
                settingsAvatar.style.backgroundImage = 'none';
            }
        }
    }
};

// ===== DATABASE REDIRECTION =====
// SampleData is now replaced by the global Database object from database.js
const SampleData = window.Database || {};


// ===== PAGE INITIALIZERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Check if database is already loaded
    if (window.Database && window.Database.hotels && window.Database.hotels.length > 0) {
        initApp();
    } else {
        // Wait for database-ready event
        console.log('Waiting for database...');
        window.addEventListener('database-ready', initApp);
    }
});

function initApp() {
    console.log('Initializing App...');
    // Update cart badge and authentication state on all pages
    TripPlanner.updateCartBadge();
    Auth.updateNavBar();

    // Page-specific initialization
    const page = document.body.dataset.page;
    
    // Global Authentication Guard
    // Allow 'home' and 'login' pages to be viewed without authentication
    if (page !== 'home' && page !== 'login' && !Auth.isLoggedIn()) {
        console.log('User not logged in, redirecting...');
        TripPlanner.showNotification('Please login or create an account to access this page.', 'warning');
        setTimeout(() => {
            window.location.href = window.location.pathname.includes('/HP/') ? '../login.html' : 'login.html';
        }, 1500);
        return; // Stop initialization
    }

    if (page === 'home') {
        initHomePage();
    } else if (page === 'hotels') {
        initHotelsPage();
    } else if (page === 'cart') {
        initCartPage();
    } else if (page === 'itinerary') {
        initItineraryPage();
    }
}

// Home Page -Capture trip input (Mostly handled by inline script)
function initHomePage() { }

// Hotels Page - Show recommendations and add to cart (Mostly handled in hotels.html)
function initHotelsPage() { }


// Cart Page - Display and manage cart items
function initCartPage() {
    renderCartItems();
    updateBudgetTracker();
    updateSummary();

    // Generate Itinerary button
    const generateBtn = document.querySelector('.btn-generate');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            if (TripPlanner.getCartItemCount() === 0) {
                TripPlanner.showNotification('Add items to cart first!', 'warning');
                return;
            }
            TripPlanner.showNotification('Generating your personalized itinerary...', 'success');
            setTimeout(() => {
                window.location.href = 'itinerary-loading.html';
            }, 1000);
        });
    }
}

function renderCartItems() {
    const cart = TripPlanner.getCart();

    // Render Hotels
    const hotelsContainer = document.querySelector('.cart-section:first-of-type .cart-items-list');
    if (hotelsContainer && cart.hotels.length > 0) {
        hotelsContainer.innerHTML = cart.hotels.map(hotel => createCartItemHTML(hotel, 'hotels')).join('');
    }

    // Render Activities
    const activitiesContainer = document.querySelector('.cart-section:last-of-type .cart-items-list');
    if (activitiesContainer && cart.activities.length > 0) {
        activitiesContainer.innerHTML = cart.activities.map(activity => createCartItemHTML(activity, 'activities')).join('');
    }

    // Attach delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            const id = btn.dataset.id;
            TripPlanner.removeFromCart(type, id);
            initCartPage(); // Re-render
        });
    });
}

function createCartItemHTML(item, type) {
    const tripData = TripPlanner.getTripData();
    const travelers = tripData.travelers || 1;
    const displayPrice = type === 'activities' ? item.price * travelers : item.price * (item.nights || 1);

    return `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="location">${item.location}</p>
                <div class="item-meta">
                    ${type === 'hotels' ?
            `<span><i class="fa-regular fa-calendar"></i> ${item.checkIn} - ${item.checkOut}</span>
                         <span><i class="fa-solid fa-bed"></i> ${item.nights} Nights</span>` :
            type === 'activities' ?
                `<span><i class="fa-solid fa-users"></i> ${travelers} Travelers</span>` :
                `<span><i class="fa-regular fa-clock"></i> ${item.duration || 'Flexible'}</span>`
        }
                </div>
            </div>
            <div class="item-price">₹${displayPrice.toLocaleString()}</div>
            <button class="delete-btn" data-type="${type}" data-id="${item.id}">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `;
}

function updateBudgetTracker() {
    const status = TripPlanner.getBudgetStatus();

    const progressFill = document.querySelector('.progress-fill');
    const allocationBadge = document.querySelector('.allocation-badge');
    const spentText = document.querySelector('.budget-info strong');
    const remainingText = document.querySelector('.remaining');

    if (progressFill) progressFill.style.width = `${status.percentage}%`;
    if (allocationBadge) allocationBadge.textContent = `${status.percentage}% Allocated`;
    if (spentText) spentText.textContent = `₹${status.spent.toLocaleString()}`;
    if (remainingText) remainingText.textContent = `₹${status.remaining.toLocaleString()} remaining`;
}

function updateSummary() {
    const cart = TripPlanner.getCart();
    const tripData = TripPlanner.getTripData();

    const travelers = tripData.travelers || 1;
    let hotelsTotal = 0;
    let activitiesTotal = 0;

    cart.hotels.forEach(h => hotelsTotal += h.price * (h.nights || 1));
    cart.activities.forEach(a => activitiesTotal += a.price * travelers);

    const subtotal = hotelsTotal + activitiesTotal;
    const taxes = subtotal * 0.15;
    const total = subtotal + taxes;

    // Update summary values
    const itemCount = document.querySelector('.summary-row:nth-child(1) .value');
    const hotelsSub = document.querySelector('.summary-row:nth-child(2) .value');
    const activitiesSub = document.querySelector('.summary-row:nth-child(3) .value');
    const taxesEl = document.querySelector('.summary-row:nth-child(4) .value');
    const totalEl = document.querySelector('.summary-total .amount');

    if (itemCount) itemCount.textContent = `${TripPlanner.getCartItemCount()} Selections`;
    if (hotelsSub) hotelsSub.textContent = `₹${hotelsTotal.toLocaleString()}`;
    if (activitiesSub) activitiesSub.textContent = `₹${activitiesTotal.toLocaleString()}`;
    if (taxesEl) taxesEl.textContent = `₹${taxes.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
}

// Itinerary Page
function initItineraryPage() {
    const cart = TripPlanner.getCart();
    const tripData = TripPlanner.getTripData();

    // Generate day-wise itinerary based on cart items
    generateItinerary(cart, tripData);
}

function generateItinerary(cart, tripData) {
    const days = tripData.duration || 5;
    const itinerary = [];

    for (let i = 0; i < days; i++) {
        const dayPlan = {
            day: i + 1,
            date: `Day ${i + 1}`,
            hotel: cart.hotels[0] || null,
            activities: [],
            meals: []
        };

        // Distribute activities across days
        if (cart.activities[i]) {
            dayPlan.activities.push(cart.activities[i]);
        }

        itinerary.push(dayPlan);
    }

    return itinerary;
}

// ===== CSS FOR NOTIFICATIONS =====
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .tp-notification {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    }
    
    .tp-notification-success { border-left: 4px solid #22c55e; }
    .tp-notification-success i { color: #22c55e; }
    
    .tp-notification-warning { border-left: 4px solid #f59e0b; }
    .tp-notification-warning i { color: #f59e0b; }
    
    .tp-notification-info { border-left: 4px solid #3b82f6; }
    .tp-notification-info i { color: #3b82f6; }
    
    .tp-notification.fade-out {
        animation: slideOut 0.3s ease forwards;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .cart-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #ef4444;
        color: white;
        font-size: 10px;
        font-weight: 700;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Auth Styles */
    .user-profile-nav {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        padding: 6px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .nav-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
    }
    .nav-username {
        color: white;
        font-weight: 600;
        font-size: 14px;
    }
    .btn-logout {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        font-size: 16px;
        transition: color 0.2s;
        padding: 4px;
        display: flex;
        align-items: center;
    }
    .btn-logout:hover { color: #ff4d4d; }

    .user-profile-header {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
    }
    .header-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid #e2e8f0;
    }
    .header-logout-btn {
        background: #f1f5f9;
        border: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #64748b;
        font-size: 10px;
        transition: all 0.2s;
        position: absolute;
        bottom: -2px;
        right: -2px;
        border: 2px solid white;
    }
    .header-logout-btn:hover { background: #fee2e2; color: #ef4444; }
`;
document.head.appendChild(notificationStyles);

// Export for use in other scripts
window.TripPlanner = TripPlanner;
window.Auth = Auth;
window.SampleData = SampleData;
