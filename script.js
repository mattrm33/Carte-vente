/* script.js */
// ===============================================
// 1. DATA DES CARTES ET SONS
// ===============================================
const CARDS = [
    { id: 1, name: 'Carte Eclipse Kyls', type: 'POKÉMON', price: 39.99, image: 'https://i.imgur.com/y7Wrkgu.png', description: 'Une carte tellement rare qu\'elle n\'existe pas. Attaque : Moonwalk de la Mort (300 dégâts, mais seulement si vous êtes en chaussettes). Faiblesse : le Lundi matin.' },
    { id: 2, name: 'Mega Degrade', type: 'POKÉMON', price: 99.99, image: 'https://i.imgur.com/1sCoZFy.png', description: 'Cette carte est un crime contre l\'esthétique. Son pouvoir ? Rendre vos adversaires aveugles de rage. Coût en Énergie : 5 Énergies de Merde.' },
    { id: 3, name: 'kyls262626', type: 'CLASH ROYAL', price: 0.99, image: 'https://i.imgur.com/UMx1Alm.png', description: 'La carte que personne ne voulait, mais que tout le monde reçoit en triple. Capacité Spéciale : Dégâts auto-destructeurs (elle vous enlève des trophées). À chier, mais c\'est pas cher.' },
    { id: 4, name: 'jules', type: 'CLASH ROYAL', price: 4.99, image: 'https://i.imgur.com/wqTAFue.png', description: 'La carte "Ami du Dev". Elle ne sert à rien. Vraiment. Mais elle a un joli chapeau. PV : 4. Attaque : 0. Charisme : -6. Le prix de la nullité.' },
    { id: 5, name: 'dark kyls', type: 'CLASH ROYAL', price: 67.99, image: 'https://i.imgur.com/vmgKjDB.png', description: 'L\'incarnation du chaos adolescent. Ses attaques sont si puissantes qu\'elles font planter le serveur de jeu. Attention, cette carte sent le chibre. Effet : Glitch + Tremblement.' },
    { id: 6, name: 'AaronVolt', type: 'CLASH ROYAL', price: 11.99, image: 'https://i.imgur.com/sqQjbGW.png', description: 'Un volt ? Non. Un Aaron. Une légende raconte qu\'il a gagné une partie en ne jouant que des cartes communes. Attaque : Moonwalk inversé. Nécessite une autorisation parentale.' },
    { id: 7, name: 'Mega Kyls', type: 'CLASH ROYAL', price: 19.99, image: 'https://i.imgur.com/T5NsxZt.png', description: 'Version améliorée de Kyls, mais avec 4% d\'efficacité en moins. Elle peut invoquer un nuage de confettis qui distrait l\'adversaire. Prix de lancement : 19.99, le prix de l\'absurdité.' }
];

const SOUNDS = [
    { name: 'Son 1: Le Prout Glitché', url: 'https://www.youtube.com/shorts/02ZWX4ftGA8' },
    { name: 'Son 2: La Voix du Chaos', url: 'https://www.youtube.com/shorts/4kE23N7Olcw' },
    { name: 'Son 3: Pourquoi ?', url: 'https://www.youtube.com/shorts/yFRwHDyzL6Q' },
    { name: 'Son 4: L\'Inconnu', url: 'https://www.youtube.com/shorts/BjYmkJk7COc' }
];

const CACASOUND_DURATION_MS = 200; 

// ===============================================
// 2. ROUTING (Sections)
// ===============================================
const router = {
    views: ['shop-view', 'cart-view', 'instant-goofy-view'],
    navigate(viewId) {
        this.views.forEach(id => {
            const view = document.getElementById(id);
            if (view) {
                view.classList.add('hidden');
            }
        });
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
        if (viewId === 'cart-view') {
            cart.renderCart();
        }
    }
};

