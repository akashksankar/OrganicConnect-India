import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  NotificationsActive as NotifIcon,
  CheckCircle as DoneIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ open, onClose }) => {
  const {
    db,
    markNotificationAsRead,
    clearAllNotifications,
    unreadNotificationCount,
  } = useApp();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 300, sm: 380 }, p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotifIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Live System Activity
            </Typography>
            {unreadNotificationCount > 0 && (
              <Chip label={unreadNotificationCount} color="error" size="small" />
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Notifications List */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
          {db.notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body2" color="text.secondary">
                No notifications logged yet.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {db.notifications.map((n) => (
                <ListItem
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: n.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: n.read ? 'action.disabled' : 'primary.main' }}>
                      <NotifIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: n.read ? 500 : 700, fontSize: '0.9rem' }}>
                        {n.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {n.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {n.timestamp}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {db.notifications.length > 0 && (
          <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<DoneIcon />}
              onClick={clearAllNotifications}
            >
              Clear All Logs
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
