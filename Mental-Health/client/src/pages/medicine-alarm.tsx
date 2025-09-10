import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { AlarmClock, Plus, Edit, Trash2, Bell, Clock, Pill, Calendar } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Form schema
const medicineAlarmSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.enum(["daily", "twice-daily", "thrice-daily", "weekly", "custom"]),
  times: z.array(z.string()).min(1, "At least one time is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

type MedicineAlarmForm = z.infer<typeof medicineAlarmSchema>;

interface MedicineAlarm {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const frequencyOptions = [
  { value: "daily", label: "Once Daily", defaultTimes: ["08:00"] },
  { value: "twice-daily", label: "Twice Daily", defaultTimes: ["08:00", "20:00"] },
  { value: "thrice-daily", label: "Three Times Daily", defaultTimes: ["08:00", "14:00", "20:00"] },
  { value: "weekly", label: "Weekly", defaultTimes: ["08:00"] },
  { value: "custom", label: "Custom", defaultTimes: ["08:00"] },
];

export default function MedicineAlarmPage() {
  const [selectedAlarm, setSelectedAlarm] = useState<MedicineAlarm | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customTimes, setCustomTimes] = useState<string[]>(["08:00"]);
  const { toast } = useToast();

  const form = useForm<MedicineAlarmForm>({
    resolver: zodResolver(medicineAlarmSchema),
    defaultValues: {
      medicineName: "",
      dosage: "",
      frequency: "daily",
      times: ["08:00"],
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      notes: "",
    },
  });

  const { data: alarms = [], isLoading } = useQuery<MedicineAlarm[]>({
    queryKey: ["/api/medicine-alarms"],
  });

  const createAlarmMutation = useMutation({
    mutationFn: (data: MedicineAlarmForm) => apiRequest("/api/medicine-alarms", "POST", { ...data, userId: "current-user-id" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medicine-alarms"] });
      toast({ title: "Success", description: "Medicine alarm created successfully!" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create medicine alarm", variant: "destructive" });
    },
  });

  const updateAlarmMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MedicineAlarm> }) =>
      apiRequest(`/api/medicine-alarms/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medicine-alarms"] });
      toast({ title: "Success", description: "Medicine alarm updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update medicine alarm", variant: "destructive" });
    },
  });

  const deleteAlarmMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/medicine-alarms/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medicine-alarms"] });
      toast({ title: "Success", description: "Medicine alarm deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete medicine alarm", variant: "destructive" });
    },
  });

  const onSubmit = (data: MedicineAlarmForm) => {
    if (selectedAlarm) {
      updateAlarmMutation.mutate({ id: selectedAlarm.id, data });
    } else {
      createAlarmMutation.mutate(data);
    }
  };

  const handleFrequencyChange = (frequency: string) => {
    const option = frequencyOptions.find(opt => opt.value === frequency);
    if (option) {
      form.setValue("times", option.defaultTimes);
      setCustomTimes(option.defaultTimes);
    }
  };

  const addCustomTime = () => {
    const newTimes = [...customTimes, "08:00"];
    setCustomTimes(newTimes);
    form.setValue("times", newTimes);
  };

  const removeCustomTime = (index: number) => {
    const newTimes = customTimes.filter((_, i) => i !== index);
    setCustomTimes(newTimes);
    form.setValue("times", newTimes);
  };

  const updateCustomTime = (index: number, time: string) => {
    const newTimes = [...customTimes];
    newTimes[index] = time;
    setCustomTimes(newTimes);
    form.setValue("times", newTimes);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          toast({ title: "Success", description: "Notification permission granted!" });
        } else {
          toast({ title: "Warning", description: "Notification permission denied. You may miss medicine reminders.", variant: "destructive" });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission();
  }, []);

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getNextAlarmTime = (alarm: MedicineAlarm) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Find the next time for today
    const todayTimes = alarm.times.map(time => {
      const [hour, minute] = time.split(':');
      const alarmTime = new Date(now);
      alarmTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
      return alarmTime;
    }).filter(time => time > now);

    if (todayTimes.length > 0) {
      return todayTimes[0];
    }

    // If no times left today, get first time for tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hour, minute] = alarm.times[0].split(':');
    tomorrow.setHours(parseInt(hour), parseInt(minute), 0, 0);
    return tomorrow;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlarmClock className="h-6 w-6 text-primary" />
            Medicine Alarms
          </h1>
          <p className="text-muted-foreground">
            Set reminders for your medications and never miss a dose
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setSelectedAlarm(null);
                form.reset();
                setCustomTimes(["08:00"]);
              }}
              data-testid="button-add-alarm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Alarm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedAlarm ? "Edit Medicine Alarm" : "Add Medicine Alarm"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicineName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Vitamin D" {...field} data-testid="input-medicine-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1 tablet, 10mg" {...field} data-testid="input-dosage" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleFrequencyChange(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Custom times section */}
                <div className="space-y-2">
                  <FormLabel>Reminder Times</FormLabel>
                  {customTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => updateCustomTime(index, e.target.value)}
                        data-testid={`input-time-${index}`}
                      />
                      {customTimes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCustomTime(index)}
                          data-testid={`button-remove-time-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {form.watch("frequency") === "custom" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomTime}
                      data-testid="button-add-time"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Time
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-start-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-end-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional instructions or notes..."
                          rows={3}
                          {...field} 
                          data-testid="textarea-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createAlarmMutation.isPending || updateAlarmMutation.isPending}
                    data-testid="button-save-alarm"
                  >
                    {selectedAlarm ? "Update" : "Create"} Alarm
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alarms List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-8" data-testid="loading-alarms">
            Loading alarms...
          </div>
        ) : (alarms as MedicineAlarm[]).length === 0 ? (
          <div className="col-span-full text-center py-8" data-testid="no-alarms">
            <div className="space-y-3">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                No medicine alarms set yet. Add your first alarm to get started!
              </p>
            </div>
          </div>
        ) : (
          (alarms as MedicineAlarm[]).map((alarm: MedicineAlarm) => (
            <Card key={alarm.id} className="relative" data-testid={`card-alarm-${alarm.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      {alarm.medicineName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{alarm.dosage}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alarm.isActive}
                      onCheckedChange={(checked) =>
                        updateAlarmMutation.mutate({ 
                          id: alarm.id, 
                          data: { isActive: checked } 
                        })
                      }
                      data-testid={`switch-active-${alarm.id}`}
                    />
                    {alarm.isActive && (
                      <Bell className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {frequencyOptions.find(f => f.value === alarm.frequency)?.label}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {alarm.times.map((time, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {formatTime(time)}
                      </Badge>
                    ))}
                  </div>

                  {alarm.isActive && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Calendar className="h-4 w-4" />
                      Next: {getNextAlarmTime(alarm).toLocaleDateString()} at {formatTime(alarm.times[0])}
                    </div>
                  )}
                </div>

                {alarm.notes && (
                  <p className="text-sm text-muted-foreground italic">
                    {alarm.notes}
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAlarm(alarm);
                      form.reset({
                        medicineName: alarm.medicineName,
                        dosage: alarm.dosage,
                        frequency: alarm.frequency as any,
                        times: alarm.times,
                        startDate: alarm.startDate.split('T')[0],
                        endDate: alarm.endDate?.split('T')[0] || "",
                        notes: alarm.notes || "",
                      });
                      setCustomTimes(alarm.times);
                      setIsDialogOpen(true);
                    }}
                    data-testid={`button-edit-${alarm.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAlarmMutation.mutate(alarm.id)}
                    data-testid={`button-delete-${alarm.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}