import React, { useState } from 'react';
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
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Yard as GardenIcon,
  Add as AddIcon,
  Storefront as MarketplaceIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

export const HomeGardenDashboard: React.FC = () => {
  const { db, addProduct, currentUser } = useApp();
  const [openAddModal, setOpenAddModal] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Leafy Greens' | 'Root Vegetables' | 'Gourds & Squashes' | 'Pods & Beans' | 'Exotic & Special' | 'Spices & Herbs'>('Leafy Greens');
  const [price, setPrice] = useState(25);
  const [quantity, setQuantity] = useState(15);
  const [unit, setUnit] = useState('Bunch');

  const gardenProducts = db.products.filter(
    (p) => p.sellerRole === 'Home Garden Seller' || p.seller.includes('Anjali')
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
      unit,
      seller: currentUser.name || 'Anjali M. (Terrace Garden)',
      sellerId: currentUser.id,
      sellerRole: 'Home Garden Seller',
      organicVerified: true,
      region: 'Kozhikode',
      harvestTime: 'Harvested 1 Hour Ago (Terrace Garden)',
      description: 'Micro-harvest zero-pesticide fresh produce grown organically on home terrace.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    });

    setOpenAddModal(false);
    setName('');
    alert('🌱 Terrace Garden micro-batch published successfully!');
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GardenIcon color="secondary" fontSize="large" />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Terrace Home Garden Micro-Seller Desk
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Sell surplus fresh harvests from urban balcony & rooftop gardens in Kozhikode.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
          sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}
        >
          List Terrace Garden Surplus
        </Button>
      </Box>

      <Alert severity="success" sx={{ mb: 4 }}>
        <strong>Urban Agriculture Micro-Market:</strong> Home gardeners earn secondary income by listing small batches (10-20 units) of fresh spinach, curry leaves, and cherry tomatoes harvested daily.
      </Alert>

      {/* Garden Produce Table */}
      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Active Terrace Micro-Inventory
          </Typography>
          <Chip label={`${gardenProducts.length} Items Listed`} color="secondary" size="small" />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Terrace Harvest</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Available Qty</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Freshness Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gardenProducts.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={prod.image} variant="rounded" sx={{ width: 44, height: 44 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {prod.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Seller: {prod.seller}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={prod.category} size="small" variant="outlined" color="secondary" />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    ₹{prod.price} / {prod.unit}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {prod.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                      {prod.harvestTime}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>List Surplus Rooftop Produce</DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                required
                label="Produce Name"
                placeholder="e.g. Organic Terrace Mint & Coriander"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <MenuItem value="Leafy Greens">Leafy Greens</MenuItem>
                    <MenuItem value="Spices & Herbs">Spices & Herbs</MenuItem>
                    <MenuItem value="Root Vegetables">Root Vegetables</MenuItem>
                    <MenuItem value="Exotic & Special">Exotic & Special</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Price (₹)"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Quantity Available"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Unit (Bunch / 250g)"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="secondary">
              List Terrace Produce
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
