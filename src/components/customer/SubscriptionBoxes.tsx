import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  CardGiftcard as BoxIcon,
  CalendarMonth as CalendarIcon,
  LocalShipping as DeliveryIcon,
} from '@mui/icons-material';
import { SubscriptionBox } from '../../types';
import { useApp } from '../../context/AppContext';

export const SubscriptionBoxes: React.FC = () => {
  const { db, subscribePlan, currentUser } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionBox | null>(null);
  const [deliveryDay, setDeliveryDay] = useState('Wednesday');
  const [customNotes, setCustomNotes] = useState('');

  const handleConfirmSubscription = () => {
    if (!selectedPlan) return;
    subscribePlan({
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      customizationNotes: customNotes,
    });
    alert(`🎉 Subscribed to ${selectedPlan.name}! Delivered every ${deliveryDay} morning.`);
    setSelectedPlan(null);
    setCustomNotes('');
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Chip
          icon={<BoxIcon sx={{ color: 'primary.main !important' }} />}
          label="Doorstep Organic Grocery Subscriptions"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700, mb: 1.5 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Weekly Organic Harvest Subscription Boxes
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto' }}>
          Subscribe once and receive freshly harvested Wayanad organic produce delivered every week directly from certified community farmers.
        </Typography>
      </Box>

      {/* Plans Grid */}
      <Grid container spacing={3}>
        {db.subscriptionPlans.map((plan) => (
          <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                position: 'relative',
                border: '2px solid',
                borderColor: plan.isPopular ? 'primary.main' : 'divider',
              }}
            >
              {plan.isPopular && (
                <Chip
                  label="MOST POPULAR FAMILY CHOICE"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: 24,
                    fontWeight: 800,
                    fontSize: '0.7rem',
                  }}
                />
              )}

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                  {plan.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Serves {plan.servesPeople} • Weight ~{plan.estimatedWeightKg}kg per week
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 2 }}>
                  <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
                    ₹{plan.pricePerWeek}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    / week
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Weekly Items Included:
                </Typography>

                <List disablePadding>
                  {plan.itemsIncluded.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}>
                        <CheckIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={<Typography sx={{ fontSize: '0.9rem' }}>{item}</Typography>} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant={plan.isPopular ? 'contained' : 'outlined'}
                  size="large"
                  color="primary"
                  onClick={() => setSelectedPlan(plan)}
                  sx={{ borderRadius: 3, py: 1.2, fontWeight: 700 }}
                >
                  Subscribe Now (₹{plan.pricePerWeek}/wk)
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Active Subscriptions */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
          Your Active Subscriptions ({db.userSubscriptions?.length || 0})
        </Typography>

        {(!db.userSubscriptions || db.userSubscriptions.length === 0) ? (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No active subscription plans. Select a plan above to start automatic weekly organic deliveries.
            </Typography>
          </Paper>
        ) : (
          db.userSubscriptions.map((sub) => (
            <Paper key={sub.id} variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {sub.planName}
                    </Typography>
                    <Chip label={sub.status} color="success" size="small" sx={{ fontWeight: 700 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Next Delivery: <strong>{sub.nextDeliveryDate}</strong> • ₹{sub.pricePerWeek}/week
                  </Typography>
                </Box>
                <Button variant="outlined" color="error" size="small">
                  Pause Plan
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* Modal */}
      <Dialog open={Boolean(selectedPlan)} onClose={() => setSelectedPlan(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Subscribe: {selectedPlan?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              fullWidth
              label="Preferred Delivery Day"
              value={deliveryDay}
              onChange={(e) => setDeliveryDay(e.target.value)}
            >
              <MenuItem value="Wednesday">Wednesday Morning (7 AM - 9 AM)</MenuItem>
              <MenuItem value="Saturday">Saturday Morning (7 AM - 9 AM)</MenuItem>
              <MenuItem value="Sunday">Sunday Morning (7 AM - 9 AM)</MenuItem>
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Customization Notes / Allergic Restrictions"
              placeholder="e.g. Please replace Bitter Gourd with extra Spinach if possible."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedPlan(null)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmSubscription}>
            Confirm Weekly Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
