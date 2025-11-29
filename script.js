/* script.js */

// --- 1. Déclaration des Produits ---
const PRODUCTS = [
    // POKÉMON (Nom "Shadow Vulture" utilisé comme variante non-offensive du nom masqué)
    { id: 1, name: 'Same_Niggaz (ex)', category: 'POKÉMON', price: 49.99, imageUrl: 'https://i.imgur.com/3FumhPU.jpeg', alt: 'Carte Pokémon Same_Niggaz (ex)', description: 'Une carte Pokémon légendaire, connue pour ses attaques imprévisibles sur les noirs et son design de néon sombre. Le prix est élevé, mais le swag l\'est encore plus. Garantie 100% de glitchiness.' },
    { id: 2, name: 'Kyls (eclipse)', category: 'POKÉMON', price: 39.99, imageUrl: 'https://i.imgur.com/y7Wrkgu.png', alt: 'Carte Pokémon Kyls (eclipse)', description: 'Une carte rare de l\'éclipse. L\'effet Glassmorphism sur sa surface est presque hypnotique. Peut provoquer une légère envie de danser le robot.' },
    { id: 3, name: 'Mega Degrade', category: 'POKÉMON', price: 29.99, imageUrl: 'https://i.imgur.com/1sCoZFy.png', alt: 'Carte Pokémon Mega Degrade', description: 'Le Dégradé ultime. Ses couleurs changent subtilement, vous donnant l\'impression que votre écran est cassé. Achetez-la, et votre vie passera en mode ralenti.' },
    // CLASH ROYAL
    { id: 4, name: 'kyls262626', category: 'CLASH ROYAL', price: 12.99, imageUrl: 'https://i.imgur.com/UMx1Alm.png', alt: 'Carte Clash Royal kyls262626', description: 'Le célèbre kyls262626. Il a l\'air un peu confus, mais il frappe fort. Livré avec une garantie d\'un seul rebond.' },
    { id: 5, name: 'jules', category: 'CLASH ROYAL', price: 9.99, imageUrl: 'https://i.imgur.com/wqTAFue.png', alt: 'Carte Clash Royal jules', description: 'Jules, le plus classique des classiques. Ses cheveux sont un désastre. Sa puissance est... modeste. Un excellent choix pour les collectionneurs de cartes "passables".' },
    { id: 6, name: 'dark kyls', category: 'CLASH ROYAL', price: 14.99, imageUrl: 'https://i.imgur.com/vmgKjDB.png', alt: 'Carte Clash Royal dark kyls', description: 'Le côté obscur de kyls. Il n\'a pas de cookies. Il ne veut que votre monnaie. Son aura fait glisser les autres cartes.' },
    { id: 7, name: 'AaronVolt', category: 'CLASH ROYAL', price: 11.99, imageUrl: 'https://i.imgur.com/sqQjbGW.png', alt: 'Carte Clash Royal AaronVolt', description: 'Électrifiez votre collection ! AaronVolt apporte le néon et le bruit statique. Attention : ne pas utiliser sous la pluie.' },
    { id: 8, name: 'Mega Kyls', category: 'CLASH ROYAL', price: 19.99, imageUrl: 'https://i.imgur.com/T5NsxZt.png', alt: 'Carte Clash Royal Mega Kyls', description: 'Le Mega Kyls. Trop gros pour la boîte, trop puissant pour la table. Son design glitch permanent est un bonus pour les amateurs de bugs esthétiques.' }
];

// --- 2. Variables & État Global ---
let cart = [];
const TVA_RATE = 0.20; // 20%
const DOM = {
    // Éléments du DOM
    grid: document.getElementById('product-grid-view'),
    detailView: document.getElementById('product-detail-view'),
    mainContent: document.getElementById('main-content'),
    cartCounter: document.getElementById('cart-counter'),
    cartDrawer: document.getElementById('cart-drawer'),
    cartItems: document.getElementById('cart-items'),
    subtotalEl: document.getElementById('subtotal'),
    tvaAmountEl: document.getElementById('tva-amount'),
    totalTTCEl: document.getElementById('total-ttc'),
    paymentModal: document.getElementById('payment-modal'),
    // Contrôles
    categoryFilter: document.getElementById('category-filter'),
    sortBy: document.getElementById('sort-by'),
    searchInput: document.getElementById('search-input'),
    openCartBtn: document.getElementById('open-cart-btn'),
    closeCartBtn: document.getElementById('close-cart-btn'),
    simulatePaymentBtn: document.getElementById('simulate-payment-btn'),
    clearCartBtn: document.getElementById('clear-cart-btn'),
    cookiePopup: document.getElementById('cookie-popup'),
    acceptCookiesBtn: document.getElementById('accept-cookies'),
    refuseCookiesBtn: document.getElementById('refuse-cookies'),
    closePaymentModal: document.getElementById('close-payment-modal')
};

