import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Heart, MessageCircle, Share } from 'lucide-react';

const mockPosts = [
  {
    id: 1,
    user: 'Emma Wilson',
    location: 'Eiffel Tower, Paris',
    time: '2 hours ago',
    content: 'Amazing sunset view from the Eiffel Tower! The city lights are incredible.',
    likes: 24,
    comments: 8,
    image: true
  },
  {
    id: 2,
    user: 'John Smith',
    location: 'Louvre Museum, Paris',
    time: '4 hours ago',
    content: 'Just saw the Mona Lisa! The museum is packed but totally worth it. Pro tip: book your tickets online.',
    likes: 15,
    comments: 3,
    image: false
  },
  {
    id: 3,
    user: 'Lisa Brown',
    location: 'Montmartre District',
    time: '6 hours ago',
    content: 'Street artists in Montmartre are incredible! Got my portrait done - such a unique experience.',
    likes: 31,
    comments: 12,
    image: true
  }
];

export const TravelFeed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    location: ''
  });

  const handleCreatePost = () => {
    if (newPost.content.trim()) {
      // Mock creating post
      console.log('Creating post:', newPost);
      setNewPost({ content: '', location: '' });
      setShowCreatePost(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Travel Feed</h2>
        <Button 
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Share Journey
        </Button>
      </div>

      {/* Create Post Form */}
      {showCreatePost && (
        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's your travel story?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
            <Input
              placeholder="Location (optional)"
              value={newPost.location}
              onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreatePost}>Post</Button>
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {mockPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{post.user}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
                <Badge variant="outline">Tourist</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{post.content}</p>
              
              {post.image && (
                <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Travel Photo</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};