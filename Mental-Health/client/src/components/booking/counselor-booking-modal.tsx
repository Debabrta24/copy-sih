import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Star, Languages, Clock, Shield, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Counselor } from "@/types";

interface CounselorBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sessionTypes = [
  {
    value: "individual",
    title: "Individual Session",
    description: "One-on-one counseling",
    color: "bg-primary/10 border-primary text-primary"
  },
  {
    value: "group", 
    title: "Group Session",
    description: "Small group support",
    color: "bg-muted/50 border-transparent text-muted-foreground"
  },
  {
    value: "crisis",
    title: "Crisis Support", 
    description: "Immediate assistance",
    color: "bg-destructive/10 border-destructive text-destructive"
  }
];

const availableTimes = [
  "9:00 AM - 10:00 AM",
  "11:00 AM - 12:00 PM", 
  "2:00 PM - 3:00 PM",
  "4:00 PM - 5:00 PM"
];

export default function CounselorBookingModal({ isOpen, onClose }: CounselorBookingModalProps) {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [bookingData, setBookingData] = useState({
    sessionType: "individual",
    counselorId: "",
    preferredDate: "",
    preferredTime: "",
    notes: ""
  });

  const { data: counselors, isLoading: counselorsLoading } = useQuery({
    queryKey: ["/api/counselors"],
    enabled: isOpen,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      // Convert time from "9:00 AM - 10:00 AM" format to "09:00"
      const timeString = data.preferredTime.split(' - ')[0]; // Get "9:00 AM"
      const [time, period] = timeString.split(' '); // Split "9:00" and "AM"
      const [hours, minutes] = time.split(':'); // Split "9" and "00"
      
      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;
      
      const formattedTime = `${hour24.toString().padStart(2, '0')}:${minutes}`;
      const scheduledFor = new Date(`${data.preferredDate}T${formattedTime}:00`);
      
      return await apiRequest("POST", "/api/appointments", {
        userId: currentUser?.id,
        counselorId: data.counselorId,
        sessionType: data.sessionType,
        scheduledFor: scheduledFor.toISOString(),
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/user", currentUser?.id] });
      toast({
        title: "Appointment booked",
        description: "Your counseling session has been scheduled successfully.",
      });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: "Unable to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setBookingData({
      sessionType: "individual",
      counselorId: "",
      preferredDate: "",
      preferredTime: "",
      notes: ""
    });
    onClose();
  };

  const handleSubmit = () => {
    if (!bookingData.counselorId || !bookingData.preferredDate || !bookingData.preferredTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate(bookingData);
  };

  const getRatingStars = (rating: number) => {
    const stars = Math.round(rating / 10); // Convert from 0-50 scale to 0-5
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < stars ? 'text-accent fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Book Counseling Session</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} data-testid="button-close-modal">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Schedule a confidential session with our qualified counselors
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Session Type Selection */}
          <div>
            <Label className="block text-sm font-medium text-card-foreground mb-3">
              Session Type
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sessionTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    bookingData.sessionType === type.value 
                      ? type.color 
                      : "bg-muted/50 border-transparent hover:bg-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="sessionType"
                    value={type.value}
                    checked={bookingData.sessionType === type.value}
                    onChange={(e) => setBookingData({ ...bookingData, sessionType: e.target.value })}
                    className="sr-only"
                    data-testid={`radio-session-${type.value}`}
                  />
                  <div>
                    <p className="font-medium">{type.title}</p>
                    <p className="text-xs opacity-70">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Available Counselors */}
          <div>
            <Label className="block text-sm font-medium text-card-foreground mb-3">
              Choose Counselor
            </Label>
            
            {counselorsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="animate-pulse p-4 bg-muted/30 rounded-lg">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : !counselors || (counselors as any)?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No counselors are currently available. Please try again later.
              </p>
            ) : (
              <RadioGroup
                value={bookingData.counselorId}
                onValueChange={(value) => setBookingData({ ...bookingData, counselorId: value })}
              >
                <div className="space-y-3">
                  {(counselors as any)?.map?.((counselor: Counselor) => (
                    <label
                      key={counselor.id}
                      className="flex items-center space-x-4 p-4 bg-muted/30 border-2 border-transparent rounded-lg cursor-pointer hover:bg-muted transition-colors data-[checked]:border-primary"
                      data-checked={bookingData.counselorId === counselor.id}
                    >
                      <RadioGroupItem
                        value={counselor.id}
                        id={counselor.id}
                        data-testid={`radio-counselor-${counselor.id}`}
                      />
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                        <UserCheck className="text-secondary-foreground h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">{counselor.name}</p>
                        <p className="text-sm text-muted-foreground">{counselor.specialization}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Languages className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-secondary">
                            {counselor.languages.join(", ")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {getRatingStars(counselor.rating)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {counselor.experience}+ years exp
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-card-foreground mb-3">
                Preferred Date
              </Label>
              <Input
                type="date"
                min={today}
                value={bookingData.preferredDate}
                onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                data-testid="input-preferred-date"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-card-foreground mb-3">
                Preferred Time
              </Label>
              <Select 
                value={bookingData.preferredTime}
                onValueChange={(value) => setBookingData({ ...bookingData, preferredTime: value })}
              >
                <SelectTrigger data-testid="select-preferred-time">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label className="block text-sm font-medium text-card-foreground mb-3">
              Additional Notes (Optional)
            </Label>
            <Textarea
              rows={3}
              placeholder="Share any specific concerns or preferences..."
              value={bookingData.notes}
              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              data-testid="textarea-appointment-notes"
            />
          </div>

          {/* Privacy Notice */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h5 className="font-medium text-card-foreground mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              Privacy & Confidentiality
            </h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your session details and personal information are completely confidential. 
              Only your assigned counselor will have access to session notes. 
              You can cancel or reschedule up to 2 hours before the appointment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={bookingMutation.isPending}
              className="flex-1"
              data-testid="button-confirm-booking"
            >
              <Clock className="h-4 w-4 mr-2" />
              {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-6"
              data-testid="button-cancel-booking"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