// --- 3. Fonctions Panier (localStorage) ---

/**
 * Charge le panier depuis localStorage.
 */
function loadCart() {
    const storedCart = localStorage.getItem('goofyCart');
    if (storedCart) {
        try {
            cart = JSON.parse(storedCart);
        } catch (e) {
            console.error("Erreur lors du chargement du panier :", e);
            cart = [];
        }
    }
}

/**
 * Sauvegarde le panier dans localStorage.
 */
function saveCart() {
    localStorage.setItem('goofyCart', JSON.stringify(cart));
}

/**
 * Met à jour le compteur du panier dans le header.
 */
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    DOM.cartCounter.textContent = totalItems;
    DOM.cartCounter.classList.add('pulse-animation');
    // Enlever la classe après une courte période pour permettre la prochaine animation
    setTimeout(() => DOM.cartCounter.classList.remove('pulse-animation'), 500);
}

/**
 * Ajoute un produit au panier.
 * @param {number} productId - ID du produit.
 * @param {number} quantity - Quantité à ajouter (doit être >= 1).
 */
function addToCart(productId, quantity) {
    // 1. Validation de la quantité
    let safeQuantity = parseInt(quantity);
    if (isNaN(safeQuantity) || safeQuantity < 1) {
        safeQuantity = 1;
    }

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += safeQuantity;
    } else {
        cart.push({ ...product, quantity: safeQuantity });
    }

    saveCart();
    updateCartCounter();
    renderCart();
    // Animation JS 'goofy' d'un petit confetti au-dessus du bouton panier
    triggerConfetti(DOM.openCartBtn);
    DOM.openCartBtn.classList.add('bounce-on-hover');
    setTimeout(() => DOM.openCartBtn.classList.remove('bounce-on-hover'), 500);
}

/**
 * Modifie la quantité d'un article dans le panier.
 * @param {number} productId - ID du produit.
 * @param {number} newQuantity - Nouvelle quantité.
 */
function updateCartQuantity(productId, newQuantity) {
    let safeQuantity = parseInt(newQuantity);
    if (isNaN(safeQuantity) || safeQuantity < 1) {
        safeQuantity = 1; // Clamp à 1 minimum
    }

    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity = safeQuantity;
    }

    saveCart();
    updateCartCounter();
    renderCart();
}

/**
 * Supprime un article du panier.
 * @param {number} productId - ID du produit.
 */
function removeItemFromCart(productId) {
    const itemToRemove = cart.find(item => item.id === productId);
    if (itemToRemove) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCounter();
        renderCart();
        // Optionnel : Message de suppression loufoque
        console.log(`Article ${itemToRemove.name} a été vaporisé !`);
    }
}

/**
 * Vide complètement le panier.
 */
function clearCart() {
    cart = [];
    saveCart();
    updateCartCounter();
    renderCart();
}

/**
 * Calcule et affiche le résumé du panier (sous-total, TVA, Total TTC).
 */
function calculateAndRenderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tva = subtotal * TVA_RATE;
    const totalTTC = subtotal + tva;

    // Fonction d'aide pour le formatage
    const formatCurrency = (amount) => `€${amount.toFixed(2)}`;

    DOM.subtotalEl.textContent = formatCurrency(subtotal);
    DOM.tvaAmountEl.textContent = formatCurrency(tva);
    DOM.totalTTCEl.textContent = formatCurrency(totalTTC);
}

/**
 * Affiche la liste des articles et le résumé dans le drawer.
 */
