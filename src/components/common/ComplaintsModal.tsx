import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  MenuItem,
  Box,
  Divider,
} from '@mui/material';
import { useApp } from '../../context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ComplaintsModal: React.FC<Props> = ({ open, onClose }) => {
  const { addComplaint, currentUser } = useApp();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Produce Quality' | 'Late Delivery' | 'Billing / Refund' | 'Partner Misbehavior'>('Produce Quality');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    addComplaint({
      userId: currentUser.id,
      priority: 'High',
      subject: `[${category}] ${subject}`,
      description,
      userName: currentUser.name,
      userRole: currentUser.role,
    });

    setSubject('');
    setDescription('');
    onClose();
    alert('✅ Complaint ticket submitted to Admin Desk. You will receive an update shortly.');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Raise Support Complaint / Quality Issue</DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Report any damaged produce, delivery delays, or billing discrepancies directly to Kozhikode Admin.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Complaint Issue Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <MenuItem value="Produce Quality">Produce Quality (Damaged / Stale)</MenuItem>
              <MenuItem value="Late Delivery">Late Delivery / Wrong Address</MenuItem>
              <MenuItem value="Billing / Refund">Billing / Payment Refund Request</MenuItem>
              <MenuItem value="Partner Misbehavior">Delivery Partner Issue</MenuItem>
            </TextField>

            <TextField
              fullWidth
              required
              label="Subject Brief"
              placeholder="e.g. Carrots were damaged during transit"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Detailed Explanation"
              placeholder="Describe the issue and mention Order ID if applicable..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="error">
            Submit Ticket
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
