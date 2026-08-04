import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Storefront as OutletIcon,
  Check as CheckIcon,
  LocalShipping as DeliveryIcon,
  Inventory as PackIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const OutletDashboard: React.FC = () => {
  const { db, updateOrderStatus, currentUser } = useApp();

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = currentStatus;
    if (currentStatus === 'Pending') nextStatus = 'Outlet Accepted';
    else if (currentStatus === 'Outlet Accepted') nextStatus = 'Packing';
    else if (currentStatus === 'Packing') nextStatus = 'Ready';
    else if (currentStatus === 'Ready') nextStatus = 'Assigned';
    else if (currentStatus === 'Assigned') nextStatus = 'Out for Delivery';
    else if (currentStatus === 'Out for Delivery') nextStatus = 'Delivered';

    updateOrderStatus(orderId, nextStatus, `Updated by Outlet Manager (${currentUser.name})`);
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <OutletIcon color="warning" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Community Fulfillment Outlet Desk
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Outlet: <strong>Kozhikode Central Outlet #OUT-1</strong> • Order Dispatch & Packing Queue
        </Typography>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#FFF3E0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              INCOMING PENDING ORDERS
            </Typography>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 800, my: 0.5 }}>
              {db.orders.filter((o) => o.status === 'Pending').length} Orders
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Requires Outlet Acceptance
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              PACKING & READY QUEUE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5 }}>
              {db.orders.filter((o) => ['Outlet Accepted', 'Packing', 'Ready'].includes(o.status)).length} Orders
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Preparing organic produce packages
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#E8F5E9' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              DISPATCHED TODAY
            </Typography>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 800, my: 0.5 }}>
              {db.orders.filter((o) => ['Out for Delivery', 'Delivered'].includes(o.status)).length} Orders
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Handed over to delivery partners
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Orders Processing Queue Table */}
      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Live Fulfillment Dispatch Queue
          </Typography>
          <Chip label="Real-time Synchronization" color="warning" size="small" />
        </Box>
        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Order & Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items Count</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total (₹)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Current Stage</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {db.orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    No orders in queue. Place an order as Customer to test!
                  </TableCell>
                </TableRow>
              ) : (
                db.orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        #{o.id} ({o.invoiceNumber})
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Customer: {o.customerName} ({o.customerPhone})
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Address: {o.address.street}, {o.address.city}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {o.items.length} items ({o.items.reduce((sum, i) => sum + i.quantity, 0)} units)
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>
                      ₹{o.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${o.paymentMethod} (${o.paymentStatus})`}
                        size="small"
                        color={o.paymentStatus === 'Paid' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={o.status}
                        size="small"
                        color={o.status === 'Delivered' ? 'success' : 'primary'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {o.status !== 'Delivered' && (
                        <Button
                          variant="contained"
                          size="small"
                          color={o.status === 'Pending' ? 'primary' : 'success'}
                          onClick={() => handleAdvanceStatus(o.id, o.status)}
                          sx={{ borderRadius: 2 }}
                        >
                          {o.status === 'Pending'
                            ? 'Accept Order'
                            : o.status === 'Outlet Accepted'
                            ? 'Start Packing'
                            : o.status === 'Packing'
                            ? 'Mark Package Ready'
                            : o.status === 'Ready'
                            ? 'Assign Delivery'
                            : o.status === 'Assigned'
                            ? 'Handover to Rider'
                            : 'Mark Delivered'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
