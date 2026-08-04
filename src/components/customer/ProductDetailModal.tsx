import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Rating,
  Grid,
  Divider,
  Paper,
  Avatar,
  TextField,
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Verified as VerifiedIcon,
  Agriculture as FarmerIcon,
  Yard as GardenIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, open, onClose }) => {
  const { addToCart, wishlist, toggleWishlist, db, addReview } = useApp();
  const [qty, setQty] = useState(1);
  const [newRating, setNewRating] = useState<number | null>(5);
  const [newComment, setNewComment] = useState('');

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const productReviews = db.reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    onClose();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview({
      productId: product.id,
      productName: product.name,
      orderId: 'ORD-DEMO',
      customerName: 'Akash K. Shankar',
      rating: newRating || 5,
      comment: newComment,
    });
    setNewComment('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: '#fff',
            zIndex: 10,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Grid container>
          {/* Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 260, md: '100%' },
                minHeight: { md: 400 },
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                {product.organicVerified && (
                  <Chip
                    icon={<VerifiedIcon sx={{ color: '#fff !important' }} />}
                    label="100% Organic Verified"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                )}
                <Chip
                  label={product.region}
                  icon={<LocationIcon sx={{ color: '#fff !important' }} />}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Details */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                {product.category}
              </Typography>
              <IconButton color="error" onClick={() => toggleWishlist(product.id)}>
                {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {product.rating}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({product.reviewsCount} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>
                ₹{product.price}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                / {product.unit}
              </Typography>
            </Box>

            <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {product.sellerRole === 'Farmer' ? (
                  <FarmerIcon color="primary" fontSize="small" />
                ) : (
                  <GardenIcon color="secondary" fontSize="small" />
                )}
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {product.seller}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {product.harvestTime}
                </Typography>
              </Box>
            </Paper>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {product.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Quantity */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Quantity:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                <Button
                  size="small"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  sx={{ minWidth: 36, px: 1 }}
                >
                  -
                </Button>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, px: 2 }}>
                  {qty}
                </Typography>
                <Button
                  size="small"
                  onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
                  sx={{ minWidth: 36, px: 1 }}
                >
                  +
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                ({product.quantity} units available)
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              startIcon={<CartIcon />}
              onClick={handleAddToCart}
              sx={{ borderRadius: 3, py: 1.5 }}
            >
              Add {qty} to Cart • ₹{product.price * qty}
            </Button>
          </Grid>
        </Grid>

        <Divider />

        {/* Customer Reviews Section */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Customer Reviews & Ratings ({productReviews.length})
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Leave a Review for this Produce:
            </Typography>
            <form onSubmit={handleReviewSubmit}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="caption">Rating:</Typography>
                <Rating
                  value={newRating}
                  onChange={(_, val) => setNewRating(val)}
                  size="small"
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write your review on freshness, taste, or packaging..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                size="small"
                sx={{ mb: 1.5 }}
              />
              <Button type="submit" variant="outlined" size="small" color="primary">
                Submit Review
              </Button>
            </form>
          </Paper>

          {productReviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No customer reviews yet. Be the first to leave feedback!
            </Typography>
          ) : (
            productReviews.map((rev) => (
              <Box key={rev.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                    {rev.customerName[0]}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {rev.customerName}
                  </Typography>
                  <Rating value={rev.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {rev.timestamp}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 4.5 }}>
                  {rev.comment}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
