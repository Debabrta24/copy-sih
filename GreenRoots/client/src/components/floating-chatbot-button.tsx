import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { FarmingChatbot } from './farming-chatbot';

export function FloatingChatbotButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [location] = useLocation();

  if (!isVisible) return null;

  // Check if we're on the store page with waste services to adjust positioning
  const isOnWasteServices = location === '/medicine';
  const bottomPosition = isOnWasteServices ? 'bottom-20' : 'bottom-4';

  return (
    <>
      <div className={`fixed right-4 z-40 ${bottomPosition}`}>
        <Button
          onClick={() => setIsChatOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>

      <FarmingChatbot 
        open={isChatOpen} 
        onOpenChange={setIsChatOpen}
      />
    </>
  );
}