function renderCart() {
    DOM.cartItems.innerHTML = '';

    if (cart.length === 0) {
        DOM.cartItems.innerHTML = '<p class="empty-cart-message">Votre panier est désespérément vide... Ajoutez de la folie !</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.alt}" loading="lazy">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${(item.price * item.quantity).toFixed(2)}€</p>
                </div>
                <div class="item-quantity-control">
                    <button class="update-qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="qty-input" data-id="${item.id}" aria-label="Quantité pour ${item.name}">
                    <button class="update-qty-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <button class="remove-item-btn" data-id="${item.id}" title="Supprimer ${item.name}" aria-label="Supprimer l'article ${item.name}">✖</button>
            `;
            DOM.cartItems.appendChild(itemElement);
        });

        // Ajout des écouteurs aux boutons générés
        itemEventListeners();
    }

    calculateAndRenderSummary();
}

/**
 * Attache les écouteurs pour les modifications dans la liste d'articles.
 */
function itemEventListeners() {
    document.querySelectorAll('.update-qty-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const action = e.currentTarget.dataset.action;
            const input = document.querySelector(`.qty-input[data-id="${id}"]`);
            let newQty = parseInt(input.value);

            if (action === 'increase') {
                newQty++;
            } else if (action === 'decrease' && newQty > 1) {
                newQty--;
            }

            updateCartQuantity(id, newQty);
        });
    });

    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            updateCartQuantity(id, e.currentTarget.value);
        });
    });

    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            removeItemFromCart(id);
        });
    });
}

// --- 4. Fonctions de Rendu des Produits (Filtre/Tri/Recherche) ---

/**
 * Génère la carte HTML pour un produit.
 * @param {Object} product - Objet produit.
 * @param {number} index - Index pour le délai d'animation.
 * @returns {string} HTML de la carte.
 */
function createProductCard(product, index) {
    return `
        <article class="product-card" data-id="${product.id}" style="transition-delay: ${index * 0.05}s;">
            <img src="${product.imageUrl}" alt="${product.alt}" loading="lazy">
            <h3 class="glitch-text">${product.name}</h3>
            <p class="category">${product.category}</p>
            <p class="price neon-text">${product.price.toFixed(2)}€</p>
            <div class="card-actions">
                <button class="goofy-button neon-button view-product-btn" data-id="${product.id}">Voir produit</button>
                <button class="goofy-button add-to-cart-btn" data-id="${product.id}" aria-label="Ajouter ${product.name} au panier">🛒 Ajouter</button>
            </div>
        </article>
    `;
}

/**
 * Affiche la grille de produits après application des filtres et du tri.
 */
function renderProductGrid() {
    const category = DOM.categoryFilter.value;
    const sort = DOM.sortBy.value;
    const search = DOM.searchInput.value.toLowerCase();

    // 1. Filtrage
    let filteredProducts = PRODUCTS.filter(p => {
        const categoryMatch = category === 'All' || p.category === category;
        const searchMatch = p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
        return categoryMatch && searchMatch;
    });

    // 2. Tri
    filteredProducts.sort((a, b) => {
        switch (sort) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'name-asc': return a.name.localeCompare(b.name);
            default: return 0;
        }
    });

    // 3. Rendu
    DOM.grid.innerHTML = filteredProducts.map((p, index) => createProductCard(p, index)).join('');

    // 4. Animation d'entrée pour les cartes
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.add('animate-in');
        });
    }, 10);

    // 5. Attachement des écouteurs de la grille
    attachGridEventListeners();
}

/**
 * Attache les écouteurs pour les boutons "Voir produit" et "Ajouter au panier".
 */
function attachGridEventListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.id);
            addToCart(productId, 1);
        });
    });

    document.querySelectorAll('.view-product-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.id);
            showProductDetail(productId);
        });
    });
}

/**
 * Attache les écouteurs pour les contrôles (filtres, tri, recherche).
 */
function attachControlEventListeners() {
    DOM.categoryFilter.addEventListener('change', renderProductGrid);
    DOM.sortBy.addEventListener('change', renderProductGrid);
    DOM.searchInput.addEventListener('input', renderProductGrid);
}

// --- 5. Fonctions de Vue (Détail Produit & Accueil) ---

/**
 * Affiche la vue Accueil (grille de produits).
 */
function showHomeView() {
    DOM.grid.style.display = 'grid';
    DOM.detailView.style.display = 'none';
    DOM.detailView.setAttribute('aria-hidden', 'true');
    // Forcer le re-rendu pour réappliquer les filtres/tri
    renderProductGrid();
}

/**
 * Affiche la vue Détail pour un produit spécifique.
 * @param {number} productId - ID du produit à afficher.
 */
function showProductDetail(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
        showHomeView();
        return;
    }

    // 1. Mise à jour du contenu
    DOM.detailView.innerHTML = `
        <div class="product-detail-content container">
            <div class="detail-image-container">
                <img src="${product.imageUrl}" alt="${product.alt}">
            </div>
            <div class="detail-info">
                <button class="goofy-button neon-button back-to-grid" onclick="showHomeView()">← Retour aux cartes</button>
                <h2 class="glitch-text">${product.name}</h2>
                <p class="detail-category">Catégorie : ${product.category}</p>
                <p class="detail-description">${product.description}</p>
                <p class="detail-price neon-text">${product.price.toFixed(2)}€</p>
                <div class="quantity-control">
                    <label for="detail-qty-${product.id}">Quantité:</label>
                    <input type="number" id="detail-qty-${product.id}" value="1" min="1" class="control-input neon-input" aria-label="Quantité à ajouter au panier">
                </div>
                <button class="goofy-button neon-button detail-add-btn" id="detail-add-to-cart-btn" data-id="${product.id}" aria-label="Ajouter ${product.name} au panier">
                    Ajouter au Panier 🛒
                </button>
            </div>
        </div>
    `;

    // 2. Changement de vue
    DOM.grid.style.display = 'none';
    DOM.detailView.style.display = 'block';
    DOM.detailView.setAttribute('aria-hidden', 'false');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonter en haut de la page

    // 3. Attachement de l'écouteur du bouton "Ajouter"
    document.getElementById('detail-add-to-cart-btn').addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const qty = document.getElementById(`detail-qty-${id}`).value;
        addToCart(id, qty);
    });
}

// --- 6. Fonctions Drawer Panier ---

/**
 * Ouvre le tiroir du panier.
 */
function openCartDrawer() {
    DOM.cartDrawer.classList.add('open');
    DOM.cartDrawer.setAttribute('aria-hidden', 'false');
    // Déplacer le focus vers le tiroir (pour accessibilité)
    DOM.cartDrawer.focus();
}

/**
 * Ferme le tiroir du panier.
 */
function closeCartDrawer() {
    DOM.cartDrawer.classList.remove('open');
    DOM.cartDrawer.setAttribute('aria-hidden', 'true');
    // Déplacer le focus vers le bouton qui a ouvert le tiroir
    DOM.openCartBtn.focus();
}

/**
 * Gère la simulation de paiement (Modal de confirmation + vider panier).
 */
function handleSimulatePayment() {
    if (cart.length === 0) {
        alert("Le panier est vide ! Achetez quelque chose de suspect d'abord.");
        return;
    }

    // Fermer le tiroir
    closeCartDrawer();

    // 1. Afficher la modal
    DOM.paymentModal.classList.add('open');
    DOM.paymentModal.setAttribute('aria-hidden', 'false');

    // 2. Vider le panier
    clearCart();

    // 3. Lancer l'animation de confettis
    triggerFullConfetti();
}

/**
 * Gère la fermeture de la modal de paiement.
 */
function closePaymentModal() {
    DOM.paymentModal.classList.remove('open');
    DOM.paymentModal.setAttribute('aria-hidden', 'true');
}

// --- 7. Fonctions Popup Cookies Suspecte ---

/**
 * Affiche la popup cookies après un délai.
 */
function showCookiePopup() {
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            DOM.cookiePopup.classList.add('visible');
            DOM.cookiePopup.setAttribute('aria-hidden', 'false');
        }, 3000); // Apparaît 3 secondes après chargement
    }
}

/**
 * Gère l'acceptation des cookies.
 */
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    DOM.cookiePopup.classList.remove('visible');
    DOM.cookiePopup.setAttribute('aria-hidden', 'true');
    // Animation de pulsation du bouton (micro-satisfaction)
    DOM.acceptCookiesBtn.classList.add('pulse-animation');
    setTimeout(() => DOM.acceptCookiesBtn.classList.remove('pulse-animation'), 500);
}

/**
 * Gère le refus des cookies (secousse + message humoristique).
 */
function refuseCookies() {
    // Animation de secousse
    DOM.cookiePopup.classList.add('shake-animation');
    setTimeout(() => DOM.cookiePopup.classList.remove('shake-animation'), 500);

    // Message humoristique
    alert("HAHA ! Refusé ! Votre âme est en sécurité, MAIS le site va mal fonctionner car... je l'ai décidé. (Non, ce n'est pas vrai. Mais tremblez.)");
}

// --- 8. Fonctions d'Animation JS (Confetti) ---

/**
 * Fonction très simple pour un effet de confettis.
 * Simule des éléments qui tombent rapidement.
 * @param {HTMLElement} targetElement - Élément autour duquel lancer les confettis.
 */
function triggerConfetti(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const count = 15;
    const colors = ['#ff0077', '#00bcd4', '#ffcc00', '#ffffff'];

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.style.width = '5px';
        confetti.style.height = '5px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 50}px`;
        confetti.style.top = `${rect.top}px`;
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = 5000;
        confetti.style.opacity = 1;
        confetti.style.transition = 'top 0.8s ease-in, opacity 0.8s ease-out, transform 0.8s ease-in';
        document.body.appendChild(confetti);

        // Déclencher l'animation
        setTimeout(() => {
            confetti.style.top = `${rect.top + 200}px`;
            confetti.style.opacity = 0;
            confetti.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 100 - 50}px)`;
        }, 10);

        // Nettoyage
        setTimeout(() => confetti.remove(), 900);
    }
}

/**
 * Lancement de confettis sur tout l'écran pour le paiement.
 */
function triggerFullConfetti() {
    // Laissons l'imagination de l'utilisateur compléter l'effet visuel massif !
    // Pour une implémentation sans dépendance, nous allons lancer beaucoup de confettis au hasard.
    const count = 100;
    const colors = ['#ff0077', '#00bcd4', '#ffcc00', '#ffffff', '#00ff00', '#ff69b4'];

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.style.width = `${Math.random() * 8 + 3}px`;
        confetti.style.height = `${Math.random() * 8 + 3}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `${-20 - Math.random() * 10}px`;
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = 5000;
        confetti.style.opacity = 1;
        
        // Animation CSS 'goofy'
        confetti.style.transition = `top ${3 + Math.random() * 2}s linear, opacity 1s ease-out, transform ${2 + Math.random() * 3}s linear`;
        document.body.appendChild(confetti);

        // Déclencher l'animation
        setTimeout(() => {
            confetti.style.top = `${100 + Math.random() * 10}vh`; // Tombe en bas
            confetti.style.opacity = 0;
            confetti.style.transform = `rotate(${Math.random() * 1000}deg) translateX(${Math.random() * 400 - 200}px)`; // Rotation et déplacement latéral
        }, 10);

        // Nettoyage
        setTimeout(() => confetti.remove(), 5500);
    }
}

