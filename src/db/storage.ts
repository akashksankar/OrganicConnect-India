import { DatabaseState, Order, OrderStatus, Product, UserRole, Notification, Review, Complaint, CommunityPost } from '../types';
import { getInitialDatabaseState } from './seedData';

const STORAGE_KEY = 'organic_connect_india_db_v1';
const ACTIVE_ROLE_KEY = 'organic_connect_active_role';
const THEME_MODE_KEY = 'organic_connect_theme_mode';

export function loadDatabase(): DatabaseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDatabaseState();
      saveDatabase(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    // Ensure critical arrays exist
    return {
      ...getInitialDatabaseState(),
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to load database from localStorage, initializing fresh:', error);
    const initial = getInitialDatabaseState();
    saveDatabase(initial);
    return initial;
  }
}

export function saveDatabase(state: DatabaseState): void {
  try {
    state.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save database to localStorage:', error);
  }
}

export function resetDatabase(): DatabaseState {
  const initial = getInitialDatabaseState();
  saveDatabase(initial);
  return initial;
}

export function seedDatabase(): DatabaseState {
  return resetDatabase();
}

export function loadActiveRole(): UserRole {
  try {
    const role = localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole;
    if (role) return role;
  } catch (e) {
    // fallback
  }
  return 'Customer';
}

export function saveActiveRole(role: UserRole): void {
  try {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
  } catch (e) {
    console.error('Failed to save active role:', e);
  }
}

export function loadThemeMode(): 'light' | 'dark' {
  try {
    const mode = localStorage.getItem(THEME_MODE_KEY) as 'light' | 'dark';
    if (mode === 'dark' || mode === 'light') return mode;
  } catch (e) {}
  return 'light';
}

export function saveThemeMode(mode: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_MODE_KEY, mode);
  } catch (e) {}
}

// Order Status Helper with Auto Timeline & Notifications
export function updateOrderStatusInDb(
  db: DatabaseState,
  orderId: string,
  newStatus: OrderStatus,
  note: string,
  updatedBy: string,
  extra?: { assignedPartnerId?: string; assignedPartnerName?: string; assignedPartnerPhone?: string }
): DatabaseState {
  const updatedOrders = db.orders.map((ord) => {
    if (ord.id !== orderId) return ord;

    const newTimelineItem = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note,
      updatedBy,
    };

    const isCOD = ord.paymentMethod === 'COD';
    const isDelivered = newStatus === 'Delivered';

    return {
      ...ord,
      status: newStatus,
      paymentStatus: isDelivered && isCOD ? ('Paid' as const) : ord.paymentStatus,
      codCollected: isDelivered && isCOD ? true : ord.codCollected,
      assignedDeliveryPartnerId: extra?.assignedPartnerId || ord.assignedDeliveryPartnerId,
      assignedDeliveryPartnerName: extra?.assignedPartnerName || ord.assignedDeliveryPartnerName,
      assignedDeliveryPartnerPhone: extra?.assignedPartnerPhone || ord.assignedDeliveryPartnerPhone,
      updatedAt: new Date().toISOString(),
      timeline: [...ord.timeline, newTimelineItem],
    };
  });

  const updatedOrder = updatedOrders.find((o) => o.id === orderId);

  // Sync deliveries
  let updatedDeliveries = [...db.deliveries];
  if (updatedOrder) {
    const existingIndex = updatedDeliveries.findIndex((d) => d.orderId === orderId);
    const delTask = {
      id: existingIndex >= 0 ? updatedDeliveries[existingIndex].id : `DEL-${Date.now()}`,
      orderId: updatedOrder.id,
      customerName: updatedOrder.customerName,
      customerPhone: updatedOrder.customerPhone,
      address: `${updatedOrder.address.street}, ${updatedOrder.address.city} - ${updatedOrder.address.pincode}`,
      region: updatedOrder.address.region,
      itemsCount: updatedOrder.items.reduce((acc, i) => acc + i.quantity, 0),
      totalAmount: updatedOrder.totalAmount,
      paymentMethod: `${updatedOrder.paymentMethod} (${updatedOrder.paymentStatus})`,
      codAmountToCollect: updatedOrder.paymentMethod === 'COD' && !updatedOrder.codCollected ? updatedOrder.totalAmount : 0,
      status: newStatus,
      outletName: updatedOrder.outletName,
      assignedPartnerId: updatedOrder.assignedDeliveryPartnerId || 'USR-DELIV-1',
      assignedPartnerName: updatedOrder.assignedDeliveryPartnerName || 'Rajesh V. (Eco Delivery)',
      estimatedDeliveryTime: '20 Mins',
    };

    if (existingIndex >= 0) {
      updatedDeliveries[existingIndex] = delTask;
    } else {
      updatedDeliveries.unshift(delTask);
    }
  }

  // Generate notification for Customer & Admin
  const newNotification: Notification = {
    id: `NOTIF-${Date.now()}`,
    targetRole: 'Customer',
    title: `Order ${orderId} Status Updated!`,
    message: `Your order is now "${newStatus}". Note: ${note}`,
    orderId,
    timestamp: 'Just now',
    read: false,
    type: 'ORDER',
  };

  const newDb: DatabaseState = {
    ...db,
    orders: updatedOrders,
    deliveries: updatedDeliveries,
    notifications: [newNotification, ...db.notifications],
  };

  saveDatabase(newDb);
  return newDb;
}
