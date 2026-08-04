import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Divider,
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
} from '@mui/material';
import {
  Agriculture as FarmerIcon,
  Add as AddIcon,
  TrendingUp as EarningsIcon,
  Inventory2 as StockIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

export const FarmerDashboard: React.FC = () => {
  const { db, addProduct, currentUser } = useApp();
  const [openAddModal, setOpenAddModal] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Leafy Greens' | 'Root Vegetables' | 'Gourds & Squashes' | 'Pods & Beans' | 'Exotic & Special' | 'Spices & Herbs'>('Root Vegetables');
  const [price, setPrice] = useState(45);
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState('500g');
  const [region, setRegion] = useState('Wayanad');
  const [harvestTime, setHarvestTime] = useState('Harvested Today 6 AM');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1598170845058-12ef4a45753b?w=500&auto=format&fit=crop&q=80');

  const farmerProducts = db.products.filter(
    (p) => p.sellerId === currentUser.id || p.seller.includes('Ramesh') || p.sellerRole === 'Farmer'
  );

  const totalEarnings = farmerProducts.reduce((sum, p) => sum + p.price * p.quantity * 0.8, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
      unit,
      seller: currentUser.name,
      sellerId: currentUser.id,
      sellerRole: 'Farmer',
      organicVerified: true,
      region,
      harvestTime,
      description: description || 'Fresh organic produce directly from Wayanad hillside farm.',
      image,
    });

    setOpenAddModal(false);
    setName('');
    alert('🌾 Harvest batch listed successfully! Available in central marketplace.');
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FarmerIcon color="primary" fontSize="large" />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Organic Farmer Management Desk
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Logged in as <strong>{currentUser.name}</strong> • Wayanad Farm Hub #FAR-109
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
          sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}
        >
          List New Harvest Crop
        </Button>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#E8F5E9' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              TOTAL CROP SALES EARNINGS
            </Typography>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800, my: 0.5 }}>
              ₹{Math.round(totalEarnings)}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
              +18.4% from last week harvest
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              ACTIVE LISTED PRODUCE BATCHES
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5 }}>
              {farmerProducts.length} Batches
            </Typography>
            <Typography variant="caption" color="text.secondary">
              All 100% Organic Verified
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              TOTAL QUANTITY IN STOCK
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5 }}>
              {farmerProducts.reduce((acc, p) => acc + p.quantity, 0)} Units
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Available for outlet distribution
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              FARMER QUALITY RATING
            </Typography>
            <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 800, my: 0.5 }}>
              4.9 / 5.0
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Based on 142 customer reviews
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Harvest Inventory Table */}
      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Harvested Inventory & Listed Batches
          </Typography>
          <Chip label="Live Synchronization" color="primary" size="small" />
        </Box>
        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.paper' }}>
                <TableCell sx={{ fontWeight: 700 }}>Crop Produce</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Price / Unit</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Stock Qty</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Harvest Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {farmerProducts.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={prod.image} variant="rounded" sx={{ width: 44, height: 44 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {prod.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Region: {prod.region}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={prod.category} size="small" />
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
                    <Typography variant="caption" color="text.secondary">
                      {prod.harvestTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip icon={<VerifiedIcon />} label="Organic Verified" color="success" size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal to add harvest */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>List Fresh Harvest Produce</DialogTitle>
        <Divider />
        <form onSubmit={handleAddSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                required
                label="Produce Name"
                placeholder="e.g. Wayanad Organic Carrots"
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
                    <MenuItem value="Root Vegetables">Root Vegetables</MenuItem>
                    <MenuItem value="Gourds & Squashes">Gourds & Squashes</MenuItem>
                    <MenuItem value="Pods & Beans">Pods & Beans</MenuItem>
                    <MenuItem value="Exotic & Special">Exotic & Special</MenuItem>
                    <MenuItem value="Spices & Herbs">Spices & Herbs</MenuItem>
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
                    label="Stock Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Unit (e.g. 1 kg, 500g, Bunch)"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Harvest Timestamp / Time"
                value={harvestTime}
                onChange={(e) => setHarvestTime(e.target.value)}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Crop Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Publish Harvest to Market
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