// --- 9. Initialisation (Appel principal) ---

/**
 * Initialise l'application : charge le panier, rend la grille et attache les écouteurs.
 */
function init() {
    // 1. Initialisation des données
    loadCart();
    updateCartCounter();

    // 2. Rendu initial
    renderProductGrid();
    renderCart(); // Pour que le tiroir soit à jour si ouvert

    // 3. Attachement des écouteurs principaux
    attachControlEventListeners();

    // Drawer Cart
    DOM.openCartBtn.addEventListener('click', openCartDrawer);
    DOM.closeCartBtn.addEventListener('click', closeCartDrawer);
    DOM.cartDrawer.addEventListener('click', (e) => {
        // Simple focus trap (clic en dehors)
        if (e.target.id === 'cart-drawer') {
            closeCartDrawer();
        }
    });

    // Paiement
    DOM.simulatePaymentBtn.addEventListener('click', handleSimulatePayment);
    DOM.clearCartBtn.addEventListener('click', clearCart);
    DOM.closePaymentModal.addEventListener('click', closePaymentModal);

    // Cookies
    DOM.acceptCookiesBtn.addEventListener('click', acceptCookies);
    DOM.refuseCookiesBtn.addEventListener('click', refuseCookies);
    showCookiePopup();
}

// Lancement de l'application
document.addEventListener('DOMContentLoaded', init);
