import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Agriculture as AgricultureIcon,
  Yard as YardIcon,
  Storefront as StorefrontIcon,
  LocalShipping as ShippingIcon,
  AdminPanelSettings as AdminIcon,
  RestartAlt as ResetIcon,
  Dataset as SeedIcon,
  AddShoppingCart as AddOrderIcon,
  NotificationsActive as NotifIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROLES: { role: UserRole; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
  {
    role: 'Customer',
    title: 'Customer',
    subtitle: 'Browse vegetables, cart, checkout, UPI payment, track orders',
    icon: <PersonIcon fontSize="large" />,
    color: '#2E7D32',
  },
  {
    role: 'Farmer',
    title: 'Organic Farmer',
    subtitle: "Manage harvest, update stock, view crop income & orders",
    icon: <AgricultureIcon fontSize="large" />,
    color: '#388E3C',
  },
  {
    role: 'Home Garden Seller',
    title: 'Home Garden Seller',
    subtitle: 'Micro-inventory, terrace garden fresh harvests, local sales',
    icon: <YardIcon fontSize="large" />,
    color: '#689F38',
  },
  {
    role: 'Outlet Manager',
    title: 'Outlet Manager',
    subtitle: 'Accept incoming orders, manage packing queue & delivery assignment',
    icon: <StorefrontIcon fontSize="large" />,
    color: '#F57C00',
  },
  {
    role: 'Delivery Partner',
    title: 'Delivery Partner',
    subtitle: 'View today route, navigate map, call customer, collect COD',
    icon: <ShippingIcon fontSize="large" />,
    color: '#0288D1',
  },
  {
    role: 'Admin',
    title: 'Administrator',
    subtitle: 'SaaS metrics, Recharts sales analytics, users & complaints desk',
    icon: <AdminIcon fontSize="large" />,
    color: '#7B1FA2',
  },
];

export const SimulationSettingsDialog: React.FC<Props> = ({ open, onClose }) => {
  const {
    activeRole,
    setActiveRole,
    resetDemoData,
    seedDemoData,
    generateDemoOrder,
    generateRandomNotification,
    db,
  } = useApp();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <SettingsIcon color="primary" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            MCA Simulation Settings & Role Switcher
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Switch roles instantly to test shared localStorage order lifecycle
          </Typography>
        </Box>
        <Chip
          label={`Active: ${activeRole}`}
          color="secondary"
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Professor Evaluation Mode:</strong> Every role operates on the <i>SAME in-memory localStorage cache</i>. Place an order as Customer, switch to Outlet Manager to accept & assign it, switch to Delivery Partner to deliver & collect COD, and switch to Admin to see updated charts!
        </Alert>

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Select Active Persona / Role:
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {ROLES.map((r) => {
            const isSelected = activeRole === r.role;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.role}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: isSelected ? r.color : 'divider',
                    borderWidth: isSelected ? 2 : 1,
                    backgroundColor: isSelected ? `${r.color}0D` : 'background.paper',
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      setActiveRole(r.role);
                    }}
                    sx={{ p: 1.5 }}
                  >
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box sx={{ color: r.color }}>{r.icon}</Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {r.title}
                          </Typography>
                          {isSelected && (
                            <Chip
                              label="CURRENT"
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                bgcolor: r.color,
                                color: '#fff',
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {r.subtitle}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Demo Control Panel & Data Generators:
        </Typography>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<AddOrderIcon />}
              onClick={generateDemoOrder}
            >
              Generate Demo Order
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<NotifIcon />}
              onClick={generateRandomNotification}
            >
              Trigger Notification
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              color="success"
              startIcon={<SeedIcon />}
              onClick={seedDemoData}
            >
              Reseed Database
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<ResetIcon />}
              onClick={resetDemoData}
            >
              Reset All Cache
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            <strong>Cache Summary:</strong> {db.products.length} Products | {db.orders.length} Orders | {db.users.length} Users | {db.deliveries.length} Deliveries | {db.payments.length} Payments
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={onClose} color="primary">
          Apply & Close Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};
