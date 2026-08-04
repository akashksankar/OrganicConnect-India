import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  LocalFlorist as FloristIcon,
  ShoppingCart as CartIcon,
  Notifications as NotifIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  ReportProblem as ComplaintIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

interface Props {
  onOpenSimulation: () => void;
  onOpenCart: () => void;
  onOpenComplaints: () => void;
}

export const Header: React.FC<Props> = ({
  onOpenSimulation,
  onOpenCart,
  onOpenComplaints,
}) => {
  const {
    activeRole,
    cart,
    unreadNotificationCount,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const cartItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        bgcolor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        {/* Brand Logo & Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: 0.8,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FloristIcon />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              OrganicConnect
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              India • MCA Prototype
            </Typography>
          </Box>
        </Box>

        {/* Global Search Bar */}
        <Box sx={{ flexGrow: 1, maxWidth: 450, display: { xs: 'none', md: 'block' } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search organic carrots, spinach, Wayanad farms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: 'action.hover' },
              },
            }}
          />
        </Box>

        {/* Role & Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* MCA Persona Switcher Button */}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<SettingsIcon />}
            onClick={onOpenSimulation}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              textTransform: 'none',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            Role: {activeRole}
          </Button>

          <IconButton
            color="primary"
            onClick={onOpenSimulation}
            sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
          >
            <SettingsIcon />
          </IconButton>

          {/* Customer Cart */}
          <Tooltip title="Shopping Basket">
            <IconButton color="inherit" onClick={onOpenCart}>
              <Badge badgeContent={cartItemsCount} color="secondary">
                <CartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Drawer */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={unreadNotificationCount} color="error">
                <NotifIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Raise Complaint Ticket */}
          <Tooltip title="Raise Quality Ticket">
            <IconButton color="warning" onClick={onOpenComplaints}>
              <ComplaintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
