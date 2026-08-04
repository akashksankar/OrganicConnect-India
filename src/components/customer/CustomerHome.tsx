import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Rating,
  Paper,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Slider,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Verified as VerifiedIcon,
  LocalFlorist as FloristIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';

const CATEGORIES = [
  'All',
  'Leafy Greens',
  'Root Vegetables',
  'Gourds & Squashes',
  'Pods & Beans',
  'Exotic & Special',
  'Spices & Herbs',
];

const REGIONS = ['All Regions', 'Kozhikode', 'Wayanad', 'Palakkad', 'Thrissur'];

interface Props {
  onOpenSubscriptions: () => void;
}

export const CustomerHome: React.FC<Props> = ({ onOpenSubscriptions }) => {
  const { db, addToCart, wishlist, toggleWishlist, searchQuery } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return db.products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedRegion !== 'All Regions' && p.region !== selectedRegion) return false;
      if (organicOnly && !p.organicVerified) return false;
      if (p.price > maxPrice) return false;
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.seller.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(p.hindiName && p.hindiName.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });
  }, [db.products, selectedCategory, selectedRegion, organicOnly, maxPrice, searchQuery]);

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip
              icon={<FloristIcon sx={{ color: '#fff !important' }} />}
              label="Direct Farm & Home Garden Harvests"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.15 }}>
              Fresh Organic Vegetables Delivered in 2 Hours
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, maxWidth: 540 }}>
              Connecting Wayanad organic farmers & Kozhikode terrace growers directly to your kitchen. Zero chemical sprays, 100% traceably verified.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowIcon />}
                onClick={onOpenSubscriptions}
                sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}
              >
                Explore Weekly Subscription Boxes
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=80"
              alt="Organic Harvest Basket"
              sx={{
                width: '100%',
                maxHeight: 280,
                objectFit: 'cover',
                borderRadius: 4,
                boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Category Pills */}
      <Box sx={{ display: 'flex', gap: 1, overflow: 'auto', pb: 1, mb: 3, '&::-webkit-scrollbar': { display: 'none' } }}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={selectedCategory === cat ? 'primary' : 'default'}
            onClick={() => setSelectedCategory(cat)}
            sx={{ fontWeight: 700, px: 1, py: 2 }}
          />
        ))}
      </Box>

      {/* Live Filters Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Select Region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {REGIONS.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Box sx={{ px: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Max Price: ₹{maxPrice} / unit
              </Typography>
              <Slider
                value={maxPrice}
                min={10}
                max={150}
                onChange={(_, val) => setMaxPrice(val as number)}
                valueLabelDisplay="auto"
                color="primary"
                size="small"
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  color="success"
                />
              }
              label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Organic Certified Only</Typography>}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Showing <strong>{filteredProducts.length}</strong> fresh produce items
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Product Catalog Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((p) => {
          const isWishlisted = wishlist.includes(p.id);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={p.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: 180,
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onClick={() => setSelectedProduct(p)}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={p.image}
                    alt={p.name}
                    sx={{
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  />
                  {p.organicVerified && (
                    <Chip
                      icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: '14px !important' }} />}
                      label="Organic"
                      color="success"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        fontWeight: 700,
                        height: 22,
                        fontSize: '0.65rem',
                      }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'rgba(255,255,255,0.85)',
                      '&:hover': { bgcolor: '#fff' },
                    }}
                  >
                    {isWishlisted ? (
                      <FavoriteIcon color="error" fontSize="small" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                    {p.category} • {p.region}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    noWrap
                    sx={{ fontWeight: 700, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    onClick={() => setSelectedProduct(p)}
                  >
                    {p.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, my: 0.5 }}>
                    <Rating value={p.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {p.rating}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                    Seller: <strong>{p.seller}</strong>
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 1 }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                      ₹{p.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      / {p.unit}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<CartIcon />}
                    onClick={() => addToCart(p, 1)}
                    sx={{ borderRadius: 2.5 }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </Box>
  );
};
