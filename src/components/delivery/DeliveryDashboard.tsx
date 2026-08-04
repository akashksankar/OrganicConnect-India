import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LocalShipping as BikeIcon,
  Navigation as MapIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
  LocalAtm as CodIcon,
  ReceiptLong as InvoiceIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { MapModal } from '../common/MapModal';
import { InvoiceModal } from '../common/InvoiceModal';
import { Order } from '../../types';

export const DeliveryDashboard: React.FC = () => {
  const { db, updateOrderStatus } = useApp();
  const [activeMapOrder, setActiveMapOrder] = useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [currentTab, setCurrentTab] = useState<number>(0);

  const pendingDeliveries = db.orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  );

  const completedDeliveries = db.orders.filter((o) => o.status === 'Delivered');

  const totalCodCollected = completedDeliveries.reduce((sum, o) => {
    return sum + (o.paymentMethod === 'COD' ? o.totalAmount : 0);
  }, 0);

  const handleMarkDelivered = (order: Order) => {
    updateOrderStatus(order.id, 'Delivered', `Delivered by Partner Rajesh V. COD Collected: ₹${order.paymentMethod === 'COD' ? order.totalAmount : 0}`);
    alert(`✅ Order #${order.id} marked as DELIVERED! Customer notified via SMS.`);
  };

  const ordersToDisplay =
    currentTab === 0
      ? pendingDeliveries
      : currentTab === 1
      ? completedDeliveries
      : db.orders;

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BikeIcon color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Delivery Partner Route & COD Desk
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Partner: <strong>Rajesh V. (Eco Express #DEL-102)</strong> • Kozhikode Delivery Zone
        </Typography>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            variant="outlined"
            onClick={() => setCurrentTab(0)}
            sx={{ p: 2.5, borderRadius: 3, bgcolor: '#E1F5FE', cursor: 'pointer', border: currentTab === 0 ? '2px solid #0288D1' : '1px solid #B3E5FC' }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              ACTIVE PENDING DELIVERIES
            </Typography>
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 800, my: 0.5 }}>
              {pendingDeliveries.length} Packages
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click to view active queue
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            variant="outlined"
            onClick={() => setCurrentTab(1)}
            sx={{ p: 2.5, borderRadius: 3, bgcolor: '#E8F5E9', cursor: 'pointer', border: currentTab === 1 ? '2px solid #2E7D32' : '1px solid #C8E6C9' }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              COMPLETED & DELIVERED
            </Typography>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 800, my: 0.5 }}>
              {completedDeliveries.length} Packages
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click to view completed details
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            variant="outlined"
            onClick={() => setCurrentTab(2)}
            sx={{ p: 2.5, borderRadius: 3, bgcolor: '#FFF8E1', cursor: 'pointer', border: currentTab === 2 ? '2px solid #F57F17' : '1px solid #FFE082' }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              COD CASH TO HANDOVER
            </Typography>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 800, my: 0.5 }}>
              ₹{totalCodCollected}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              All Orders ({db.orders.length})
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Bar */}
      <Paper variant="outlined" sx={{ mb: 3, borderRadius: 3, px: 2, pt: 1 }}>
        <Tabs
          value={currentTab}
          onChange={(_e, val) => setCurrentTab(val)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`Active Route Queue (${pendingDeliveries.length})`} sx={{ fontWeight: 700 }} />
          <Tab label={`Completed / Delivered (${completedDeliveries.length})`} sx={{ fontWeight: 700 }} />
          <Tab label={`All Marketplace Orders (${db.orders.length})`} sx={{ fontWeight: 700 }} />
        </Tabs>
      </Paper>

      {/* Orders List */}
      {ordersToDisplay.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No orders found in this section right now.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {ordersToDisplay.map((order) => {
            const isDelivered = order.status === 'Delivered';

            return (
              <Grid size={{ xs: 12, md: 6 }} key={order.id}>
                <Card sx={{ borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2.5, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Invoice: {order.invoiceNumber} • Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    <Chip
                      label={order.status}
                      color={isDelivered ? 'success' : 'primary'}
                      sx={{ fontWeight: 800 }}
                    />
                  </Box>
                  <Divider />

                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Customer: {order.customerName} ({order.customerPhone})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      📍 Address: {order.address.street}, {order.address.city} - {order.address.pincode}
                    </Typography>

                    <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CodIcon color={order.paymentMethod === 'COD' ? 'error' : 'success'} />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {order.paymentMethod === 'COD' ? `COLLECT COD: ₹${order.totalAmount}` : `PREPAID (${order.paymentMethod})`}
                          </Typography>
                        </Box>
                        <Chip
                          label={order.paymentStatus}
                          size="small"
                          color={order.paymentStatus === 'Paid' ? 'success' : 'warning'}
                        />
                      </Box>
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Order Items:
                    </Typography>
                    {order.items.map((item, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <span>• {item.productName} ({item.quantity} x ₹{item.price})</span>
                        <strong>₹{item.quantity * item.price}</strong>
                      </Typography>
                    ))}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      onClick={() => alert(`Calling ${order.customerPhone}...`)}
                    >
                      Call
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      startIcon={<MapIcon />}
                      onClick={() => setActiveMapOrder(order)}
                    >
                      GPS Map
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      startIcon={<InvoiceIcon />}
                      onClick={() => setSelectedInvoiceOrder(order)}
                    >
                      Invoice
                    </Button>

                    {!isDelivered && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={() => handleMarkDelivered(order)}
                        sx={{ ml: 'auto' }}
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Map Navigation Modal */}
      <MapModal
        open={Boolean(activeMapOrder)}
        onClose={() => setActiveMapOrder(null)}
        orderId={activeMapOrder?.id}
        customerName={activeMapOrder?.customerName}
        customerPhone={activeMapOrder?.customerPhone}
        customerAddress={activeMapOrder ? `${activeMapOrder.address.street}, ${activeMapOrder.address.city}` : undefined}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        open={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />
    </Box>
  );
};
