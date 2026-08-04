import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Payment as PaymentIcon,
  QrCode2 as QrIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  AccountBalanceWallet as WalletIcon,
  LocalAtm as CodIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  appliedCoupon?: { code: string; discount: number };
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutWizard: React.FC<Props> = ({
  open,
  onClose,
  appliedCoupon,
  onOrderSuccess,
}) => {
  const { cart, currentUser, placeOrder } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState({
    street: currentUser.address || 'Flat 4B, Malabar Heights, Beach Road',
    city: 'Kozhikode',
    region: 'Kozhikode',
    pincode: '673001',
    deliveryNotes: 'Please ring bell and leave package at doorstep.',
  });
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET'>('UPI');
  const [upiId, setUpiId] = useState('akash@upi');
  const [cardNumber, setCardNumber] = useState('4532 8910 3341 9012');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('421');
  const [selectedBank, setSelectedBank] = useState('SBI');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 30;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      try {
        const newOrder = placeOrder({
          method: paymentMethod,
          address,
          customerName,
          customerPhone,
          couponCode: appliedCoupon?.code,
          discountAmount,
        });
        setCompletedOrder(newOrder);
        setIsProcessing(false);
        setStep(3);
      } catch (err: any) {
        setIsProcessing(false);
        alert(err.message || 'Payment simulation failed');
      }
    }, 1200);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaymentIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {step === 1 ? 'Step 1: Delivery Address & Phone' : step === 2 ? 'Step 2: Payment Simulation' : 'Order Placed Successfully!'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {/* STEP 1: Address & Contact */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Enter delivery address in Kozhikode / Kerala region for same-day organic delivery.
            </Alert>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Customer Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label="Street Address / House / Flat No."
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label="Region / District"
                  value={address.region}
                  onChange={(e) => setAddress({ ...address, region: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Delivery Instructions (Optional)"
                  placeholder="e.g. Call before delivery, ring bell..."
                  value={address.deliveryNotes}
                  onChange={(e) => setAddress({ ...address, deliveryNotes: e.target.value })}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button type="submit" variant="contained" size="large" color="primary">
                Proceed to Payment (₹{finalAmount})
              </Button>
            </Box>
          </form>
        )}

        {/* STEP 2: Simulated Payment Selection */}
        {step === 2 && (
          <Box>
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Order Summary:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {cart.length} Organic Produce Items • Total Amount Payable: <strong>₹{finalAmount}</strong>
              </Typography>
            </Paper>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Select Payment Method (Simulation Mode):
            </Typography>

            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
            >
              {/* UPI Option */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  borderColor: paymentMethod === 'UPI' ? 'primary.main' : 'divider',
                }}
              >
                <FormControlLabel
                  value="UPI"
                  control={<Radio color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <QrIcon color="primary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        UPI Payment (GPay, PhonePe, Paytm, BHIM)
                      </Typography>
                    </Box>
                  }
                />
                {paymentMethod === 'UPI' && (
                  <Box sx={{ pl: 4, pt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          border: '2px dashed',
                          borderColor: 'primary.main',
                          borderRadius: 2,
                          bgcolor: '#fff',
                        }}
                      >
                        <QrIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Scan QR Code or enter VPA:
                        </Typography>
                        <TextField
                          size="small"
                          label="UPI ID / VPA"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          sx={{ mt: 0.5, width: 220 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}
              </Paper>

              {/* CARD Option */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  borderColor: paymentMethod === 'CARD' ? 'primary.main' : 'divider',
                }}
              >
                <FormControlLabel
                  value="CARD"
                  control={<Radio color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CardIcon color="primary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Credit / Debit Card
                      </Typography>
                    </Box>
                  }
                />
                {paymentMethod === 'CARD' && (
                  <Grid container spacing={1.5} sx={{ pl: 4, pt: 1 }}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Expiry (MM/YY)"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        size="small"
                        fullWidth
                        label="CVV"
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                )}
              </Paper>

              {/* NET BANKING Option */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  borderColor: paymentMethod === 'NET_BANKING' ? 'primary.main' : 'divider',
                }}
              >
                <FormControlLabel
                  value="NET_BANKING"
                  control={<Radio color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BankIcon color="primary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Net Banking
                      </Typography>
                    </Box>
                  }
                />
                {paymentMethod === 'NET_BANKING' && (
                  <Box sx={{ pl: 4, pt: 1 }}>
                    <FormControl size="small" sx={{ width: 220 }}>
                      <InputLabel>Select Bank</InputLabel>
                      <Select
                        value={selectedBank}
                        label="Select Bank"
                        onChange={(e) => setSelectedBank(e.target.value)}
                      >
                        <MenuItem value="SBI">State Bank of India (SBI)</MenuItem>
                        <MenuItem value="HDFC">HDFC Bank</MenuItem>
                        <MenuItem value="ICICI">ICICI Bank</MenuItem>
                        <MenuItem value="AXIS">Axis Bank</MenuItem>
                        <MenuItem value="CANARA">Canara Bank</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Paper>

              {/* WALLET Option */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  borderColor: paymentMethod === 'WALLET' ? 'primary.main' : 'divider',
                }}
              >
                <FormControlLabel
                  value="WALLET"
                  control={<Radio color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WalletIcon color="primary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        OrganicConnect Wallet (Balance: ₹1,250)
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* COD Option */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: paymentMethod === 'COD' ? 'primary.main' : 'divider',
                }}
              >
                <FormControlLabel
                  value="COD"
                  control={<Radio color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CodIcon color="secondary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Cash on Delivery (COD)
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={() => setStep(1)} variant="outlined">
                Back to Address
              </Button>
              <Button
                onClick={handleExecutePayment}
                variant="contained"
                size="large"
                color="primary"
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isProcessing ? 'Processing Payment...' : `Simulate Pay ₹${finalAmount}`}
              </Button>
            </Box>
          </Box>
        )}

        {/* STEP 3: Order Placed Confirmation */}
        {step === 3 && completedOrder && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'success.main',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CheckIcon sx={{ fontSize: 44 }} />
            </Box>

            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
              Order Confirmed!
            </Typography>
            <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 700 }}>
              Order ID: {completedOrder.id} • Invoice #: {completedOrder.invoiceNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              Your organic produce order has been routed to <strong>{completedOrder.outletName}</strong>. You can test role simulation now!
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, my: 3, textAlign: 'left', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                🚚 Shared Cache Order Lifecycle:
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                1. Switch role to <strong>Outlet Manager</strong> to Accept & Pack this order.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                2. Switch role to <strong>Delivery Partner</strong> to Pick up, Navigate map, and Complete delivery.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                3. Switch role to <strong>Admin</strong> to view updated revenue and analytics!
              </Typography>
            </Paper>

            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => {
                onClose();
                onOrderSuccess(completedOrder);
              }}
              sx={{ borderRadius: 3, px: 4 }}
            >
              View Order Live Timeline
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