// ===============================================
// 3. PANIER (Cart)
// ===============================================
const VAT_RATE = 1.63; // 163%
const cart = {
    key: 'kyls-absurd-cart',
    items: [],

    init() {
        this.items = JSON.parse(localStorage.getItem(this.key)) || [];
        this.updateCartCounter();
        this.renderShop();
        router.navigate('shop');
        
        document.getElementById('checkout-button').addEventListener('click', () => {
            this.checkout();
        });
    },

    saveCart() {
        localStorage.setItem(this.key, JSON.stringify(this.items));
        this.updateCartCounter();
        this.renderCart();
    },

    updateCartCounter() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-counter').textContent = totalItems;
    },

    addToCart(cardId) {
        const card = CARDS.find(c => c.id === cardId);
        const existingItem = this.items.find(item => item.id === cardId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else if (card) {
            this.items.push({
                id: card.id,
                name: card.name,
                price: card.price,
                quantity: 1
            });
        }
        this.saveCart();
        popups.showRandomPopup('Article ajouté ! Vous venez de gagner 1 point de coolitude !');
    },

    updateQuantity(itemId, delta) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.items = this.items.filter(i => i.id !== itemId);
            }
            this.saveCart();
        }
    },

    removeItem(itemId) {
        this.items = this.items.filter(i => i.id !== itemId);
        this.saveCart();
        popups.showRandomPopup('Article supprimé. Mais vous êtes sûr ? C\'était très absurde.');
    },

    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const vat = subtotal * VAT_RATE;
        const total = subtotal + vat;
        return { subtotal, vat, total };
    },

    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const { subtotal, vat, total } = this.calculateTotals();
        
        cartItemsContainer.innerHTML = '';

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="glitch-text">Votre panier est aussi vide que la tête de Kyls. Allez acheter des choses inutiles.</p>';
        } else {
            this.items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item shake-hard';
                itemEl.innerHTML = `
                    <span>${item.name} (${item.price.toFixed(2)}€/u)</span>
                    <div class="quantity-controls">
                        <button onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                        <button onclick="cart.removeItem(${item.id})" class="neon-red-text" style="background:none; border:none;">[X]</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)}€`;
        document.getElementById('vat').textContent = `${vat.toFixed(2)}€`;
        document.getElementById('total-price').textContent = `${total.toFixed(2)}€`;
    },

    renderShop() {
        const cardList = document.getElementById('card-list');
        cardList.innerHTML = '';
        CARDS.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.innerHTML = `
                <img src="${card.image}" alt="${card.name}" class="wiggle">
                <h3 class="neon-pink-text">${card.name} (${card.type})</h3>
                <p class="glitch-text">${card.description}</p>
                <p><strong>Prix Absurde : ${card.price.toFixed(2)}€</strong></p>
                <button class="buy-button" onclick="cart.addToCart(${card.id})">AJOUTER AU CHAOS</button>
            `;
            cardList.appendChild(cardEl);
        });
    },

    checkout() {
        if (this.items.length === 0) {
            popups.showPopup('popup-caca-alerte');
            return;
        }
        
        const { total } = this.calculateTotals();
        popups.showCustomPopup(`
            <h2 class="neon-red-text shake-hard">PAIEMENT EN COURS...</h2>
            <p>Félicitations ! Vous payez <strong class="glitch-text">${total.toFixed(2)}€</strong> avec une TVA de 163%.</p>
            <p>Le serveur de paiement est en train de faire une danse du ventre. Veuillez patienter 4 minutes 32 secondes.</p>
            <p class="neon-red-text">ERREUR ! Votre carte a été refusée pour "Excès de Charisme". Votre commande est validée quand même. Merci de votre stupidité.</p>
        `, 'Paiement Goofy', 'shake-hard');
        
        this.items = [];
        this.saveCart();
    }
};

// ===============================================
// 4. SONS HERVÉ (Goofy Button Panel)
// ===============================================
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let cacaButtonRevealed = false;

