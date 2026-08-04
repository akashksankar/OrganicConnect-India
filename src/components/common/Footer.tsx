import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';
import { LocalFlorist as FloristIcon } from '@mui/icons-material';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ bgcolor: 'primary.main', color: '#fff', p: 0.5, borderRadius: 1.5 }}>
                <FloristIcon />
              </Box>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                OrganicConnect India
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Community Organic Farmers & Home Garden Marketplace Prototype. Built for MCA Academic Demonstration.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Fulfillment Outlets
            </Typography>
            <Typography variant="body2" color="text.secondary">Kozhikode Central</Typography>
            <Typography variant="body2" color="text.secondary">Wayanad Farm Desk</Typography>
            <Typography variant="body2" color="text.secondary">Palakkad Agriculture Hub</Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Simulated Services
            </Typography>
            <Typography variant="body2" color="text.secondary">2-Hour Doorstep Express</Typography>
            <Typography variant="body2" color="text.secondary">100% Organic Certificate</Typography>
            <Typography variant="body2" color="text.secondary">UPI & COD Simulator</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              MCA Project Specs
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              • Zero External Database (localStorage cache)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              • Multi-Persona Role Switcher
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              • Interactive Recharts & Maps
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary">
            © 2026 OrganicConnect India • MCA Master Project Prototype
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Offline Cache Persistence Enabled
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
