import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Forum as ForumIcon,
  ThumbUp as LikeIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

export const CommunityForum: React.FC = () => {
  const { db, addCommunityPost, likeCommunityPost, currentUser } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('OrganicFarming, KitchenGarden');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addCommunityPost({
      authorName: currentUser.name,
      authorRole: currentUser.role,
      title,
      content,
      category: 'Organic Farming',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setTitle('');
    setContent('');
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ForumIcon color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Organic Farming & Garden Community Hub
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Share composting tips, pest management advice, and Wayanad organic farming techniques.
        </Typography>
      </Box>

      {/* Post Creator Box */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Share a Tip, Question, or Organic Harvest Photo
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              required
              size="small"
              label="Discussion Title"
              placeholder="e.g. Natural neem oil spray recipe for Terrace Garden aphid control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
              fullWidth
              required
              multiline
              rows={3}
              label="Detailed Post Content"
              placeholder="Explain your organic farming methodology or ask a question to Wayanad farmers..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                size="small"
                label="Tags (Comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                sx={{ width: 300 }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2.5, px: 3 }}
              >
                Post to Forum
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Posts List */}
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Recent Discussions & Knowledge Base ({db.communityPosts?.length || 0})
      </Typography>

      {(db.communityPosts || []).map((post) => (
        <Card key={post.id} sx={{ mb: 3, borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                {post.authorName[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {post.authorName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={post.authorRole} size="small" variant="outlined" color="primary" />
                  <Typography variant="caption" color="text.secondary">
                    {post.timestamp}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {post.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {post.content}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {(post.tags || []).map((t) => (
                <Chip key={t} label={`#${t}`} size="small" color="secondary" />
              ))}
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                size="small"
                startIcon={<LikeIcon />}
                onClick={() => likeCommunityPost(post.id)}
                color="primary"
              >
                Upvote ({post.likes})
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
