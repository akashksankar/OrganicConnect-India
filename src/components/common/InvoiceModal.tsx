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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  LocalFlorist as FloristIcon,
  QrCode2 as QrCodeIcon,
} from '@mui/icons-material';
import { Order } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export const InvoiceModal: React.FC<Props> = ({ open, onClose, order }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Invoice Number', 'Order ID', 'Customer Name', 'Phone', 'Date', 'Payment Method', 'Payment Status', 'Total Amount'],
      [
        order.invoiceNumber,
        order.id,
        `"${order.customerName}"`,
        order.customerPhone,
        new Date(order.createdAt).toLocaleDateString(),
        order.paymentMethod,
        order.paymentStatus,
        `₹${order.totalAmount}`,
      ],
      [],
      ['Item Name', 'Price/Unit', 'Quantity', 'Seller', 'Total'],
      ...order.items.map((i) => [
        `"${i.productName}"`,
        `₹${i.price}/${i.unit}`,
        i.quantity,
        `"${i.seller}"`,
        `₹${i.price * i.quantity}`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Invoice_${order.invoiceNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Tax Invoice / Bill ({order.invoiceNumber})
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent id="printable-invoice" sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box sx={{ bgcolor: 'primary.main', color: '#fff', p: 0.5, borderRadius: 1 }}>
                <FloristIcon />
              </Box>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                OrganicConnect India
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Community Organic Farmers & Outlets Network
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              GSTIN: 32AABCO1234F1Z0 • Kozhikode Central Outlet
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={order.paymentStatus === 'Paid' ? 'PAID INVOICE' : 'COD PENDING'}
              color={order.paymentStatus === 'Paid' ? 'success' : 'warning'}
              sx={{ fontWeight: 800, mb: 1 }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Invoice #: {order.invoiceNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Order ID: {order.id}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Date: {new Date(order.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Customer & Address Details */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
              Billed To (Customer):
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {order.customerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {order.customerPhone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.address.street}, {order.address.city} - {order.address.pincode}
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
              Payment Mode:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {order.paymentMethod}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Fulfilled by: {order.outletName}
            </Typography>
          </Box>
        </Box>

        {/* Items Table */}
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Vegetable / Produce</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Seller Source</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Unit Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Qty</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.productName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.unit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {item.seller}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">₹{item.price}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    ₹{item.price * item.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Calculation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCodeIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Scan QR code to verify 100% Organic Certificate & Traceability Log
            </Typography>
          </Box>

          <Box sx={{ minWidth: 240, textAlign: 'right' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{order.subtotal}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Eco Delivery Fee:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{order.deliveryFee}</Typography>
            </Box>
            {order.discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="success.main">Coupon Discount:</Typography>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>-₹{order.discount}</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Amount Paid:</Typography>
              <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 800 }}>
                ₹{order.totalAmount}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button startIcon={<DownloadIcon />} variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
        <Button startIcon={<PrintIcon />} variant="contained" color="primary" onClick={handlePrint}>
          Print / Save PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};
