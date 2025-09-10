import { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertTriangle, Heart, MessageCircle, Calendar, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: "appointment" | "screening" | "chat" | "crisis" | "community" | "system";
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  timestamp: string;
  actionUrl?: string;
  actionText?: string;
}

const notificationIcons = {
  appointment: Calendar,
  screening: Heart,
  chat: MessageCircle,
  crisis: AlertTriangle,
  community: MessageCircle,
  system: Bell,
};

const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500", 
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications", currentUser?.id],
    enabled: !!currentUser?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("PATCH", `/api/notifications/mark-all-read`, {
        userId: currentUser?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "All notifications marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    },
  });

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiRequest("DELETE", `/api/notifications/${notificationId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    },
  });

  // Filter notifications by type
  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    return notifications.filter((n: Notification) => n.type === type);
  };

  // Count unread notifications
  const unreadCount = (notifications as Notification[]).filter((n: Notification) => !n.isRead).length;
  const urgentCount = (notifications as Notification[]).filter((n: Notification) => 
    !n.isRead && (n.priority === "urgent" || n.priority === "high")
  ).length;

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  // Group notifications by type for tabs
  const notificationCounts = {
    all: (notifications as Notification[]).length,
    appointment: (notifications as Notification[]).filter((n: Notification) => n.type === "appointment").length,
    screening: (notifications as Notification[]).filter((n: Notification) => n.type === "screening").length,
    crisis: (notifications as Notification[]).filter((n: Notification) => n.type === "crisis").length,
    community: (notifications as Notification[]).filter((n: Notification) => n.type === "community").length,
    system: (notifications as Notification[]).filter((n: Notification) => n.type === "system").length,
  };

  // Mock notifications for development (replace with real API data)
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "appointment",
      title: "Upcoming Counseling Session",
      message: "Your counseling session is scheduled for tomorrow at 2:00 PM",
      isRead: false,
      priority: "high",
      timestamp: "2024-01-15T14:00:00Z",
      actionUrl: "/appointments",
      actionText: "View Details"
    },
    {
      id: "2", 
      type: "screening",
      title: "Screening Reminder",
      message: "It's been 2 weeks since your last mental health screening",
      isRead: false,
      priority: "medium",
      timestamp: "2024-01-14T10:00:00Z",
      actionUrl: "/screening",
      actionText: "Take Screening"
    },
    {
      id: "3",
      type: "community",
      title: "New Reply to Your Post",
      message: "Someone replied to your post in the Stress Management forum",
      isRead: true,
      priority: "low",
      timestamp: "2024-01-13T16:30:00Z",
      actionUrl: "/community",
      actionText: "View Post"
    },
    {
      id: "4",
      type: "crisis",
      title: "Crisis Resources Available",
      message: "If you're experiencing a mental health crisis, immediate help is available",
      isRead: false,
      priority: "urgent",
      timestamp: "2024-01-12T08:00:00Z",
      actionUrl: "/crisis",
      actionText: "Get Help Now"
    }
  ];

  const displayNotifications = (notifications as Notification[]).length > 0 ? (notifications as Notification[]) : mockNotifications;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs",
                urgentCount > 0 ? "animate-pulse" : ""
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end" data-testid="notification-panel">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsReadMutation.mutate()}
                    className="text-xs h-6 px-2"
                    data-testid="button-mark-all-read"
                  >
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="all" className="text-xs" data-testid="tab-all-notifications">
                  All {notificationCounts.all > 0 && `(${notificationCounts.all})`}
                </TabsTrigger>
                <TabsTrigger value="urgent" className="text-xs" data-testid="tab-urgent-notifications">
                  Urgent {urgentCount > 0 && `(${urgentCount})`}
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs" data-testid="tab-unread-notifications">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <ScrollArea className="h-[300px]">
                  {displayNotifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {displayNotifications.map((notification: Notification) => {
                        const IconComponent = notificationIcons[notification.type];
                        return (
                          <div
                            key={notification.id}
                            className={cn(
                              "p-3 hover:bg-muted cursor-pointer transition-colors border-l-2",
                              !notification.isRead ? "bg-muted/50" : "",
                              priorityColors[notification.priority]
                            )}
                            onClick={() => handleNotificationClick(notification)}
                            data-testid={`notification-${notification.id}`}
                          >
                            <div className="flex items-start space-x-3">
                              <IconComponent className={cn(
                                "h-4 w-4 mt-0.5 flex-shrink-0",
                                notification.priority === "urgent" ? "text-destructive" : "text-muted-foreground"
                              )} />
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className={cn(
                                    "text-sm font-medium",
                                    !notification.isRead && "font-semibold"
                                  )}>
                                    {notification.title}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotificationMutation.mutate(notification.id);
                                    }}
                                    data-testid={`delete-notification-${notification.id}`}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(notification.timestamp).toLocaleDateString()}
                                  </p>
                                  {notification.actionText && (
                                    <span className="text-xs text-primary">
                                      {notification.actionText}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="urgent" className="mt-0">
                <ScrollArea className="h-[300px]">
                  {displayNotifications.filter((n: Notification) => 
                    n.priority === "urgent" || n.priority === "high"
                  ).length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm">No urgent notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {displayNotifications
                        .filter((n: Notification) => n.priority === "urgent" || n.priority === "high")
                        .map((notification: Notification) => {
                          const IconComponent = notificationIcons[notification.type];
                          return (
                            <div
                              key={notification.id}
                              className={cn(
                                "p-3 hover:bg-muted cursor-pointer transition-colors border-l-2",
                                !notification.isRead ? "bg-muted/50" : "",
                                priorityColors[notification.priority]
                              )}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start space-x-3">
                                <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0 text-destructive" />
                                <div className="flex-1 space-y-1">
                                  <p className="text-sm font-semibold">{notification.title}</p>
                                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(notification.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="unread" className="mt-0">
                <ScrollArea className="h-[300px]">
                  {displayNotifications.filter((n: Notification) => !n.isRead).length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm">All caught up!</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {displayNotifications
                        .filter((n: Notification) => !n.isRead)
                        .map((notification: Notification) => {
                          const IconComponent = notificationIcons[notification.type];
                          return (
                            <div
                              key={notification.id}
                              className={cn(
                                "p-3 hover:bg-muted cursor-pointer transition-colors border-l-2 bg-muted/50",
                                priorityColors[notification.priority]
                              )}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start space-x-3">
                                <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 space-y-1">
                                  <p className="text-sm font-semibold">{notification.title}</p>
                                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(notification.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}