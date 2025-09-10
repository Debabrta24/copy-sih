import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Flag, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ForumPost as ForumPostType, ForumReply } from "@/types";

interface ForumPostProps {
  post: ForumPostType & { replies?: ForumReply[] };
}

export default function ForumPost({ post }: ForumPostProps) {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const likeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/forum/posts/${post.id}/like`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", `/api/forum/posts/${post.id}/replies`, {
        userId: currentUser?.id,
        content,
        isAnonymous: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setReplyContent("");
      setShowReplyForm(false);
      setShowReplies(true);
      toast({
        title: "Reply posted",
        description: "Your reply has been submitted for moderation.",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    },
  });

  const flagMutation = useMutation({
    mutationFn: async () => {
      // This would typically flag the post for moderation
      return await apiRequest("POST", `/api/forum/posts/${post.id}/flag`, {});
    },
    onSuccess: () => {
      toast({
        title: "Post reported",
        description: "Thank you for reporting. Our moderators will review this post.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to report post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply before submitting.",
        variant: "destructive",
      });
      return;
    }
    replyMutation.mutate(replyContent);
  };

  const handleFlag = () => {
    if (window.confirm("Are you sure you want to report this post? This action will notify our moderators.")) {
      flagMutation.mutate();
    }
  };

  const generatePseudonym = (userId: string, index: number = 0) => {
    // Generate a consistent pseudonym based on user ID
    const prefixes = ["Anonymous", "Quiet", "Thoughtful", "Caring", "Support"];
    const suffixes = ["Student", "Seeker", "Helper", "Friend", "Voice"];
    const hash = userId.charCodeAt(0) + index;
    const prefix = prefixes[hash % prefixes.length];
    const suffix = suffixes[(hash + 1) % suffixes.length];
    const number = (hash % 999) + 1;
    return `${prefix}${suffix}_${number}`;
  };

  const getTimestamp = (date: Date | string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    
    return postDate.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Exam Stress": "bg-accent/20 text-accent",
      "Social Anxiety": "bg-primary/20 text-primary", 
      "Depression Support": "bg-chart-4/20 text-chart-4",
      "Study Motivation": "bg-secondary/20 text-secondary",
      "General Support": "bg-muted text-muted-foreground",
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const replyCount = post.replies?.length || 0;

  return (
    <Card data-testid={`post-${post.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium text-sm">
                {generatePseudonym(post.userId).substring(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-medium text-card-foreground">
                {generatePseudonym(post.userId)}
              </p>
              <p className="text-xs text-muted-foreground">
                {getTimestamp(post.createdAt)} • College Student
              </p>
            </div>
          </div>
          <Badge className={`${getCategoryColor(post.category)} text-xs font-medium`}>
            {post.category}
          </Badge>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-card-foreground mb-2">{post.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid={`button-like-${post.id}`}
            >
              <Heart className="h-4 w-4 mr-1" />
              {post.likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid={`button-replies-${post.id}`}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              {showReplies ? (
                <ChevronUp className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFlag}
            disabled={flagMutation.isPending}
            className="text-muted-foreground hover:text-destructive transition-colors"
            data-testid={`button-flag-${post.id}`}
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        {/* Replies Section */}
        {showReplies && (
          <div className="mt-6 space-y-4">
            {/* Reply Form */}
            <div className="border-l-4 border-primary/20 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-medium text-xs">
                    {generatePseudonym(currentUser?.id || "").substring(0, 1)}
                  </span>
                </div>
                <span className="text-sm font-medium text-card-foreground">
                  {generatePseudonym(currentUser?.id || "")}
                </span>
              </div>
              
              {showReplyForm ? (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your supportive response..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    data-testid={`textarea-reply-${post.id}`}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={replyMutation.isPending}
                      data-testid={`button-submit-reply-${post.id}`}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      {replyMutation.isPending ? "Posting..." : "Reply"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowReplyForm(true)}
                  data-testid={`button-show-reply-form-${post.id}`}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Write a reply
                </Button>
              )}
            </div>

            {/* Existing Replies */}
            {post.replies && post.replies.length > 0 && (
              <div className="space-y-3">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="ml-6 p-4 bg-muted/30 rounded-lg border-l-4 border-secondary">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-secondary-foreground font-medium text-xs">
                          {generatePseudonym(reply.userId).substring(0, 1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {generatePseudonym(reply.userId)} • {getTimestamp(reply.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {reply.content}
                    </p>
                    
                    {reply.likes > 0 && (
                      <div className="flex items-center mt-2">
                        <Heart className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">{reply.likes}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
