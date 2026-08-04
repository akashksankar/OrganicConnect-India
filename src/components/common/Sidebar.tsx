import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Storefront as MarketplaceIcon,
  CardGiftcard as SubscriptionIcon,
  ReceiptLong as OrderIcon,
  Agriculture as FarmerIcon,
  Yard as GardenIcon,
  Store as OutletIcon,
  LocalShipping as DeliveryIcon,
  AdminPanelSettings as AdminIcon,
  Forum as CommunityIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const DRAWER_WIDTH = 260;

export const Sidebar: React.FC = () => {
  const { activeRole, activeTab, setActiveTab } = useApp();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        display: { xs: 'none', lg: 'block' },
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100% - 64px)',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          Active Persona Desk
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <Chip label={activeRole} color="primary" sx={{ fontWeight: 700, width: '100%' }} />
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1 }}>
        {/* Marketplace */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={activeTab === 'marketplace'}
            onClick={() => setActiveTab('marketplace')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: activeTab === 'marketplace' ? 'primary.main' : 'action.active' }}>
              <MarketplaceIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: activeTab === 'marketplace' ? 700 : 500, fontSize: '0.9rem' }}>Vegetable Market</Typography>}
            />
          </ListItemButton>
        </ListItem>

        {/* Weekly Subscriptions */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={activeTab === 'subscriptions'}
            onClick={() => setActiveTab('subscriptions')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: activeTab === 'subscriptions' ? 'primary.main' : 'action.active' }}>
              <SubscriptionIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: activeTab === 'subscriptions' ? 700 : 500, fontSize: '0.9rem' }}>Weekly Subscriptions</Typography>}
            />
          </ListItemButton>
        </ListItem>

        {/* Customer Orders */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={activeTab === 'my-orders'}
            onClick={() => setActiveTab('my-orders')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: activeTab === 'my-orders' ? 'primary.main' : 'action.active' }}>
              <OrderIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: activeTab === 'my-orders' ? 700 : 500, fontSize: '0.9rem' }}>My Orders & Track</Typography>}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="caption" color="text.secondary" sx={{ px: 2, fontWeight: 700, textTransform: 'uppercase' }}>
          Role Specific Desks
        </Typography>

        {/* Farmer Desk */}
        <ListItem disablePadding sx={{ mb: 0.5, mt: 1 }}>
          <ListItemButton
            selected={activeTab === 'farmer'}
            onClick={() => setActiveTab('farmer')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: activeTab === 'farmer' ? 'primary.main' : 'action.active' }}>
              <FarmerIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: activeTab === 'farmer' ? 700 : 500, fontSize: '0.9rem' }}>Farmer Harvest Desk</Typography>}
            />
          </ListItemButton>
        </ListItem>

        {/* Terrace Garden Desk */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={activeTab === 'home-garden'}
            onClick={() => setActiveTab('home-garden')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: activeTab === 'home-garden' ? 'secondary.main' : 'action.active' }}>
              <GardenIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: activeTab === 'home-garden' ? 700 : 500, fontSize: '0.9rem' }}>Terrace Garden Desk</Typography>}
            />
          </ListItemButton>
        </ListItem>

        {/* Outlet Manager Desk */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={activeTab === 'outlet'}
            onClick={() => setActiveTab('outlet')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: activeTab === 'outlet' ? 'warning.main' : 'action.active' }}>
              <OutletIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: activeTab === 'outlet' ? 700 : 500, fontSize: '0.9rem' }}>Outlet Dispatch Desk</Typography>}
            />
          </ListItemButton>
        </ListItem>

        {/* Delivery Partner Desk */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={activeTab === 'delivery'}
            onClick={() => setActiveTab('delivery')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: activeTab === 'delivery' ? 'info.main' : 'action.active' }}>
              <DeliveryIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: activeTab === 'delivery' ? 700 : 500, fontSize: '0.9rem' }}>Delivery Route Desk</Typography>}
            />
          </ListItemButton>
        </ListItem>

        {/* Admin Desk */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={activeTab === 'admin'}
            onClick={() => setActiveTab('admin')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: activeTab === 'admin' ? 'secondary.main' : 'action.active' }}>
              <AdminIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: activeTab === 'admin' ? 700 : 500, fontSize: '0.9rem' }}>Admin SaaS Analytics</Typography>}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1.5 }} />

        {/* Community Forum */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            selected={activeTab === 'community'}
            onClick={() => setActiveTab('community')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: activeTab === 'community' ? 'primary.main' : 'action.active' }}>
              <CommunityIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={{ fontWeight: activeTab === 'community' ? 700 : 500, fontSize: '0.9rem' }}>Farming Forum</Typography>}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};