const goofySounds = {
    renderPanel() {
        const panel = document.getElementById('goofy-buttons');
        panel.innerHTML = '';

        SOUNDS.forEach((sound, index) => {
            const button = this.createSoundButton(sound.name, `playSound(${index})`);
            panel.appendChild(button);
        });
        
        const cacaButton = this.createSoundButton('caca', 'playCacaSound()', 'caca-button hidden', 'caca-btn');
        panel.appendChild(cacaButton);
    },

    createSoundButton(text, action, className = '', id = '') {
        const button = document.createElement('button');
        button.className = `sound-button decalage-rage ${className}`;
        button.id = id;
        button.textContent = text;
        button.setAttribute('onclick', action);
        
        // Logique de décalage au survol (rage)
        button.addEventListener('mouseover', (e) => {
            button.style.setProperty('--random-x', Math.floor(Math.random() * 20) - 10);
            button.style.setProperty('--random-y', Math.floor(Math.random() * 20) - 10);
        });
        button.addEventListener('mouseout', (e) => {
            button.style.setProperty('--random-x', 0);
            button.style.setProperty('--random-y', 0);
        });
        
        return button;
    }
};

window.playSound = (index) => {
    const sound = SOUNDS[index];
    
    // Révéler le bouton caca
    if (!cacaButtonRevealed) {
        document.getElementById('caca-btn').classList.remove('hidden');
        cacaButtonRevealed = true;
        popups.showPopup('popup-caca-alerte-resolue');
    }
    
    // Jouer le son (tentative d'utiliser l'URL YouTube)
    const audioEl = new Audio(sound.url);
    audioEl.volume = 0.5;
    audioEl.play().catch(e => console.error("Erreur de lecture audio (probablement CORS/autoplay) :", e));
    
    // Popup inutile
    popups.showCustomPopup(`Bravo tu as cliqué sur ${sound.name} ! Quel génie.`, 'Félicitations');
};

window.playCacaSound = () => {
    // Son très fort avec Web Audio API (amplification max)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Réglage pour l'EXTRÊME volume (50.0 est très fort)
    gainNode.gain.setValueAtTime(50.0, audioContext.currentTime); 

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + (CACASOUND_DURATION_MS / 1000));
    
    // Popup inquiétante
    popups.showCustomPopup(`
        <h2 class="neon-red-text glitch-text">ALERTE NUCLÉAIRE !</h2>
        <p>Le bouton <strong>caca</strong> a été activé. Veuillez éteindre votre ordinateur IMMÉDIATEMENT. La police du web arrive.</p>
        <img src="https://i.imgur.com/vmgKjDB.png" alt="caca" style="width: 50px;">
    `, 'MEGA DANGER', 'shake-hard');
};

// ===============================================
// 5. POP-UPS INUTILES ET ABSURDES
// ===============================================
const POPUP_MESSAGES = {
    'popup-gay': { title: 'Notification Cruciale', content: 'Tu es gay maintenant. C\'est la nouvelle loi du site.', class: 'popup-1' },
    'popup-cookies': { title: 'Alerte Légale', content: 'Voulez-vous accepter les cookies suspects ? (OUI/OUI)', class: 'popup-2' },
    'popup-charisme': { title: 'Statistiques Mises à Jour', content: 'Vous venez de perdre 6-7 points de charisme. Re-scrollez pour en gagner.', class: 'popup-3' },
    'popup-scroll': { title: 'Attention Pilote', content: 'Ralentis, champion. Tu scrolls trop vite. C\'est un site, pas un avion.', class: 'popup-4' },
    'popup-insulte': { title: 'Conseil Amical', content: 'Hey champion, t’es nul dans la vie. Mais on t\'aime quand même.', class: 'popup-1' },
    'popup-caca-alerte': { title: 'Alerte Critique', content: 'Alerte : bouton caca non détecté. Votre panier est invalide.', class: 'popup-4' },
    'popup-caca-alerte-resolue': { title: 'Alerte Désactivée', content: 'Le bouton caca est maintenant visible. Préparez vos oreilles.', class: 'popup-3' },
    'popup-inactivite': { title: 'Bonjour ?', content: 'T\'es toujours là ? Ça fait une seconde que t\'as rien fait. C\'est louche.', class: 'popup-2' }
};

