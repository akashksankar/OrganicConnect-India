export type UserRole =
  | 'Customer'
  | 'Farmer'
  | 'Home Garden Seller'
  | 'Outlet Manager'
  | 'Delivery Partner'
  | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  region: string;
  address?: string;
  organicVerified?: boolean;
  loyaltyPoints?: number;
  walletBalance?: number;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Leafy Greens' | 'Root Vegetables' | 'Gourds & Squashes' | 'Pods & Beans' | 'Exotic & Special' | 'Spices & Herbs';
  price: number; // in INR
  unit: string; // e.g. "500g", "1 kg", "1 bunch"
  quantity: number; // in-stock count
  seller: string;
  sellerRole: 'Farmer' | 'Home Garden Seller';
  sellerId: string;
  region: string;
  organicVerified: boolean;
  image: string;
  rating: number;
  reviewsCount: number;
  harvestTime: string;
  description: string;
  isPopular?: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Outlet Accepted'
  | 'Packing'
  | 'Ready'
  | 'Assigned'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  unit: string;
  quantity: number;
  seller: string;
  sellerId: string;
  image: string;
}

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface Order {
  id: string; // e.g. ORD-8021
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: {
    street: string;
    city: string;
    region: string;
    pincode: string;
    deliveryNotes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';
  paymentStatus: 'Paid' | 'Pending COD' | 'Refunded';
  status: OrderStatus;
  outletId: string;
  outletName: string;
  assignedDeliveryPartnerId?: string;
  assignedDeliveryPartnerName?: string;
  assignedDeliveryPartnerPhone?: string;
  timeline: OrderTimelineItem[];
  createdAt: string;
  updatedAt: string;
  invoiceNumber: string;
  codCollected?: boolean;
}

export interface DeliveryTask {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  region: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: string;
  codAmountToCollect: number;
  status: OrderStatus;
  outletName: string;
  assignedPartnerId: string;
  assignedPartnerName: string;
  estimatedDeliveryTime: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: 'COD' | 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  transactionRef: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  targetRole: UserRole | 'ALL';
  title: string;
  message: string;
  orderId?: string;
  timestamp: string;
  read: boolean;
  type: 'ORDER' | 'SYSTEM' | 'COMMUNITY' | 'PROMO';
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  orderId?: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  title: string;
  content: string;
  category: 'Gardening Tips' | 'Organic Farming' | 'Farm Recipes' | 'General Q&A';
  tags: string[];
  likes: number;
  likedByCurrentUser?: boolean;
  comments: {
    id: string;
    authorName: string;
    authorRole: UserRole;
    text: string;
    timestamp: string;
  }[];
  timestamp: string;
  imageUrl?: string;
}

export interface SubscriptionBox {
  id: string;
  name: string;
  servesPeople: string;
  estimatedWeightKg: number;
  pricePerWeek: number;
  itemsIncluded: string[];
  isPopular?: boolean;
  description?: string;
  frequency?: string;
  itemsCount?: string;
  pricePerDeliver?: number;
  image?: string;
  popular?: boolean;
  contents?: string[];
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  pricePerWeek: number;
  status: 'Active' | 'Paused';
  nextDeliveryDate: string;
  customizationNotes?: string;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENT' | 'FLAT';
  value: number;
  minOrderAmount: number;
  description: string;
}

export interface DatabaseState {
  users: User[];
  products: Product[];
  orders: Order[];
  deliveries: DeliveryTask[];
  payments: PaymentRecord[];
  notifications: Notification[];
  reviews: Review[];
  complaints: Complaint[];
  communityPosts: CommunityPost[];
  subscriptionPlans: SubscriptionBox[];
  userSubscriptions: UserSubscription[];
  coupons: Coupon[];
  lastUpdated: string;
}
