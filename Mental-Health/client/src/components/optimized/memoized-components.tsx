import { memo, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Memoized Card Component for Better Performance
export const MemoizedCard = memo<{
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}>(({ title, children, className, headerAction }) => {
  return (
    <Card className={className}>
      {title && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {headerAction}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
});

MemoizedCard.displayName = "MemoizedCard";

// Memoized Activity Item for Dashboard
export const MemoizedActivityItem = memo<{
  id: string;
  title: string;
  timestamp: string;
  result?: string;
  duration?: string;
  type: "screening" | "chat" | "appointment";
  onClick?: () => void;
}>(({ id, title, timestamp, result, duration, type, onClick }) => {
  const typeColors = useMemo(() => ({
    screening: "bg-secondary/10 text-secondary",
    chat: "bg-primary/10 text-primary", 
    appointment: "bg-accent/10 text-accent",
  }), []);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={handleClick}
      data-testid={`activity-item-${id}`}
    >
      <div className="flex items-center space-x-3">
        <div className={cn("w-2 h-2 rounded-full", typeColors[type])} />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{timestamp}</p>
        </div>
      </div>
      <div className="text-right">
        {result && (
          <Badge variant="outline" className="text-xs">
            {result}
          </Badge>
        )}
        {duration && (
          <p className="text-xs text-muted-foreground mt-1">{duration}</p>
        )}
      </div>
    </div>
  );
});

MemoizedActivityItem.displayName = "MemoizedActivityItem";

// Memoized Quick Action Button
export const MemoizedQuickAction = memo<{
  icon: any;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}>(({ icon: IconComponent, title, description, color, onClick, disabled = false }) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [onClick, disabled]);

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full h-auto p-6 flex flex-col items-center space-y-2 text-center transition-all hover:scale-105",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
      disabled={disabled}
      data-testid={`quick-action-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", color)}>
        <IconComponent className="h-6 w-6" />
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground leading-tight">{description}</p>
      </div>
    </Button>
  );
});

MemoizedQuickAction.displayName = "MemoizedQuickAction";

// Memoized Resource Item
export const MemoizedResourceItem = memo<{
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  onView: (id: string) => void;
  onBookmark: (id: string) => void;
  onDownload?: (id: string) => void;
  isBookmarked?: boolean;
}>(({ id, title, description, category, tags, onView, onBookmark, onDownload, isBookmarked = false }) => {
  const handleView = useCallback(() => onView(id), [onView, id]);
  const handleBookmark = useCallback(() => onBookmark(id), [onBookmark, id]);
  const handleDownload = useCallback(() => onDownload?.(id), [onDownload, id]);

  const memoizedTags = useMemo(() => 
    tags.slice(0, 3).map(tag => (
      <Badge key={tag} variant="secondary" className="text-xs">
        {tag}
      </Badge>
    )), [tags]
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(
                  "h-6 w-6 p-0",
                  isBookmarked && "text-yellow-500"
                )}
                data-testid={`bookmark-${id}`}
              >
                ★
              </Button>
            </div>
            <h3 className="font-medium text-sm leading-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {memoizedTags}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="text-xs"
              data-testid={`view-${id}`}
            >
              View
            </Button>
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-xs"
                data-testid={`download-${id}`}
              >
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MemoizedResourceItem.displayName = "MemoizedResourceItem";

// Memoized Community Post
export const MemoizedCommunityPost = memo<{
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  onLike: (id: string) => void;
  onReply: (id: string) => void;
  onView: (id: string) => void;
}>(({ id, title, content, author, category, timestamp, likes, replies, isLiked, onLike, onReply, onView }) => {
  const handleLike = useCallback(() => onLike(id), [onLike, id]);
  const handleReply = useCallback(() => onReply(id), [onReply, id]);
  const handleView = useCallback(() => onView(id), [onView, id]);

  const truncatedContent = useMemo(() => 
    content.length > 150 ? content.substring(0, 150) + "..." : content
  , [content]);

  return (
    <Card className="hover:shadow-sm transition-shadow cursor-pointer" onClick={handleView}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
              <span className="text-xs text-muted-foreground">{timestamp}</span>
            </div>
            <h3 className="font-medium text-sm leading-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{truncatedContent}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>by {author}</span>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={cn(
                  "h-6 px-2 text-xs",
                  isLiked && "text-red-500"
                )}
                data-testid={`like-${id}`}
              >
                ♥ {likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReply();
                }}
                className="h-6 px-2 text-xs"
                data-testid={`reply-${id}`}
              >
                💬 {replies}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MemoizedCommunityPost.displayName = "MemoizedCommunityPost";