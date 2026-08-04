import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Navigation as NavIcon,
  Storefront as OutletIcon,
  Home as HomeIcon,
  LocalShipping as BikeIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
}

export const MapModal: React.FC<Props> = ({
  open,
  onClose,
  orderId = 'ORD-DEMO',
  customerName = 'Akash K. Shankar',
  customerPhone = '+91 98470 12345',
  customerAddress = 'Flat 4B, Malabar Heights, Beach Road, Kozhikode',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NavIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Live Eco-Delivery GPS Map Navigation ({orderId})
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        {/* Vector SVG Simulated Map */}
        <Box
          sx={{
            width: '100%',
            height: 320,
            borderRadius: 3,
            bgcolor: '#E8F5E9',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            mb: 3,
          }}
        >
          {/* SVG Map Lines */}
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <path
              d="M 60 220 Q 200 120 450 80 T 720 180"
              fill="none"
              stroke="#A5D6A7"
              strokeWidth="12"
            />
            <path
              d="M 60 220 Q 200 120 450 80 T 720 180"
              fill="none"
              stroke="#2E7D32"
              strokeWidth="4"
              strokeDasharray="8 8"
            />
            <circle cx="120" cy="180" r="28" fill="#2E7D32" fillOpacity="0.15" />
            <circle cx="650" cy="160" r="28" fill="#F57C00" fillOpacity="0.15" />
          </svg>

          {/* Kozhikode Outlet Pin */}
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: 140,
              left: 80,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'primary.main',
              color: '#fff',
              borderRadius: 2,
            }}
          >
            <OutletIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Kozhikode Central Outlet
            </Typography>
          </Paper>

          {/* Moving Eco Bike Rider Pin */}
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: 70,
              left: 360,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'secondary.main',
              color: '#fff',
              borderRadius: 2,
              animation: 'pulse 1.5s infinite',
            }}
          >
            <BikeIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 800 }}>
              Partner Rajesh V. (1.2 km away)
            </Typography>
          </Paper>

          {/* Customer Doorstep Destination Pin */}
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: 130,
              left: 600,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'warning.main',
              color: '#fff',
              borderRadius: 2,
            }}
          >
            <HomeIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {customerName} Doorstep
            </Typography>
          </Paper>
        </Box>

        {/* Route Details Box */}
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Destination: {customerName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {customerAddress}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Chip label="ESTIMATED ARRIVAL: 12 MINS" color="success" sx={{ fontWeight: 800, mb: 0.5 }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Phone: {customerPhone}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button startIcon={<PhoneIcon />} variant="outlined" color="primary" onClick={() => alert(`Dialing ${customerPhone}...`)}>
          Call Customer ({customerPhone})
        </Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close Navigation Map
        </Button>
      </DialogActions>
    </Dialog>
  );
};
