import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import { getAppTheme } from './theme';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { SimulationSettingsDialog } from './components/simulation/SimulationSettingsDialog';
import { CustomerHome } from './components/customer/CustomerHome';
import { SubscriptionBoxes } from './components/customer/SubscriptionBoxes';
import { OrderHistory } from './components/customer/OrderHistory';
import { CartWishlistDrawer } from './components/customer/CartWishlist';
import { CheckoutWizard } from './components/customer/CheckoutWizard';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { HomeGardenDashboard } from './components/homegarden/HomeGardenDashboard';
import { OutletDashboard } from './components/outlet/OutletDashboard';
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CommunityForum } from './components/community/CommunityForum';
import { ComplaintsModal } from './components/common/ComplaintsModal';
import { Order } from './types';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [complaintsOpen, setComplaintsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | undefined>();

  const handleOrderSuccess = (_newOrder: Order) => {
    setActiveTab('my-orders');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation Header */}
      <Header
        onOpenSimulation={() => setSimulationOpen(true)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenComplaints={() => setComplaintsOpen(true)}
      />

      <Box sx={{ display: 'flex', flex: 1, pt: '70px' }}>
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflowX: 'hidden' }}>
          <Container maxWidth="xl" disableGutters>
            {activeTab === 'marketplace' && (
              <CustomerHome onOpenSubscriptions={() => setActiveTab('subscriptions')} />
            )}
            {activeTab === 'subscriptions' && <SubscriptionBoxes />}
            {activeTab === 'my-orders' && <OrderHistory />}
            {(activeTab === 'farmer' || activeTab === 'farmer-desk') && <FarmerDashboard />}
            {(activeTab === 'home-garden' || activeTab === 'homegarden-desk') && <HomeGardenDashboard />}
            {(activeTab === 'outlet' || activeTab === 'outlet-desk') && <OutletDashboard />}
            {(activeTab === 'delivery' || activeTab === 'delivery-desk') && <DeliveryDashboard />}
            {(activeTab === 'admin' || activeTab === 'admin-analytics') && <AdminDashboard />}
            {activeTab === 'community' && <CommunityForum />}
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Role Switcher & MCA Simulation Settings Dialog */}
      <SimulationSettingsDialog
        open={simulationOpen}
        onClose={() => setSimulationOpen(false)}
      />

      {/* Shopping Cart Drawer */}
      <CartWishlistDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onProceedToCheckout={(coupon) => {
          setAppliedCoupon(coupon);
          setCheckoutOpen(true);
        }}
      />

      {/* Multi-Step Checkout Wizard Modal */}
      <CheckoutWizard
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        appliedCoupon={appliedCoupon}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Quality Support / Complaint Ticket Modal */}
      <ComplaintsModal
        open={complaintsOpen}
        onClose={() => setComplaintsOpen(false)}
      />
    </Box>
  );
};

const AppWithTheme: React.FC = () => {
  const { themeMode } = useApp();
  const theme = useMemo(() => getAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainAppContent />
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppWithTheme />
    </AppProvider>
  );
}
