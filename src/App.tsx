import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Clock, Star, Plus, Minus, MessageCircle, Utensils, Coffee, Cake, Gift, Share2, Trophy, Zap, Heart, Users, Menu, X, ChefHat, Sparkles, Crown, Search, Filter, Loader2, CheckCircle, AlertCircle, Volume2, VolumeX, Flame } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  sauce?: string;
  category: string;
}

interface FormData {
  firstName: string;
  cart: CartItem[];
  remarks: string;
}

interface GameState {
  isPlaying: boolean;
  score: number;
  timeLeft: number;
  currentBurger: number;
  gameOver: boolean;
  highScore: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  popular?: boolean;
  bestseller?: boolean;
  premium?: boolean;
  image?: string;
  detailedDescription?: string;
  ingredients?: string[];
  allergens?: string[];
  nutritions?: {
    calories: number;
    proteines: string;
    lipides: string;
    glucides: string;
  };
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    cart: [],
    remarks: ''
  });

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('burgers');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [cartAnimation, setCartAnimation] = useState('');
  const [favorites, setFavorites] = useState<string[]>(JSON.parse(localStorage.getItem('soyaFavorites') || '[]'));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    timeLeft: 30,
    currentBurger: 0,
    gameOver: false,
    highScore: parseInt(localStorage.getItem('soyaHighScore') || '2025')
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const sauces = ['Ketchup', 'Mayo', 'Algérienne', 'Blanche', 'Barbecue', 'Curry'];
  const filters = ['Populaire', 'Premium', 'Végétarien', 'Épicé', 'Nouveau'];

  const products: Record<string, Product[]> = {
    burgers: [
      {
        id: 'burger-1',
        name: 'Burger Classique',
        description: '🔥 Notre signature ! Pain artisanal, steak haché juteux, salade croquante, tomate fraîche',
        price: 8.50,
        category: 'Burgers',
        popular: true,
        detailedDescription: 'Notre burger emblématique qui fait la réputation de Soya ! Un pain brioche artisanal légèrement grillé, un steak haché de bœuf 100% français (150g) cuit à la perfection, salade iceberg croquante, tomate française bien mûre, oignon rouge, cornichons croquants. Le tout accompagné de notre sauce signature maison.',
        ingredients: ['Pain brioche artisanal', 'Steak haché bœuf 150g', 'Salade iceberg', 'Tomate fraîche', 'Oignon rouge', 'Cornichons', 'Sauce signature'],
        allergens: ['Gluten', 'Œuf', 'Lait'],
        nutritions: { calories: 580, proteines: '28g', lipides: '32g', glucides: '45g' }
      },
      {
        id: 'burger-2',
        name: 'Burger Cheese',
        description: '🧀 Fromage cheddar fondant qui coule à chaque bouchée ! Un délice absolu',
        price: 9.00,
        category: 'Burgers',
        detailedDescription: 'La version gourmande de notre classique ! Même base que notre burger signature avec en plus une généreuse tranche de cheddar affiné qui fond délicatement sur le steak chaud. Un mariage parfait entre le goût authentique du bœuf et la douceur crémeuse du fromage.',
        ingredients: ['Pain brioche artisanal', 'Steak haché bœuf 150g', 'Cheddar affiné', 'Salade iceberg', 'Tomate fraîche', 'Oignon rouge', 'Sauce signature'],
        allergens: ['Gluten', 'Œuf', 'Lait'],
        nutritions: { calories: 650, proteines: '32g', lipides: '38g', glucides: '46g' }
      },
      {
        id: 'burger-3',
        name: 'Burger Bacon',
        description: '🥓 Bacon croustillant grillé à la perfection, un goût fumé irrésistible',
        price: 9.50,
        category: 'Burgers',
        detailedDescription: 'Pour les amateurs de saveurs fumées ! Notre burger classique sublimé par des tranches de bacon grillées à la plancha jusqu\'à obtenir ce croustillant parfait. Le bacon apporte cette note fumée et salée qui se marie à merveille avec la jutosité du steak.',
        ingredients: ['Pain brioche artisanal', 'Steak haché bœuf 150g', 'Bacon grillé', 'Salade iceberg', 'Tomate fraîche', 'Oignon rouge', 'Sauce BBQ'],
        allergens: ['Gluten', 'Œuf'],
        nutritions: { calories: 720, proteines: '35g', lipides: '45g', glucides: '47g' }
      },
      {
        id: 'burger-4',
        name: 'Burger Double',
        description: '💪 Pour les gros appétits ! Double steak, double plaisir, double satisfaction',
        price: 11.00,
        category: 'Burgers',
        bestseller: true
      },
      {
        id: 'burger-5',
        name: 'Burger Spicy',
        description: '🌶️ Attention ça pique ! Jalapeños et sauce épicée pour les aventuriers',
        price: 9.50,
        category: 'Burgers'
      },
      {
        id: 'burger-6',
        name: 'Burger Deluxe',
        description: '👑 Le roi des burgers ! Bacon, fromage, œuf, tout ce qu\'il faut pour régner',
        price: 12.00,
        category: 'Burgers',
        premium: true
      }
    ],
    sandwichs: [
      {
        id: 'sandwich-1',
        name: 'Sandwich Poulet',
        description: '🐔 Escalope de poulet tendre et juteuse, marinée dans nos épices secrètes',
        price: 7.00,
        category: 'Sandwichs',
        popular: true,
        detailedDescription: 'Une escalope de poulet fermier marinée 24h dans notre mélange d\'épices méditerranéennes, grillée à la plancha et servie dans un pain de campagne croustillant. Accompagnée de crudités fraîches et de notre sauce au yaourt grec.',
        ingredients: ['Pain de campagne', 'Escalope poulet fermier 120g', 'Salade', 'Tomate', 'Concombre', 'Sauce yaourt grec'],
        allergens: ['Gluten', 'Lait'],
        nutritions: { calories: 480, proteines: '32g', lipides: '18g', glucides: '52g' }
      },
      {
        id: 'sandwich-2',
        name: 'Sandwich Poulet Cheese',
        description: '🧀 Le mariage parfait : poulet fondant et fromage qui file !',
        price: 7.50,
        category: 'Sandwichs'
      },
      {
        id: 'sandwich-3',
        name: 'Sandwich Cordon Bleu',
        description: '🏆 Classique indémodable ! Jambon et fromage dans une panure dorée',
        price: 8.00,
        category: 'Sandwichs'
      },
      {
        id: 'sandwich-4',
        name: 'Sandwich Merguez',
        description: '🌶️ Merguez épicées grillées au feu de bois, un goût authentique',
        price: 7.50,
        category: 'Sandwichs'
      },
      {
        id: 'sandwich-5',
        name: 'Sandwich Mixte',
        description: '🥪 L\'équilibre parfait : jambon de qualité et fromage fondant',
        price: 6.50,
        category: 'Sandwichs'
      },
      {
        id: 'sandwich-6',
        name: 'Sandwich Végétarien',
        description: '🥬 Légumes grillés et fromage, savoureux et healthy !',
        price: 6.00,
        category: 'Sandwichs'
      }
    ],
    boissons: [
      {
        id: 'boisson-1',
        name: 'Coca-Cola',
        description: '🥤 La boisson mythique qui accompagne parfaitement nos burgers',
        price: 2.00,
        category: 'Boissons'
      },
      {
        id: 'boisson-2',
        name: 'Fanta Orange',
        description: '🍊 Pétillant et fruité, le plaisir à l\'état pur',
        price: 2.00,
        category: 'Boissons'
      },
      {
        id: 'boisson-3',
        name: 'Sprite',
        description: '✨ Fraîcheur citron-lime qui désaltère instantanément',
        price: 2.00,
        category: 'Boissons'
      },
      {
        id: 'boisson-4',
        name: 'Eau minérale',
        description: '💧 Pure et rafraîchissante, l\'hydratation parfaite',
        price: 1.50,
        category: 'Boissons'
      },
      {
        id: 'boisson-5',
        name: 'Jus d\'orange',
        description: '🍊 100% pur jus, vitamines et saveur garanties',
        price: 2.50,
        category: 'Boissons'
      },
      {
        id: 'boisson-6',
        name: 'Ice Tea',
        description: '🧊 Thé glacé aux pêches, la fraîcheur de l\'été',
        price: 2.00,
        category: 'Boissons'
      }
    ],
    desserts: [
      {
        id: 'dessert-1',
        name: 'Tiramisu',
        description: '🇮🇹 Recette italienne authentique, mascarpone et café, un voyage gustatif',
        price: 4.50,
        category: 'Desserts',
        popular: true
      },
      {
        id: 'dessert-2',
        name: 'Fondant au Chocolat',
        description: '🍫 Cœur coulant au chocolat noir, servi tiède, le bonheur absolu',
        price: 5.00,
        category: 'Desserts',
        bestseller: true
      },
      {
        id: 'dessert-3',
        name: 'Tarte aux Pommes',
        description: '🍎 Pâte brisée maison et pommes caramélisées, comme chez grand-mère',
        price: 4.00,
        category: 'Desserts'
      },
      {
        id: 'dessert-4',
        name: 'Crème Brûlée',
        description: '🔥 Crème onctueuse et sucre caramélisé, le dessert des gourmets',
        price: 4.50,
        category: 'Desserts'
      },
      {
        id: 'dessert-5',
        name: 'Mousse au Chocolat',
        description: '☁️ Légère comme un nuage, intense comme le chocolat noir',
        price: 3.50,
        category: 'Desserts'
      },
      {
        id: 'dessert-6',
        name: 'Cheesecake',
        description: '🍓 New-yorkais aux fruits rouges, crémeux à souhait',
        price: 5.50,
        category: 'Desserts',
        premium: true
      }
    ]
  };

  const tabs = [
    { id: 'burgers', name: 'Burgers', icon: Utensils, color: 'from-pink-500 to-red-500' },
    { id: 'sandwichs', name: 'Sandwichs', icon: Coffee, color: 'from-yellow-500 to-orange-500' },
    { id: 'boissons', name: 'Boissons', icon: Coffee, color: 'from-blue-500 to-cyan-500' },
    { id: 'desserts', name: 'Desserts', icon: Cake, color: 'from-purple-500 to-pink-500' }
  ];

  // Game Logic
  useEffect(() => {
    let interval: number;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      interval = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.isPlaying) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.timeLeft]);

  const startGame = () => {
    setGameState({
      isPlaying: true,
      score: 0,
      timeLeft: 30,
      currentBurger: Math.floor(Math.random() * 6),
      gameOver: false,
      highScore: gameState.highScore
    });
  };

  const catchBurger = () => {
    if (gameState.isPlaying) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 10,
        currentBurger: Math.floor(Math.random() * 6)
      }));
    }
  };

  const endGame = () => {
    const newHighScore = Math.max(gameState.score, gameState.highScore);
    localStorage.setItem('soyaHighScore', newHighScore.toString());
    
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      gameOver: true,
      highScore: newHighScore
    }));
  };

  const addToCart = (product: Product) => {
    const existingItem = formData.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setFormData(prev => ({
        ...prev,
        cart: prev.cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        cart: [...prev.cart, {
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
          category: product.category,
          sauce: (product.category === 'Burgers' || product.category === 'Sandwichs') ? 'Ketchup' : undefined
        }]
      }));
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setFormData(prev => ({
      ...prev,
      cart: prev.cart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    }));
  };

  const updateSauce = (id: string, sauce: string) => {
    setFormData(prev => ({
      ...prev,
      cart: prev.cart.map(item =>
        item.id === id ? { ...item, sauce } : item
      )
    }));
  };

  const removeFromCart = (id: string) => {
    setFormData(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.id !== id)
    }));
  };

  const getTotalPrice = () => {
    return formData.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return formData.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const generateOrderMessage = () => {
    const orderId = Math.random().toString(36).substr(2, 8).toUpperCase();
    let message = `🍔 NOUVELLE COMMANDE SOYA #${orderId}\n\n`;
    message += `👤 Prénom: ${formData.firstName}\n\n`;
    
    const categories = ['Burgers', 'Sandwichs', 'Boissons', 'Desserts'];
    
    categories.forEach(category => {
      const categoryItems = formData.cart.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        const emoji = category === 'Burgers' ? '🍔' : 
                     category === 'Sandwichs' ? '🥪' : 
                     category === 'Boissons' ? '🥤' : '🍰';
        message += `${emoji} ${category}:\n`;
        
        categoryItems.forEach(item => {
          message += `   • ${item.name} x${item.quantity}`;
          if (item.sauce) {
            message += ` (sauce ${item.sauce})`;
          }
          message += ` - ${(item.price * item.quantity).toFixed(2)}€\n`;
        });
        message += '\n';
      }
    });
    
    message += `💰 TOTAL: ${getTotalPrice().toFixed(2)}€\n\n`;
    message += `🥗 Garnitures incluses: Salade, tomate, oignon\n\n`;
    
    if (formData.remarks) {
      message += `📝 Remarques: ${formData.remarks}\n\n`;
    }
    
    message += `📞 Merci de confirmer votre commande !`;
    
    return encodeURIComponent(message);
  };

  const burgerEmojis = ['🍔', '🍕', '🌭', '🥪', '🧀', '🥓'];

  // Animation effect for products - remove automatic sound
  useEffect(() => {
    const timer = setTimeout(() => {
      // Animation des produits quand on change d'onglet (sans son automatique)
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Notification system
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Sound effects with better user gesture handling
  const playSound = (type: 'click' | 'success' | 'error') => {
    if (!isSoundEnabled) return;
    
    // Only try to play sound after user interaction
    const handleUserGesture = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            createSound(audioContext, type);
          }).catch(() => {
            // Silently fail
          });
        } else {
          createSound(audioContext, type);
        }
      } catch (error) {
        // Silently fail if Web Audio API is not supported
      }
    };

    // Check if we have user gesture
    if (document.visibilityState === 'visible') {
      handleUserGesture();
    }
  };

  const createSound = (audioContext: AudioContext, type: 'click' | 'success' | 'error') => {
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'click':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          break;
        case 'success':
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          break;
        case 'error':
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          break;
      }
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Silently fail
    }
  };

  // Enhanced add to cart with animations
  const addToCartEnhanced = (product: any) => {
    playSound('success');
    setCartAnimation('animate-pulse');
    addToCart(product);
    showNotification(`${product.name} ajouté au panier ! 🎉`, 'success');
    
    setTimeout(() => setCartAnimation(''), 1000);
  };

  // Favorites system
  const toggleFavorite = (productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    setFavorites(newFavorites);
    localStorage.setItem('soyaFavorites', JSON.stringify(newFavorites));
    playSound('click');
  };

  // Filter and search logic
  const getFilteredProducts = () => {
    const currentProducts = products[activeTab as keyof typeof products];
    
    return currentProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = selectedFilters.length === 0 || selectedFilters.some(filter => {
        switch (filter) {
          case 'Populaire': return (product as any).popular;
          case 'Premium': return (product as any).premium;
          case 'Végétarien': return product.name.toLowerCase().includes('végétarien');
          case 'Épicé': return product.description.includes('🌶️') || product.description.includes('épic');
          case 'Nouveau': return (product as any).new;
          default: return true;
        }
      });
      
      return matchesSearch && matchesFilters;
    });
  };

  // Quick order suggestions based on time
  const getTimeBasedSuggestions = () => {
    const hour = new Date().getHours();
    
    if (hour >= 11 && hour < 14) {
      return { title: '🌅 Suggestions Déjeuner', items: ['burger-1', 'sandwich-1', 'boisson-1'] };
    } else if (hour >= 14 && hour < 18) {
      return { title: '☀️ Suggestions Après-midi', items: ['dessert-1', 'boisson-5', 'sandwich-6'] };
    } else {
      return { title: '🌙 Suggestions Soirée', items: ['burger-4', 'dessert-2', 'boisson-3'] };
    }
  };

  // Enhanced order submission with loading
  const handleSubmitEnhanced = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      showNotification('Veuillez saisir votre prénom', 'error');
      playSound('error');
      return;
    }
    if (formData.cart.length === 0) {
      showNotification('Veuillez ajouter au moins un produit à votre commande', 'error');
      playSound('error');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const message = generateOrderMessage();
    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '33761982580'}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    setIsLoading(false);
    setIsOrderFormOpen(false);
    showNotification('Commande envoyée avec succès ! 🚀', 'success');
    playSound('success');
    
    // Clear cart after successful order
    setFormData(prev => ({ ...prev, cart: [] }));
  };

  // Système de récompenses plus cool et naturel
  const getRewardLevel = (score: number) => {
    if (score >= 2025) return 'legendary';
    if (score >= 1500) return 'master';
    if (score >= 1000) return 'expert';
    if (score >= 500) return 'pro';
    return 'novice';
  };

  const getRewardDetails = (score: number) => {
    const level = getRewardLevel(score);
    
    switch (level) {
      case 'legendary':
        return {
          discount: 1.50,
          discountType: 'euro',
          title: '🏆 LÉGENDE DU BURGER !',
          description: '1,50€ de réduction sur ta prochaine commande !',
          requirements: ['Montre ce score quand tu viens commander'],
          color: 'from-yellow-400 to-orange-500',
          minOrder: 10,
          bonus: 'Une boisson offerte en plus ! 🎁'
        };
      case 'master':
        return {
          discount: 1,
          discountType: 'euro',
          title: '👑 MAÎTRE BURGER',
          description: '1€ de réduction sur ta prochaine commande !',
          requirements: ['Montre ce score quand tu viens commander'],
          color: 'from-purple-500 to-pink-500',
          minOrder: 8
        };
      case 'expert':
        return {
          discount: 0.50,
          discountType: 'euro',
          title: '🎯 EXPERT BURGER',
          description: '50 centimes de réduction sur ta prochaine commande !',
          requirements: ['Montre ce score quand tu viens commander'],
          color: 'from-blue-500 to-cyan-500',
          minOrder: 6
        };
      case 'pro':
        return {
          discount: 0.30,
          discountType: 'euro',
          title: '⭐ PRO BURGER',
          description: '30 centimes de réduction sur ta prochaine commande !',
          requirements: ['Montre ce score quand tu viens commander'],
          color: 'from-green-500 to-emerald-500',
          minOrder: 5
        };
      default:
        return null;
    }
  };

  const shareGameWithScore = () => {
    const reward = getRewardDetails(gameState.score);
    const shareText = `🔥 DÉFI SOYA 2025 ! 🔥
🍔 J'ai fait ${gameState.score} points au jeu Soya !
🎯 Objectif ultime : 2025 points
${reward ? `🎉 J'ai gagné ${reward.discount}€ de réduction !` : '🎮 Pas mal mais je peux faire mieux !'}

Viens tester tes réflexes et découvrir les meilleurs burgers de la ville !
#SoyaBurger #QueDesSmash #Défi2025`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Défi Soya 2025 - Que des Smash !',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      showNotification('Lien copié ! Partage ton score avec tes amis 🎉', 'success');
    }
  };

  const sendRewardToWhatsApp = () => {
    const reward = getRewardDetails(gameState.score);
    if (!reward) return;

    const message = `🎮 SCORE JEU SOYA 2025 🎮

🏅 Score obtenu : ${gameState.score} points
🎁 Récompense : ${reward.title}
💰 Réduction : ${reward.discount}€
📦 Commande minimum : ${reward.minOrder}€
${reward.bonus ? `🎁 Bonus : ${reward.bonus}` : ''}

Salut ! J'ai joué au jeu Soya et j'ai fait un super score ! 
Je viendrai bientôt commander pour profiter de ma petite réduction 😊

À bientôt ! 🍔`;

    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '33761982580'}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const openGoogleReviews = () => {
    // URL Google My Business - tu peux la remplacer par la vraie
    const googleReviewUrl = "https://g.page/r/[VOTRE_ID_GOOGLE_MY_BUSINESS]/review";
    window.open(googleReviewUrl, '_blank');
    showNotification('Merci pour ton avis ! Ça nous aide énormément 🙏', 'success');
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  // PWA Installation with better error handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Only show install prompt if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      showNotification('App installée avec succès ! 🎉', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    // Handle shortcuts from manifest
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'order') {
      setIsOrderFormOpen(true);
    } else if (action === 'game') {
      setIsGameOpen(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      showNotification('Installation non disponible', 'error');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        showNotification('Installation en cours... 🚀', 'success');
      } else {
        showNotification('Installation annulée', 'info');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      showNotification('Erreur lors de l\'installation', 'error');
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[60] p-4 rounded-2xl shadow-2xl border-l-4 animate-in slide-in-from-right duration-300 max-w-sm ${
          notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
          'bg-blue-50 border-blue-500 text-blue-800'
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
            {notification.type === 'error' && <AlertCircle className="w-6 h-6 text-red-600" />}
            {notification.type === 'info' && <AlertCircle className="w-6 h-6 text-blue-600" />}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Sound Toggle */}
      <button
        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
        className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
      >
        {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">SOYA</h1>
                <p className="text-sm text-gray-600 font-medium">🔥 Que des Smash !</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsGameOpen(true)}
                className="group bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:from-amber-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Gift className="w-5 h-5 group-hover:animate-bounce" />
                <span>🎮 Jeu</span>
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOrderFormOpen(true)}
                className={`group bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 relative overflow-hidden ${cartAnimation}`}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                <ShoppingCart className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Commander</span>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-rose-800 text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-pulse shadow-lg">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden bg-gradient-to-r from-rose-500 to-pink-600 text-white p-3 rounded-xl"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-rose-100 animate-in slide-in-from-top duration-300">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsGameOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2"
                >
                  <Gift className="w-5 h-5" />
                  <span>🎮 Jeu</span>
                </button>
                <button
                  onClick={() => {
                    setIsOrderFormOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Commander</span>
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-rose-800 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-rose-500 via-fuchsia-500 to-pink-500 overflow-hidden">
        {/* Background animations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 text-6xl animate-bounce opacity-20">🍔</div>
          <div className="absolute top-40 right-20 text-4xl animate-pulse opacity-30">🍟</div>
          <div className="absolute bottom-20 left-1/4 text-5xl animate-bounce opacity-20 animation-delay-1000">🥤</div>
          <div className="absolute top-1/2 right-10 text-3xl animate-spin opacity-25">💖</div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-white/20 rounded-full animate-float`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            {/* Logo animé */}
            <div className="relative inline-block mb-8">
              <div className="w-40 h-40 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 shadow-2xl animate-pulse">
                <ChefHat className="w-20 h-20 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-fuchsia-400 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                NEW!
              </div>
            </div>
            
            {/* Slogan principal */}
            <div className="relative">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                <span className="inline-block animate-in slide-in-from-left duration-1000">QUE</span>
                <span className="inline-block animate-in slide-in-from-right duration-1000 animation-delay-500 mx-4 bg-white text-fuchsia-600 px-4 py-2 rounded-2xl transform rotate-2">DES</span>
                <span className="inline-block animate-in slide-in-from-left duration-1000 animation-delay-1000">SMASH!</span>
              </h1>
              <div className="absolute -inset-4 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 -z-10"></div>
            </div>
          </div>

          <div className="space-y-8 animate-in fade-in duration-1000 animation-delay-1500">
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-bold leading-relaxed">
              🔥 Les burgers les plus <span className="bg-white text-fuchsia-600 px-3 py-1 rounded-lg">JUTEUX</span> de la ville ! 🔥<br/>
              Ingrédients frais • Saveurs explosives • Satisfaction <span className="text-pink-300">GARANTIE</span> !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => setIsOrderFormOpen(true)}
                className="group bg-white text-fuchsia-600 px-10 py-5 rounded-2xl text-xl font-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3 min-w-max"
              >
                <Flame className="w-6 h-6 group-hover:animate-bounce text-pink-500" />
                <span>🍔 Je commande maintenant !</span>
                <Sparkles className="w-6 h-6 text-fuchsia-500" />
              </button>
              <button
                onClick={() => setIsGameOpen(true)}
                className="group bg-fuchsia-400 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-fuchsia-300 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2"
              >
                <Gift className="w-6 h-6 group-hover:animate-spin" />
                <span>🎮 Jouer & Gagner</span>
                <Trophy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Time-based suggestions */}
      <section className="py-8 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-4">{getTimeBasedSuggestions().title}</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4 overflow-x-auto pb-2">
              {getTimeBasedSuggestions().items.map(productId => {
                const allProducts = [...products.burgers, ...products.sandwichs, ...products.boissons, ...products.desserts];
                const product = allProducts.find(p => p.id === productId);
                return product ? (
                  <button
                    key={product.id}
                    onClick={() => addToCartEnhanced(product)}
                    className="flex-shrink-0 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:min-w-[200px] sm:w-auto"
                  >
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">{product.name}</h4>
                    <p className="text-rose-600 font-bold text-lg">{product.price.toFixed(2)}€</p>
                  </button>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner avec animations */}
      <section className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center space-y-3 md:space-y-0 md:space-x-12 text-center">
            <div className="group flex items-center space-x-3 text-white font-bold text-lg hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <Zap className="w-6 h-6 group-hover:animate-bounce" />
                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
              </div>
              <span>🎯 Commande rapide via WhatsApp</span>
            </div>
            <div className="group flex items-center space-x-3 text-white font-bold text-lg hover:scale-105 transition-transform duration-300">
              <Heart className="w-6 h-6 text-pink-200 group-hover:animate-pulse" />
              <span>💯 Satisfaction garantie</span>
            </div>
            <div className="group flex items-center space-x-3 text-white font-bold text-lg hover:scale-105 transition-transform duration-300">
              <Users className="w-6 h-6 group-hover:animate-bounce" />
              <span>⭐ +500 clients conquis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Info Bar améliorée */}
      <section className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="group flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-gray-800 transition-colors duration-300">
              <Clock className="w-8 h-8 text-amber-400 group-hover:animate-spin" />
              <span className="font-bold text-lg">Ouvert tous les soirs</span>
              <span className="text-amber-400 font-bold">20h - 2h</span>
            </div>
            <div className="group flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-gray-800 transition-colors duration-300">
              <MapPin className="w-8 h-8 text-rose-400 group-hover:animate-bounce" />
              <span className="font-bold text-lg">À emporter uniquement</span>
              <span className="text-rose-400">Prêt en 10 minutes</span>
            </div>
            <div className="group flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-gray-800 transition-colors duration-300">
              <Star className="w-8 h-8 text-amber-400 group-hover:animate-pulse" />
              <span className="font-bold text-lg">Produits frais</span>
              <span className="text-amber-400">Faits maison quotidiennement</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section améliorée */}
      <section className="py-20" id="menu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                Notre Menu
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8 font-medium">
              🌟 Des saveurs authentiques préparées avec amour et des ingrédients <span className="text-rose-600 font-bold">ultra frais</span> 🌟
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg border-2 border-gray-100 focus:border-rose-300 focus:ring-4 focus:ring-rose-100 text-lg transition-all duration-300"
              />
            </div>

            {/* Filters and View Toggle */}
            <div className="flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-rose-300 transition-all duration-300"
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filtres</span>
                {selectedFilters.length > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                    {selectedFilters.length}
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 font-medium transition-colors duration-300 ${
                    viewMode === 'grid' ? 'bg-rose-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 font-medium transition-colors duration-300 ${
                    viewMode === 'list' ? 'bg-rose-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Liste
                </button>
              </div>
            </div>

            {/* Filter Options */}
            {isFilterOpen && (
              <div className="flex flex-wrap justify-center gap-3 animate-in slide-in-from-top duration-300">
                {filters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilters(prev =>
                        prev.includes(filter)
                          ? prev.filter(f => f !== filter)
                          : [...prev, filter]
                      );
                      playSound('click');
                    }}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedFilters.includes(filter)
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
                {selectedFilters.length > 0 && (
                  <button
                    onClick={() => setSelectedFilters([])}
                    className="px-4 py-2 rounded-full font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300"
                  >
                    Effacer tout
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Tabs améliorées */}
          <div className="flex flex-wrap justify-center mb-12 gap-3">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    playSound('click');
                  }}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all duration-500 flex items-center space-x-3 transform hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105 animate-in zoom-in duration-300`
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-lg hover:shadow-xl border-2 border-gray-100'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />
                  <span className="text-lg">{tab.name}</span>
                  {isActive && <Sparkles className="w-5 h-5 animate-pulse" />}
                </button>
              );
            })}
          </div>
          
          {/* Products Grid/List */}
          <div className={
            viewMode === 'grid' 
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6"
          }>
            {getFilteredProducts().map((product, index) => (
              <div
                key={product.id}
                className={`group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative border-2 border-gray-100 hover:border-rose-200 animate-in slide-in-from-bottom duration-500 ${
                  viewMode === 'list' ? 'flex items-center p-6' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image du produit */}
                {product.image && viewMode === 'grid' && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                )}

                {/* Badges améliorés */}
                <div className={`absolute z-10 flex gap-2 ${viewMode === 'list' ? 'top-4 right-4 flex-col' : 'top-4 left-4 flex-col'}`}>
                  {(product as any).popular && (
                    <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>POPULAIRE</span>
                    </span>
                  )}
                  {(product as any).bestseller && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>BEST-SELLER</span>
                    </span>
                  )}
                  {(product as any).premium && (
                    <span className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>PREMIUM</span>
                    </span>
                  )}
                </div>

                <div className={viewMode === 'list' ? 'flex-1 flex items-center justify-between' : 'p-8'}>
                  <div className={viewMode === 'list' ? 'flex-1' : 'mb-6'}>
                    <span className={`inline-block px-4 py-2 rounded-2xl text-sm font-bold mb-4 ${
                      activeTab === 'burgers' ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700' :
                      activeTab === 'sandwichs' ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700' :
                      activeTab === 'boissons' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700' :
                      'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700'
                    }`}>
                      {product.category}
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className={`text-gray-600 leading-relaxed text-base ${viewMode === 'list' ? 'max-w-md' : ''}`}>
                      {product.description}
                    </p>
                  </div>
                  
                  <div className={`flex items-center ${viewMode === 'list' ? 'space-x-6' : 'justify-between'}`}>
                    <div className="text-3xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                      {product.price.toFixed(2)}€
                    </div>
                    <div className="flex flex-col gap-2">
                      {product.image && (
                        <button
                          onClick={() => openProductModal(product)}
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                        >
                          <Search className="w-4 h-4" />
                          <span>Voir détails</span>
                        </button>
                      )}
                      <button
                        onClick={() => addToCartEnhanced(product)}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modal */}
      {isGameOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-500">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center space-x-3">
                    <Trophy className="w-8 h-8 text-amber-500" />
                    <span>🎮 Jeu Soya 2025</span>
                  </h3>
                  <p className="text-gray-600 mt-2">Attrape les burgers et gagne des récompenses !</p>
                </div>
                <button
                  onClick={() => setIsGameOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold hover:scale-110 transition-all duration-300 bg-gray-100 hover:bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {!gameState.isPlaying && !gameState.gameOver && (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                  <div className="bg-gradient-to-r from-red-100 to-orange-100 p-6 rounded-2xl border-2 border-red-200 mb-6">
                    <h4 className="text-2xl font-black text-red-800 mb-2">🎯 OBJECTIF 2025</h4>
                    <p className="text-red-700 font-bold">Atteins 2025 points pour débloquer des récompenses LÉGENDAIRES !</p>
                  </div>

                  <p className="text-gray-700 text-lg font-medium leading-relaxed">
                    🍔 Clique sur les burgers qui apparaissent !<br/>
                    ⏱️ Tu as <span className="font-bold text-rose-600">30 secondes</span> pour faire le meilleur score !<br/>
                    🏆 Plus ton score est élevé, plus ta récompense est grande !
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-2xl border-2 border-amber-200">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Trophy className="w-5 h-5 text-amber-600" />
                        <p className="text-sm font-bold text-amber-800">Record à battre</p>
                      </div>
                      <p className="text-3xl font-black text-amber-700">2025</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-2xl border-2 border-purple-200">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Crown className="w-5 h-5 text-purple-600" />
                        <p className="text-sm font-bold text-purple-800">Ton record</p>
                      </div>
                      <p className="text-3xl font-black text-purple-700">{gameState.highScore}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-200">
                    <h5 className="font-bold text-blue-800 mb-2">🎁 Récompenses à gagner :</h5>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• 500+ pts : 0,30€ de réduction</p>
                      <p>• 1000+ pts : 0,50€ de réduction</p>
                      <p>• 1500+ pts : 1€ de réduction</p>
                      <p>• 2025+ pts : 1,50€ + boisson offerte ! 🥤</p>
                      <p className="text-blue-600 font-bold text-xs">✨ Simple : montre ton score quand tu commandes !</p>
                    </div>
                  </div>

                  <button
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                  >
                    <Flame className="w-6 h-6 animate-bounce" />
                    <span>🚀 RELEVER LE DÉFI 2025 !</span>
                    <Sparkles className="w-6 h-6" />
                  </button>
                </div>
              )}

              {gameState.isPlaying && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-3 rounded-2xl">
                      <div className="text-2xl font-black text-rose-600">{gameState.score}</div>
                      <div className="text-xs text-rose-700 font-medium">Points</div>
                    </div>
                    <div className="bg-gradient-to-r from-red-100 to-orange-100 p-3 rounded-2xl">
                      <div className="text-2xl font-black text-red-600">{gameState.timeLeft}</div>
                      <div className="text-xs text-red-700 font-medium">Secondes</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-3 rounded-2xl">
                      <div className="text-2xl font-black text-purple-600">{Math.max(0, 2025 - gameState.score)}</div>
                      <div className="text-xs text-purple-700 font-medium">Reste</div>
                    </div>
                  </div>

                  {gameState.score >= 2025 && (
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-2xl border-2 border-yellow-300 animate-pulse">
                      <p className="text-yellow-800 font-black text-lg">🏆 OBJECTIF 2025 ATTEINT ! 🏆</p>
                      <p className="text-yellow-700">Continue pour maximiser ta récompense !</p>
                    </div>
                  )}
                  
                  <div className="h-48 bg-gradient-to-b from-blue-200 via-green-200 to-yellow-200 rounded-2xl flex items-center justify-center relative overflow-hidden border-4 border-white shadow-inner">
                    <div className="absolute top-4 left-4 text-2xl opacity-60">☁️</div>
                    <div className="absolute top-6 right-8 text-xl opacity-40">☁️</div>
                    
                    <button
                      onClick={catchBurger}
                      className="text-8xl hover:scale-125 transition-transform duration-200 animate-bounce cursor-pointer hover:animate-none transform hover:rotate-12"
                    >
                      {burgerEmojis[gameState.currentBurger]}
                    </button>
                  </div>
                  
                  <p className="text-lg text-gray-700 font-bold animate-pulse">
                    👆 Clique sur le burger !
                  </p>
                </div>
              )}

              {gameState.gameOver && (
                <div className="space-y-6 animate-in zoom-in duration-500">
                  <div className="text-8xl mb-4 animate-bounce">
                    {gameState.score >= 2025 ? '🏆' : gameState.score >= 1500 ? '👑' : gameState.score >= 1000 ? '🎯' : gameState.score >= 500 ? '⭐' : '🍔'}
                  </div>
                  
                  <h4 className="text-2xl font-black text-gray-900">
                    {gameState.score >= 2025 ? '🎊 DÉFI 2025 RELEVÉ !' : 
                     gameState.score >= gameState.highScore ? '🎉 Nouveau record !' : '🎮 Partie terminée !'}
                  </h4>
                  
                  <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-6 rounded-2xl border-2 border-rose-200">
                    <p className="text-rose-800 text-lg">
                      <span className="font-black text-3xl">Ton score: {gameState.score}</span><br/>
                      <span className="font-medium">Objectif 2025: {gameState.score >= 2025 ? '✅ ATTEINT !' : `❌ ${2025 - gameState.score} points manquants`}</span><br/>
                      <span className="font-medium">Ton record: {gameState.highScore}</span>
                    </p>
                  </div>
                  
                  {getRewardDetails(gameState.score) && (
                    <div className={`bg-gradient-to-r ${getRewardDetails(gameState.score)?.color} p-6 rounded-2xl text-white`}>
                      <h5 className="font-black text-2xl mb-2">{getRewardDetails(gameState.score)?.title}</h5>
                      <p className="font-bold text-lg mb-4">{getRewardDetails(gameState.score)?.description}</p>
                      
                      {getRewardDetails(gameState.score)?.bonus && (
                        <div className="bg-white/20 p-3 rounded-xl mb-4">
                          <p className="font-bold">🎁 Bonus spécial :</p>
                          <p className="text-sm">{getRewardDetails(gameState.score)?.bonus}</p>
                        </div>
                      )}

                      <div className="bg-white/20 p-4 rounded-xl mb-4">
                        <p className="font-bold mb-2">🎯 Comment récupérer ta récompense :</p>
                        <ul className="text-sm space-y-1">
                          <li>✓ Partage le jeu avec tes amis</li>
                          <li>✓ Prends une capture de ce score</li>
                          <li>✓ Viens commander chez nous</li>
                          <li>✓ Montre ta capture ou envoie via WhatsApp</li>
                          <li>✓ Profite de ta réduction ! 😊</li>
                        </ul>
                        <p className="text-xs mt-2 opacity-90">Commande minimum : {getRewardDetails(gameState.score)?.minOrder}€</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                          onClick={shareGameWithScore}
                          className="bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <Share2 className="w-5 h-5" />
                          <span>📱 Partager</span>
                        </button>

                        <button
                          onClick={sendRewardToWhatsApp}
                          className="bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>💬 Nous prévenir</span>
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          onClick={openGoogleReviews}
                          className="text-white/80 hover:text-white text-sm underline transition-colors duration-300"
                        >
                          Si tu veux nous laisser un avis Google, c'est par ici ! ⭐
                        </button>
                      </div>
                    </div>
                  )}

                  {!getRewardDetails(gameState.score) && (
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-2xl border-2 border-gray-300">
                      <p className="text-gray-700 font-bold text-lg mb-2">🎯 Encore un petit effort !</p>
                      <p className="text-gray-600">Atteins 500 points pour débloquer ta première récompense !</p>
                      <div className="mt-4 bg-gradient-to-r from-rose-200 to-orange-200 p-3 rounded-xl">
                        <p className="text-rose-800 font-bold">Prochain objectif : 500 points = 0,30€ de réduction !</p>
                        <p className="text-rose-600 text-sm">Ça vaut le coup de réessayer ! 😉</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={startGame}
                      className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <div className="animate-spin">🔄</div>
                      <span>Rejouer</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsOrderFormOpen(true);
                        setIsGameOpen(false);
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Commander</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsGameOpen(false)}
                className="mt-6 text-gray-500 hover:text-gray-700 font-medium transition-colors duration-300"
              >
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal améliorée */}
      {isOrderFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-500">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    🛒 Ma Commande
                  </h3>
                  <p className="text-gray-600 mt-2">Prépare-toi à te régaler !</p>
                </div>
                <button
                  onClick={() => setIsOrderFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold hover:scale-110 transition-all duration-300 bg-gray-100 hover:bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitEnhanced} className="space-y-8">
                <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-6 rounded-2xl border-2 border-rose-100">
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    👤 Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-rose-200 focus:border-rose-500 text-lg font-medium transition-all duration-300"
                    placeholder="Ton prénom ici..."
                    required
                  />
                </div>

                {formData.cart.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
                    <h4 className="font-black text-xl text-gray-900 mb-6 flex items-center space-x-2">
                      <ShoppingCart className="w-6 h-6 text-rose-600" />
                      <span>Articles dans ton panier</span>
                    </h4>
                    <div className="space-y-4">
                      {formData.cart.map((item, index) => (
                        <div 
                          key={item.id} 
                          className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-rose-200 transition-all duration-300 animate-in slide-in-from-bottom"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h5 className="font-bold text-lg text-gray-900">{item.name}</h5>
                              <p className="text-rose-600 font-bold">{item.price.toFixed(2)}€ l'unité</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 font-bold hover:scale-110 transition-all duration-300 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-all duration-300 transform hover:scale-110 font-bold"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <span className="text-2xl font-black text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-110"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                            
                            <div className="text-2xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                              {(item.price * item.quantity).toFixed(2)}€
                            </div>
                          </div>
                          
                          {(item.category === 'Burgers' || item.category === 'Sandwichs') && (
                            <div className="mt-4 bg-amber-50 p-4 rounded-xl border border-amber-200">
                              <label className="block text-amber-800 font-bold mb-2">
                                🥫 Choisis ta sauce:
                              </label>
                              <select
                                value={item.sauce || 'Ketchup'}
                                onChange={(e) => updateSauce(item.id, e.target.value)}
                                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 font-medium"
                              >
                                {sauces.map(sauce => (
                                  <option key={sauce} value={sauce}>{sauce}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                      <div className="flex justify-between items-center text-3xl font-black">
                        <span className="text-gray-900">Total:</span>
                        <span className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                          {getTotalPrice().toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {formData.cart.length === 0 && (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="text-8xl mb-4 opacity-50">🛒</div>
                    <p className="text-xl font-bold text-gray-500 mb-2">Ton panier est vide</p>
                    <p className="text-gray-400">Ajoute des produits délicieux depuis le menu !</p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-100">
                  <label className="block text-lg font-bold text-blue-800 mb-3">
                    📝 Remarques spéciales (optionnel)
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                    className="w-full px-6 py-4 border-2 border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 font-medium"
                    rows={4}
                    placeholder="Ex: sans cornichons, pain bien grillé, allergie aux noix..."
                  />
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-800 text-lg">Inclus dans tous nos burgers et sandwichs:</p>
                      <p className="text-green-700">🥬 Salade fraîche • 🍅 Tomate • 🧅 Oignon</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 bg-green-100 p-3 rounded-xl border border-green-200">
                    📱 Ta commande sera envoyée directement via WhatsApp avec un numéro unique pour un suivi optimal !
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={formData.cart.length === 0 || isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-6 rounded-2xl text-xl font-black hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:scale-105 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-6 h-6" />
                      <span>🚀 Envoyer ma commande via WhatsApp</span>
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {isProductModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-500">
            <div className="relative">
              {/* Product Image */}
              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Close Button */}
                <button
                  onClick={closeProductModal}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center font-bold hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  ×
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {selectedProduct.popular && (
                    <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>POPULAIRE</span>
                    </span>
                  )}
                  {selectedProduct.bestseller && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>BEST-SELLER</span>
                    </span>
                  )}
                  {selectedProduct.premium && (
                    <span className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>PREMIUM</span>
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl">
                  <span className="text-2xl font-black text-rose-600">{selectedProduct.price.toFixed(2)}€</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-black text-gray-900">{selectedProduct.name}</h2>
                    <button
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        favorites.includes(selectedProduct.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${favorites.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <span className="inline-block px-4 py-2 rounded-2xl text-sm font-bold mb-4 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700">
                    {selectedProduct.category}
                  </span>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {selectedProduct.detailedDescription}
                  </p>
                </div>

                {/* Tabs pour les détails */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Ingrédients */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                    <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center space-x-2">
                      <ChefHat className="w-5 h-5" />
                      <span>Ingrédients</span>
                    </h3>
                    <ul className="space-y-2">
                      {selectedProduct.ingredients?.map((ingredient: string, index: number) => (
                        <li key={index} className="text-green-700 flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-sm">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Informations nutritionnelles */}
                  {selectedProduct.nutritions && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
                      <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center space-x-2">
                        <Star className="w-5 h-5" />
                        <span>Nutrition</span>
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-700 text-sm">Calories</span>
                          <span className="font-bold text-blue-800">{selectedProduct.nutritions.calories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700 text-sm">Protéines</span>
                          <span className="font-bold text-blue-800">{selectedProduct.nutritions.proteines}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700 text-sm">Lipides</span>
                          <span className="font-bold text-blue-800">{selectedProduct.nutritions.lipides}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700 text-sm">Glucides</span>
                          <span className="font-bold text-blue-800">{selectedProduct.nutritions.glucides}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Allergènes */}
                  {selectedProduct.allergens && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200">
                      <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>Allergènes</span>
                      </h3>
                      <div className="space-y-2">
                        {selectedProduct.allergens.map((allergen: string, index: number) => (
                          <div key={index} className="bg-amber-100 px-3 py-2 rounded-lg border border-amber-300">
                            <span className="text-amber-800 text-sm font-medium">{allergen}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      addToCartEnhanced(selectedProduct);
                      closeProductModal();
                    }}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Ajouter au panier</span>
                    <span className="text-xl font-black">{selectedProduct.price.toFixed(2)}€</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const shareText = `🍔 Découvrez le ${selectedProduct.name} chez Soya ! ${selectedProduct.description} Pour seulement ${selectedProduct.price.toFixed(2)}€ 😋 #SoyaBurger #QueDesSmash`;
                      if (navigator.share) {
                        navigator.share({
                          title: `${selectedProduct.name} - Soya`,
                          text: shareText,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
                        showNotification('Produit partagé ! 📱', 'success');
                      }
                    }}
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-4 rounded-2xl font-bold hover:from-amber-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Partager</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Prompt Enhanced */}
      {showInstallPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in duration-500">
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-rose-500 via-fuchsia-500 to-pink-500 px-6 py-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2">Installe SOYA</h3>
                <p className="text-white/90 font-medium">Accès rapide depuis ton écran d'accueil !</p>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 text-2xl animate-bounce animation-delay-200">🍔</div>
              <div className="absolute bottom-4 left-4 text-xl animate-pulse">✨</div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Avantages */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800">Commandes ultra-rapides</p>
                    <p className="text-green-600 text-sm">Un tap et c'est parti !</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-800">Favoris sauvegardés</p>
                    <p className="text-blue-600 text-sm">Tes burgers préférés à portée de main</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border-l-4 border-purple-500">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-purple-800">Jeu & récompenses</p>
                    <p className="text-purple-600 text-sm">Gagne des réductions en jouant !</p>
                  </div>
                </div>
              </div>

              {/* Demo visual */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border-2 border-dashed border-gray-300">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-800">SOYA</p>
                    <p className="text-xs text-gray-600">Sur ton écran d'accueil</p>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500">
                  🚀 Plus rapide qu'ouvrir un navigateur !
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleInstallApp}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-2xl font-black text-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>🚀 Installer l'app</span>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </button>

                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="w-full text-gray-600 hover:text-gray-800 py-3 font-medium transition-colors duration-300"
                >
                  Peut-être plus tard
                </button>
              </div>

              {/* Info supplémentaire */}
              <div className="text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                  💾 L'app pèse moins de 1MB<br/>
                  📱 Compatible avec tous les téléphones<br/>
                  🔒 Aucune donnée personnelle collectée
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Button (discret en bas à droite) */}
      {!showInstallPrompt && deferredPrompt && (
        <button
          onClick={() => setShowInstallPrompt(true)}
          className="fixed bottom-20 right-4 z-50 bg-gradient-to-r from-rose-500 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:from-rose-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-110 animate-pulse hover:animate-none group"
        >
          <div className="relative">
            <Plus className="w-6 h-6" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Installer l'app SOYA
            <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 rotate-45 transform -mt-1"></div>
          </div>
        </button>
      )}

      {/* Installation Success Toast */}
      {window.matchMedia('(display-mode: standalone)').matches && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-500">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-bold">App installée avec succès ! 🎉</p>
              <p className="text-sm opacity-90">Bienvenue dans l'expérience SOYA native !</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;