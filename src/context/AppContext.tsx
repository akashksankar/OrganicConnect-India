import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DatabaseState,
  User,
  UserRole,
  Product,
  Order,
  OrderStatus,
  Review,
  Complaint,
  CommunityPost,
  Notification,
  UserSubscription,
} from '../types';
import {
  loadDatabase,
  saveDatabase,
  resetDatabase,
  seedDatabase,
  loadActiveRole,
  saveActiveRole,
  loadThemeMode,
  saveThemeMode,
  updateOrderStatusInDb,
} from '../db/storage';
import confetti from 'canvas-confetti';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  db: DatabaseState;
  activeRole: UserRole;
  currentUser: User;
  themeMode: 'light' | 'dark';
  cart: CartItem[];
  wishlist: string[];
  unreadNotificationCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Role & Theme
  setActiveRole: (role: UserRole) => void;
  toggleThemeMode: () => void;
  
  // Cart & Wishlist
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  
  // Orders & Role Operations
  placeOrder: (paymentDetails: {
    method: 'COD' | 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';
    address: { street: string; city: string; region: string; pincode: string; deliveryNotes?: string };
    customerName: string;
    customerPhone: string;
    couponCode?: string;
    discountAmount?: number;
  }) => Order;
  
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    note: string,
    extra?: { assignedPartnerId?: string; assignedPartnerName?: string; assignedPartnerPhone?: string }
  ) => void;
  
  // Product Management
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  // Reviews & Complaints & Community & Subscription
  addReview: (review: Omit<Review, 'id' | 'timestamp'>) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'timestamp' | 'status'>) => void;
  resolveComplaint: (complaintId: string) => void;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'timestamp'>) => void;
  likeCommunityPost: (postId: string) => void;
  addCommentToPost: (postId: string, text: string) => void;
  subscribePlan: (params: { planId: string; planName: string; customizationNotes?: string }) => void;
  
  // Demo Controls
  resetDemoData: () => void;
  seedDemoData: () => void;
  generateDemoOrder: () => void;
  generateRandomNotification: () => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Search state helper
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<DatabaseState>(loadDatabase);
  const [activeRole, setActiveRoleState] = useState<UserRole>(loadActiveRole);
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(loadThemeMode);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('marketplace');

  const currentUser = db.users.find((u) => u.role === activeRole) || db.users[0];

  const unreadNotificationCount = db.notifications.filter(
    (n) => !n.read && (n.targetRole === 'ALL' || n.targetRole === activeRole)
  ).length;

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    saveActiveRole(role);
    switch (role) {
      case 'Delivery Partner':
        setActiveTab('delivery');
        break;
      case 'Outlet Manager':
        setActiveTab('outlet');
        break;
      case 'Farmer':
        setActiveTab('farmer');
        break;
      case 'Home Garden Seller':
        setActiveTab('home-garden');
        break;
      case 'Admin':
        setActiveTab('admin');
        break;
      case 'Customer':
        setActiveTab('marketplace');
        break;
    }
  };

  const toggleThemeMode = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeModeState(nextMode);
    saveThemeMode(nextMode);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const placeOrder = (paymentDetails: {
    method: 'COD' | 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';
    address: { street: string; city: string; region: string; pincode: string; deliveryNotes?: string };
    customerName: string;
    customerPhone: string;
    couponCode?: string;
    discountAmount?: number;
  }): Order => {
    if (cart.length === 0) throw new Error('Cart is empty');

    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const deliveryFee = subtotal > 500 ? 0 : 30;
    const discount = paymentDetails.discountAmount || 0;
    const totalAmount = Math.max(0, subtotal + deliveryFee - discount);
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNumber = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser.id,
      customerName: paymentDetails.customerName || currentUser.name,
      customerPhone: paymentDetails.customerPhone || currentUser.phone,
      address: paymentDetails.address,
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        price: c.product.price,
        unit: c.product.unit,
        quantity: c.quantity,
        seller: c.product.seller,
        sellerId: c.product.sellerId,
        image: c.product.image,
      })),
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      paymentMethod: paymentDetails.method,
      paymentStatus: paymentDetails.method === 'COD' ? 'Pending COD' : 'Paid',
      status: 'Pending',
      outletId: 'USR-OUTLET-1',
      outletName: 'Kozhikode Central Community Outlet',
      invoiceNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Order created via ${paymentDetails.method}`,
          updatedBy: currentUser.name,
        },
      ],
    };

    // Add delivery task
    const newDelivery = {
      id: `DEL-${Date.now()}`,
      orderId: newOrder.id,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      address: `${newOrder.address.street}, ${newOrder.address.city} - ${newOrder.address.pincode}`,
      region: newOrder.address.region,
      itemsCount: newOrder.items.reduce((acc, i) => acc + i.quantity, 0),
      totalAmount: newOrder.totalAmount,
      paymentMethod: `${newOrder.paymentMethod} (${newOrder.paymentStatus})`,
      codAmountToCollect: newOrder.paymentMethod === 'COD' ? newOrder.totalAmount : 0,
      status: 'Pending' as OrderStatus,
      outletName: newOrder.outletName,
      assignedPartnerId: 'USR-DELIV-1',
      assignedPartnerName: 'Rajesh V. (Eco Delivery Express)',
      estimatedDeliveryTime: '30 Mins',
    };

    // Add payment record
    const newPayment = {
      id: `PAY-${Date.now()}`,
      orderId: newOrder.id,
      customerName: newOrder.customerName,
      amount: newOrder.totalAmount,
      method: paymentDetails.method,
      status: 'SUCCESS' as const,
      transactionRef: `${paymentDetails.method}/${Date.now().toString().slice(-8)}`,
      timestamp: new Date().toISOString(),
    };

    const newNotification: Notification = {
      id: `NOTIF-${Date.now()}`,
      targetRole: 'ALL',
      title: '🛒 New Order Placed',
      message: `Order #${orderId} (₹${totalAmount}) placed by ${newOrder.customerName}`,
      orderId,
      timestamp: 'Just now',
      read: false,
      type: 'ORDER',
    };

    const updatedDb: DatabaseState = {
      ...db,
      orders: [newOrder, ...db.orders],
      deliveries: [newDelivery, ...db.deliveries],
      payments: [newPayment, ...db.payments],
      notifications: [newNotification, ...db.notifications],
    };

    setDb(updatedDb);
    saveDatabase(updatedDb);
    clearCart();

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    note: string,
    extra?: { assignedPartnerId?: string; assignedPartnerName?: string; assignedPartnerPhone?: string }
  ) => {
    const nextDb = updateOrderStatusInDb(db, orderId, newStatus, note, currentUser.name, extra);
    setDb(nextDb);
  };

  const addProduct = (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProd: Product = {
      ...product,
      id: `PROD-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
    };
    const updatedDb: DatabaseState = {
      ...db,
      products: [newProd, ...db.products],
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const updateProduct = (updatedProd: Product) => {
    const updatedDb: DatabaseState = {
      ...db,
      products: db.products.map((p) => (p.id === updatedProd.id ? updatedProd : p)),
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const deleteProduct = (productId: string) => {
    const updatedDb: DatabaseState = {
      ...db,
      products: db.products.filter((p) => p.id !== productId),
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const addReview = (review: Omit<Review, 'id' | 'timestamp'>) => {
    const newRev: Review = {
      ...review,
      id: `REV-${Date.now()}`,
      timestamp: 'Just now',
    };
    const updatedDb: DatabaseState = {
      ...db,
      reviews: [newRev, ...db.reviews],
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'timestamp' | 'status'>) => {
    const newComp: Complaint = {
      ...complaint,
      id: `TICKET-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser.id,
      status: 'Open',
      timestamp: 'Just now',
      priority: 'High',
    };
    const updatedDb: DatabaseState = {
      ...db,
      complaints: [newComp, ...db.complaints],
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const resolveComplaint = (complaintId: string) => {
    const updatedDb: DatabaseState = {
      ...db,
      complaints: db.complaints.map((c) =>
        c.id === complaintId ? { ...c, status: 'Resolved' as const } : c
      ),
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const addCommunityPost = (post: Omit<CommunityPost, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `POST-${Date.now()}`,
      category: post.category || 'Organic Farming',
      likes: 1,
      comments: [],
      timestamp: 'Just now',
      authorAvatar: currentUser.avatar,
    };
    const updatedDb: DatabaseState = {
      ...db,
      communityPosts: [newPost, ...db.communityPosts],
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const likeCommunityPost = (postId: string) => {
    const updatedDb: DatabaseState = {
      ...db,
      communityPosts: db.communityPosts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ),
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const addCommentToPost = (postId: string, text: string) => {
    const newComment = {
      id: `COMM-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text,
      timestamp: 'Just now',
    };
    const updatedDb: DatabaseState = {
      ...db,
      communityPosts: db.communityPosts.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      ),
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const subscribePlan = ({ planId, planName, customizationNotes }: { planId: string; planName: string; customizationNotes?: string }) => {
    const plan = db.subscriptionPlans.find((p) => p.id === planId);
    const newSub: UserSubscription = {
      id: `SUB-${Date.now()}`,
      planId,
      planName,
      pricePerWeek: plan ? plan.pricePerWeek : 499,
      status: 'Active',
      nextDeliveryDate: 'Coming Wednesday 7:00 AM',
      customizationNotes,
    };
    const updatedDb: DatabaseState = {
      ...db,
      userSubscriptions: [newSub, ...(db.userSubscriptions || [])],
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const resetDemoData = () => {
    const freshDb = resetDatabase();
    setDb(freshDb);
    setCart([]);
    alert('🔄 Offline database cache cleared & reset to original default state!');
  };

  const seedDemoData = () => {
    const freshDb = seedDatabase();
    setDb(freshDb);
    alert('🌱 Reseeded database with fresh dummy orders & products!');
  };

  const generateDemoOrder = () => {
    const sampleProduct = db.products[0];
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customerId: 'USR-CUST-1',
      customerName: 'Prof. Evaluation User',
      customerPhone: '+91 98470 11223',
      address: {
        street: 'MCA Lab, Department of CS',
        city: 'Kozhikode',
        region: 'Kozhikode',
        pincode: '673001',
      },
      items: [
        {
          productId: sampleProduct.id,
          productName: sampleProduct.name,
          price: sampleProduct.price,
          unit: sampleProduct.unit,
          quantity: 2,
          seller: sampleProduct.seller,
          sellerId: sampleProduct.sellerId,
          image: sampleProduct.image,
        },
      ],
      subtotal: sampleProduct.price * 2,
      deliveryFee: 30,
      discount: 0,
      totalAmount: sampleProduct.price * 2 + 30,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      status: 'Pending',
      outletId: 'USR-OUTLET-1',
      outletName: 'Kozhikode Central Community Outlet',
      invoiceNumber: `INV-2026-${Math.floor(500 + Math.random() * 500)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Auto-generated test order for simulation',
          updatedBy: 'System Generator',
        },
      ],
    };

    const notif: Notification = {
      id: `NOTIF-${Date.now()}`,
      targetRole: 'ALL',
      title: '🚨 Demo Order Generated',
      message: `New Order ${orderId} created for ₹${newOrder.totalAmount}. Check Outlet dashboard!`,
      orderId,
      timestamp: 'Just now',
      read: false,
      type: 'ORDER',
    };

    const updatedDb: DatabaseState = {
      ...db,
      orders: [newOrder, ...db.orders],
      notifications: [notif, ...db.notifications],
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const generateRandomNotification = () => {
    const messages = [
      '🌾 Wayanad Farmers added 50kg fresh organic carrots today!',
      '🚚 Rajesh V. completed 5 eco-deliveries in Kozhikode.',
      '⭐ Customer gave 5-star rating for Terrace Palak!',
      '🎉 Loyalty points double rewards weekend is active.',
    ];
    const randMsg = messages[Math.floor(Math.random() * messages.length)];
    const notif: Notification = {
      id: `NOTIF-${Date.now()}`,
      targetRole: activeRole,
      title: '🔔 OrganicConnect Update',
      message: randMsg,
      timestamp: 'Just now',
      read: false,
      type: 'SYSTEM',
    };

    const updatedDb: DatabaseState = {
      ...db,
      notifications: [notif, ...db.notifications],
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const markNotificationAsRead = (id: string) => {
    const updatedDb: DatabaseState = {
      ...db,
      notifications: db.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  const clearAllNotifications = () => {
    const updatedDb: DatabaseState = {
      ...db,
      notifications: db.notifications.map((n) => ({ ...n, read: true })),
    };
    setDb(updatedDb);
    saveDatabase(updatedDb);
  };

  return (
    <AppContext.Provider
      value={{
        db,
        activeRole,
        currentUser,
        themeMode,
        cart,
        wishlist,
        unreadNotificationCount,
        activeTab,
        setActiveTab,
        setActiveRole,
        toggleThemeMode,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        addComplaint,
        resolveComplaint,
        addCommunityPost,
        likeCommunityPost,
        addCommentToPost,
        subscribePlan,
        resetDemoData,
        seedDemoData,
        generateDemoOrder,
        generateRandomNotification,
        markNotificationAsRead,
        clearAllNotifications,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
