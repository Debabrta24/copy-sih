import { useState } from "react";
import { Coins, X, TrendingUp, Gift, Trophy, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { CoinTransaction } from "shared/schema";

interface CoinDisplayProps {
  userId: string;
  className?: string;
}

interface CoinEarningActivity {
  type: string;
  description: string;
  coins: number;
  icon: React.ReactNode;
  color: string;
}

const earningActivities: CoinEarningActivity[] = [
  {
    type: "screening_completed",
    description: "Complete screening assessment",
    coins: 10,
    icon: <TrendingUp className="h-4 w-4" />,
    color: "bg-green-100 text-green-800"
  },
  {
    type: "chat_session",
    description: "Chat with AI Assistant (per session)",
    coins: 5,
    icon: <MessageSquare className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800"
  },
  {
    type: "daily_login",
    description: "Daily login streak",
    coins: 2,
    icon: <Calendar className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800"
  },
  {
    type: "forum_post",
    description: "Create helpful forum post",
    coins: 5,
    icon: <MessageSquare className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-800"
  },
  {
    type: "mood_entry",
    description: "Track your mood daily",
    coins: 3,
    icon: <Trophy className="h-4 w-4" />,
    color: "bg-pink-100 text-pink-800"
  },
  {
    type: "profile_completion",
    description: "Complete your profile",
    coins: 15,
    icon: <Gift className="h-4 w-4" />,
    color: "bg-yellow-100 text-yellow-800"
  }
];

export default function CoinDisplay({ userId, className }: CoinDisplayProps) {
  const [open, setOpen] = useState(false);

  const { data: balanceData } = useQuery<{ balance: number }>({
    queryKey: [`/api/coins/balance/${userId}`],
    enabled: !!userId,
  });

  const { data: recentTransactions, isLoading } = useQuery<CoinTransaction[]>({
    queryKey: [`/api/coins/transactions/${userId}`],
    enabled: open && !!userId, // Only fetch when modal is open
  });

  const userCoins = balanceData?.balance || 0;

  const convertCoinsToRupees = (coins: number) => {
    return (coins / 10).toFixed(1);
  };

  const totalEarned = recentTransactions?.reduce((sum, transaction) => 
    transaction.amount > 0 ? sum + transaction.amount : sum, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-2 hover:bg-accent ${className}`}
          data-testid="button-coin-display"
        >
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{userCoins}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span>My Coins & Earnings</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Coin Balance Summary */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="h-6 w-6 text-yellow-600" />
                  <span>Your Coin Balance</span>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  ₹{convertCoinsToRupees(userCoins)}
                </Badge>
              </CardTitle>
              <CardDescription>
                You have <strong>{userCoins} coins</strong> which equals <strong>₹{convertCoinsToRupees(userCoins)}</strong>
                <br />
                <span className="text-xs text-muted-foreground">Exchange rate: 10 coins = ₹1</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span>Total Earned:</span>
                <span className="font-medium text-green-600">{totalEarned} coins</span>
              </div>
            </CardContent>
          </Card>

          {/* How to Earn Coins */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>How to Earn Coins</span>
            </h3>
            <div className="grid gap-3">
              {earningActivities.map((activity, index) => (
                <Card key={index} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">
                            +{activity.coins} coins
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 border-yellow-200">
                        <Coins className="h-3 w-3 mr-1" />
                        {activity.coins}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          {recentTransactions && recentTransactions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recentTransactions.slice(0, 10).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                    <Badge 
                      variant={transaction.amount > 0 ? "default" : "destructive"}
                      className={transaction.amount > 0 ? "bg-green-100 text-green-800" : ""}
                    >
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} coins
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Exchange Rate Info */}
          <div className="text-center text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
            <p className="font-medium mb-1">Exchange Rate</p>
            <p>10 coins = ₹1 • Use your coins for premium features and rewards</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}