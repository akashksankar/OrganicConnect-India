import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  Avatar,
  Divider,
  TextField,
  Chip,
  Alert,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Delete as DeleteIcon,
  LocalOffer as TagIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onProceedToCheckout: (appliedCoupon?: { code: string; discount: number }) => void;
}

export const CartWishlistDrawer: React.FC<Props> = ({
  open,
  onClose,
  onProceedToCheckout,
}) => {
  const { cart, removeFromCart, updateCartQuantity, db } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 30;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const codeUpper = couponCode.trim().toUpperCase();
    const found = db.coupons.find((c) => c.code === codeUpper);
    if (!found) {
      setCouponError('Invalid coupon code. Try ORGANIC20 or FRESH50');
      return;
    }
    if (subtotal < found.minOrderAmount) {
      setCouponError(`Minimum order amount of ₹${found.minOrderAmount} required for ${found.code}`);
      return;
    }

    let discount = 0;
    if (found.discountType === 'PERCENT') {
      discount = Math.round((subtotal * found.value) / 100);
    } else {
      discount = found.value;
    }

    setAppliedCoupon({ code: found.code, discount });
    setCouponCode('');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 320, sm: 420 }, display: 'flex', flexDirection: 'column', height: '100%', p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CartIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Your Organic Basket
            </Typography>
            <Chip label={`${cart.length} items`} size="small" color="primary" />
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Cart Item List */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
          {cart.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Your organic basket is currently empty!
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Explore 40+ fresh farm vegetables & greens harvested today.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {cart.map(({ product, quantity }) => (
                <Paper
                  key={product.id}
                  variant="outlined"
                  sx={{ mb: 1.5, p: 1.5, borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}
                >
                  <Avatar
                    src={product.image}
                    alt={product.name}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      ₹{product.price} / {product.unit}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Button
                        size="small"
                        sx={{ minWidth: 28, px: 0.5, py: 0 }}
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      >
                        -
                      </Button>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {quantity}
                      </Typography>
                      <Button
                        size="small"
                        sx={{ minWidth: 28, px: 0.5, py: 0 }}
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      >
                        +
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800 }}>
                      ₹{product.price * quantity}
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => removeFromCart(product.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </List>
          )}
        </Box>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Enter Coupon (e.g. ORGANIC20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <TagIcon fontSize="small" color="action" sx={{ mr: 1 }} />,
                  },
                }}
              />
              <Button variant="outlined" color="primary" onClick={handleApplyCoupon}>
                Apply
              </Button>
            </Box>

            {couponError && (
              <Alert severity="error" sx={{ mb: 1, py: 0 }}>
                {couponError}
              </Alert>
            )}

            {appliedCoupon && (
              <Chip
                label={`Applied Code: ${appliedCoupon.code} (-₹${appliedCoupon.discount})`}
                color="success"
                onDelete={() => setAppliedCoupon(null)}
                sx={{ mb: 1.5, fontWeight: 700 }}
              />
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ₹{subtotal}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Eco Delivery Fee:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: deliveryFee === 0 ? 'success.main' : 'text.primary' }}>
                {deliveryFee === 0 ? 'FREE (Above ₹500)' : `₹${deliveryFee}`}
              </Typography>
            </Box>

            {appliedCoupon && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="success.main">
                  Discount:
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                  -₹{appliedCoupon.discount}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Total Payable:
              </Typography>
              <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 800 }}>
                ₹{finalTotal}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              endIcon={<ArrowIcon />}
              onClick={() => {
                onClose();
                onProceedToCheckout(appliedCoupon || undefined);
              }}
              sx={{ borderRadius: 3, py: 1.4 }}
            >
              Proceed to Payment (₹{finalTotal})
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