const popups = {
    container: document.getElementById('popup-container'),
    inactivityTimer: null,
    lastScrollY: 0,
    
    init() {
        // 5. Ouvre quand on ne fait rien (1 seconde)
        document.addEventListener('mousemove', this.resetInactivityTimer);
        document.addEventListener('keydown', this.resetInactivityTimer);
        this.resetInactivityTimer();
        
        // 4. Ouvre quand on scroll trop vite
        window.addEventListener('scroll', this.checkFastScroll);
        
        // Popups aléatoires au chargement
        setTimeout(() => this.showPopup('popup-gay'), 1000);
        setTimeout(() => this.showPopup('popup-cookies'), 3000);
        setTimeout(() => this.showPopup('popup-insulte'), 5000);
    },

    resetInactivityTimer() {
        clearTimeout(popups.inactivityTimer);
        // Utiliser une fonction fléchée pour éviter la confusion de `this`
        popups.inactivityTimer = setTimeout(() => popups.showPopup('popup-inactivite'), 1000);
    },

    checkFastScroll() {
        const currentScrollY = window.scrollY;
        const delta = Math.abs(currentScrollY - popups.lastScrollY);
        
        if (delta > 100) {
            if (!popups.container.querySelector('.popup-scroll')) { 
                popups.showPopup('popup-scroll');
            }
        }
        popups.lastScrollY = currentScrollY;
    },

    createPopup(key, message, title, extraClass = '') {
        const popupEl = document.createElement('div');
        popupEl.className = `absurd-popup ${message.class || 'popup-1'} ${extraClass} ${key}`;
        popupEl.style.left = `${Math.floor(Math.random() * 60) + 10}%`;
        popupEl.style.top = `${Math.floor(Math.random() * 60) + 10}%`;
        popupEl.innerHTML = `
            <h3>${title || message.title}</h3>
            <p>${message.content}</p>
            <button class="popup-close" onclick="this.parentNode.remove()">X</button>
        `;
        
        popupEl.style.transform = `rotate(${Math.floor(Math.random() * 30) - 15}deg)`;
        return popupEl;
    },
    
    showPopup(key) {
        if (POPUP_MESSAGES[key]) {
            this.container.appendChild(this.createPopup(key, POPUP_MESSAGES[key]));
            // Auto-fermeture
            setTimeout(() => {
                const el = this.container.querySelector(`.${key}`);
                if (el) el.remove();
            }, 5000);
        }
    },
    
    showRandomPopup(customContent) {
        const keys = Object.keys(POPUP_MESSAGES).filter(k => !k.includes('caca-'));
        const key = keys[Math.floor(Math.random() * keys.length)];
        
        if (customContent) {
             this.showCustomPopup(customContent, 'Notification WTF');
        } else {
            this.showPopup(key);
        }
    },
    
    showCustomPopup(htmlContent, title, extraClass = '') {
        const popupEl = document.createElement('div');
        popupEl.className = `absurd-popup popup-custom ${extraClass}`;
        popupEl.style.left = `${Math.floor(Math.random() * 60) + 10}%`;
        popupEl.style.top = `${Math.floor(Math.random() * 60) + 10}%`;
        popupEl.innerHTML = `
            <h3>${title}</h3>
            <div>${htmlContent}</div>
            <button class="popup-close" onclick="this.parentNode.remove()">X</button>
        `;
        this.container.appendChild(popupEl);
        setTimeout(() => popupEl.remove(), 7000);
    }
};

// ===============================================
// 6. INITIALISATION GLOBALE
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
    goofySounds.renderPanel();
    popups.init();
});
