import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
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
  AdminPanelSettings as AdminIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  ShoppingCart as OrderIcon,
  ReportProblem as ComplaintIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';

const COLORS = ['#2E7D32', '#388E3C', '#689F38', '#F57C00', '#0288D1', '#7B1FA2'];

export const AdminDashboard: React.FC = () => {
  const { db, resolveComplaint } = useApp();

  const totalRevenue = db.orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = db.orders.length;
  const totalUsersCount = db.users.length;
  const pendingComplaintsCount = db.complaints.filter((c) => c.status === 'Open').length;

  // Chart Data Preparation
  const salesByCategoryData = [
    { name: 'Leafy Greens', sales: 14200 },
    { name: 'Root Veggies', sales: 21800 },
    { name: 'Gourds', sales: 9400 },
    { name: 'Pods & Beans', sales: 11200 },
    { name: 'Spices & Herbs', sales: 6800 },
  ];

  const roleDistributionData = [
    { name: 'Customers', value: 8 },
    { name: 'Farmers', value: 3 },
    { name: 'Gardeners', value: 2 },
    { name: 'Outlet Managers', value: 2 },
    { name: 'Delivery Partners', value: 2 },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminIcon color="secondary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            System Administrator SaaS Dashboard
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          OrganicConnect India • Central Operational Analytics & Metrics
        </Typography>
      </Box>

      {/* Metric KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#E8F5E9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <MoneyIcon color="primary" />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                TOTAL SYSTEM REVENUE
              </Typography>
            </Box>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>
              ₹{totalRevenue}
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
              +24.5% month-on-month
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <OrderIcon color="secondary" />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                TOTAL ORDERS PROCESSED
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {totalOrdersCount} Orders
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Across Kozhikode Outlets
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PeopleIcon color="info" />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                REGISTERED USERS & STAKEHOLDERS
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {totalUsersCount} Personas
            </Typography>
            <Typography variant="caption" color="text.secondary">
              6 Role categories active
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#FFEBEE' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ComplaintIcon color="error" />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                OPEN SUPPORT TICKETS
              </Typography>
            </Box>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 800 }}>
              {pendingComplaintsCount} Tickets
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Quality & refund requests
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, height: 360 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              Sales Revenue by Produce Category (₹)
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
                <Bar dataKey="sales" fill="#2E7D32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, height: 360 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              Platform User Persona Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roleDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Complaints Desk Section */}
      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Quality Complaints & Refund Support Tickets Desk
          </Typography>
          <Chip label={`${db.complaints.length} Total Tickets`} color="secondary" size="small" />
        </Box>
        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Ticket Details</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Raised By</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {db.complaints.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {c.subject}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {c.userName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={c.userRole} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {c.timestamp}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.status}
                      color={c.status === 'Resolved' ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {c.status === 'Open' && (
                      <Chip
                        label="Resolve & Refund"
                        color="success"
                        clickable
                        onClick={() => resolveComplaint(c.id)}
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
