import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ReceiptLong as InvoiceIcon,
  Map as MapIcon,
  CheckCircle as CheckIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { InvoiceModal } from '../common/InvoiceModal';
import { MapModal } from '../common/MapModal';

const ORDER_STEPS: OrderStatus[] = [
  'Pending',
  'Outlet Accepted',
  'Packing',
  'Ready',
  'Assigned',
  'Out for Delivery',
  'Delivered',
];

export const OrderHistory: React.FC = () => {
  const { db, currentUser } = useApp();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [selectedMapOrder, setSelectedMapOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED'>('ALL');

  const userSpecificOrders = db.orders.filter(
    (o) => o.customerId === currentUser.id || o.customerName === currentUser.name
  );

  // Fallback to all db.orders if non-customer or userSpecificOrders is empty
  const baseOrders = userSpecificOrders.length > 0 ? userSpecificOrders : db.orders;

  const filteredOrders = baseOrders.filter((o) => {
    if (statusFilter === 'ACTIVE') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (statusFilter === 'DELIVERED') return o.status === 'Delivered';
    return true;
  });

  const getStepIndex = (status: OrderStatus) => {
    const idx = ORDER_STEPS.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            My Orders & Live Order Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track real-time status updates across Kozhikode Community Outlet, Delivery Partner, and Farmers.
          </Typography>
        </Box>
      </Box>

      {currentUser.role !== 'Customer' && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
          Viewing order tracking history as <strong>{currentUser.role} ({currentUser.name})</strong>. Displaying all customer orders in system memory.
        </Alert>
      )}

      {/* Filter Tabs */}
      <Paper variant="outlined" sx={{ mb: 4, borderRadius: 3, px: 2, pt: 1 }}>
        <Tabs
          value={statusFilter}
          onChange={(_e, val) => setStatusFilter(val)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="ALL" label={`All Orders (${baseOrders.length})`} sx={{ fontWeight: 700 }} />
          <Tab value="ACTIVE" label={`In-Transit / Active (${baseOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length})`} sx={{ fontWeight: 700 }} />
          <Tab value="DELIVERED" label={`Completed / Delivered (${baseOrders.filter((o) => o.status === 'Delivered').length})`} sx={{ fontWeight: 700 }} />
        </Tabs>
      </Paper>

      {filteredOrders.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No orders found matching this filter.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Place your first organic vegetable order from the marketplace tab!
          </Typography>
        </Paper>
      ) : (
        filteredOrders.map((order) => {
          const activeStep = getStepIndex(order.status);
          const isDelivered = order.status === 'Delivered';

          return (
            <Card key={order.id} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
              <Box sx={{ p: 3, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Order #{order.id}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={
                        isDelivered
                          ? 'success'
                          : order.status === 'Cancelled'
                          ? 'error'
                          : 'warning'
                      }
                      sx={{ fontWeight: 800 }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Placed on: {new Date(order.createdAt).toLocaleString()} • Outlet: {order.outletName}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<MapIcon />}
                    onClick={() => setSelectedMapOrder(order)}
                  >
                    Track Map
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<InvoiceIcon />}
                    onClick={() => setSelectedInvoiceOrder(order)}
                  >
                    Invoice
                  </Button>
                </Box>
              </Box>

              <Divider />

              {/* Order Stepper */}
              <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Real-time Fulfillment Timeline:
                </Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ overflowX: 'auto', py: 1 }}>
                  {ORDER_STEPS.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Timeline Notes Log */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                    Activity Log History:
                  </Typography>
                  {order.timeline.map((t, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {t.status}: {t.note}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider />

              {/* Items Table */}
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Items in Package:
                </Typography>

                <Table size="small">
                  <TableBody>
                    {order.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ pl: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={item.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {item.productName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Seller: {item.seller}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {item.quantity} x ₹{item.price}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, pr: 0 }}>
                          ₹{item.price * item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                    Total: ₹{order.totalAmount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Modals */}
      <InvoiceModal
        open={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />

      <MapModal
        open={Boolean(selectedMapOrder)}
        onClose={() => setSelectedMapOrder(null)}
        orderId={selectedMapOrder?.id}
        customerName={selectedMapOrder?.customerName}
        customerPhone={selectedMapOrder?.customerPhone}
        customerAddress={selectedMapOrder ? `${selectedMapOrder.address.street}, ${selectedMapOrder.address.city}` : undefined}
      />
    </Box>
  );
};
