import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus, Filter, Search, MapPin, Truck, Clock, Trash2, Recycle, Upload, DollarSign } from "lucide-react";
import { MedicineDetailModal } from "@/components/medicine-detail-modal";
import { apiRequest } from "@/lib/queryClient";

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  rentalPrice?: number;
  category: string;
  brand?: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
  availableForRent?: boolean;
  rentStock?: number;
  pestTargets?: string[];
  activeIngredients?: string[];
  usage?: string;
  specifications?: any;
}

interface CartItem {
  id: string;
  userId: string;
  medicineId: string;
  quantity: number;
  isRental?: boolean;
  rentalDays?: number;
}

export default function Medicine() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [medicineDetailOpen, setMedicineDetailOpen] = useState(false);
  const [rentalDialogOpen, setRentalDialogOpen] = useState(false);
  const [rentalFormData, setRentalFormData] = useState({
    medicineId: '',
    medicineName: '',
    rentalPeriod: 30,
    startDate: '',
    totalCost: 0
  });
  const [deliveryForm, setDeliveryForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    district: "",
    state: ""
  });
  const [sellWasteOpen, setSellWasteOpen] = useState(false);
  const [sellWasteForm, setSellWasteForm] = useState({
    wasteType: "",
    quantity: "",
    location: "",
    price: "",
    description: "",
    contactPhone: ""
  });

  // Fetch medicines
  const { data: medicines = [], isLoading: medicinesLoading } = useQuery({
    queryKey: ["/api/medicines"],
    queryFn: () => fetch("/api/medicines").then(res => res.json())
  });

  // Fetch cart items
  const { data: cartItems = [], isLoading: cartLoading } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: () => fetch("/api/cart").then(res => res.json())
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { medicineId: string; quantity: number; isRental?: boolean; rentalDays?: number }) => 
      apiRequest("POST", "/api/cart/add", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: t("medicine.addedToCart"),
        description: t("medicine.cartUpdated")
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("medicine.cartError"),
        variant: "destructive"
      });
    }
  });

  // Update cart mutation
  const updateCartMutation = useMutation({
    mutationFn: (data: { id: string; quantity: number }) => 
      apiRequest("PUT", `/api/cart/${data.id}`, { quantity: data.quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    }
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cart/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    }
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: (orderData: any) => apiRequest("POST", "/api/orders", orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setCheckoutOpen(false);
      setDeliveryForm({
        fullName: "",
        phone: "",
        address: "",
        pincode: "",
        city: "",
        district: "",
        state: ""
      });
      toast({
        title: t("medicine.orderPlaced"),
        description: t("medicine.orderSuccess")
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("medicine.orderError"),
        variant: "destructive"
      });
    }
  });

  // Filter medicines
  const filteredMedicines = medicines.filter((medicine: Medicine) => {
    let matchesCategory = false;
    
    if (selectedCategory === "all") {
      matchesCategory = true;
    } else if (selectedCategory === "organic") {
      matchesCategory = medicine.category === "organic";
    } else if (selectedCategory === "chemical") {
      matchesCategory = medicine.category === "chemical" || medicine.category === "ayurvedic";
    } else if (selectedCategory === "machines") {
      matchesCategory = medicine.category?.startsWith("hardware");
    } else if (selectedCategory === "waste-services") {
      matchesCategory = medicine.category === "waste-service";
    }
    
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (medicine.pestTargets && medicine.pestTargets.some(target => 
                           target.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (medicineId: string, quantity: number = 1, isRental: boolean = false, rentalDays: number = 1) => {
    addToCartMutation.mutate({ medicineId, quantity, isRental, rentalDays });
  };

  const handleUpdateCart = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate(id);
    } else {
      updateCartMutation.mutate({ id, quantity });
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total: number, item: CartItem & { medicine: Medicine }) => 
      total + (item.medicine?.price * item.quantity || 0), 0
    );
  };

  const getCartQuantity = (medicineId: string) => {
    const cartItem = cartItems.find((item: CartItem) => item.medicineId === medicineId);
    return cartItem?.quantity || 0;
  };

  const handlePlaceOrder = () => {
    if (!deliveryForm.fullName || !deliveryForm.phone || !deliveryForm.address || !deliveryForm.pincode || !deliveryForm.city) {
      toast({
        title: t("medicine.incompleteForm"),
        description: t("medicine.fillAllFields"),
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      totalAmount: getTotalPrice(),
      deliveryAddress: `${deliveryForm.fullName}, ${deliveryForm.address}, ${deliveryForm.city}, ${deliveryForm.district}, ${deliveryForm.state} - ${deliveryForm.pincode}. Phone: ${deliveryForm.phone}`
    };

    placeOrderMutation.mutate(orderData);
  };

  // Medicine detail handlers
  const handleMedicineClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setMedicineDetailOpen(true);
  };

  const handleMedicineDetailClose = () => {
    setMedicineDetailOpen(false);
    setSelectedMedicine(null);
  };

  // Rental dialog handlers
  const handleRentClick = (medicine: Medicine) => {
    const dailyRate = medicine.rentalPrice || Math.round(medicine.price * 0.003);
    setRentalFormData({
      medicineId: medicine.id,
      medicineName: medicine.name,
      rentalPeriod: 30,
      startDate: new Date().toISOString().split('T')[0],
      totalCost: dailyRate * 30
    });
    setRentalDialogOpen(true);
  };

  const handleRentalSubmit = () => {
    handleAddToCart(rentalFormData.medicineId, 1, true, rentalFormData.rentalPeriod);
    toast({
      title: "Added to Cart",
      description: `${rentalFormData.medicineName} added for ${rentalFormData.rentalPeriod}-day rental`,
      duration: 3000
    });
    setRentalDialogOpen(false);
  };

  const updateRentalCost = (period: number) => {
    const medicine = medicines?.find((m: Medicine) => m.id === rentalFormData.medicineId);
    if (medicine) {
      const dailyRate = medicine.rentalPrice || Math.round(medicine.price * 0.003);
      setRentalFormData(prev => ({
        ...prev,
        rentalPeriod: period,
        totalCost: dailyRate * period
      }));
    }
  };

  // Indian states and cities data
  const indianStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
    "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
  ];

  const getCitiesByState = (state: string) => {
    const citiesData: Record<string, string[]> = {
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur"],
      "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi", "Gulbarga"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
      "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad"],
      "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda"],
      "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
      "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
      "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak"],
      "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"]
    };
    return citiesData[state] || [];
  };

  const categories = [
    { value: "all", label: "All Products" },
    { value: "organic", label: "Organic Fertilizers" },
    { value: "chemical", label: "Chemical Fertilizers" },
    { value: "machines", label: "Machines" },
    { value: "waste-services", label: "Waste Management" }
  ];

  if (medicinesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t("common.loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2" data-testid="page-title">
🌾 GreenRoots Store
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">Quality fertilizers and modern farming equipment - Buy or Rent</p>
        </div>
        
        {/* Cart Button */}
        <Button 
          onClick={() => setCartOpen(!cartOpen)} 
          className="relative"
          data-testid="cart-button"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {t("medicine.cart")} ({cartItems.length})
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground min-w-[1.2rem] h-5 flex items-center justify-center text-xs">
              {cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t("medicine.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger data-testid="category-filter">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full">
        {/* Medicine Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine: Medicine) => (
              <Card 
                key={medicine.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer" 
                data-testid={`medicine-card-${medicine.id}`}
                onClick={() => handleMedicineClick(medicine)}
              >
                <CardHeader className="p-4">
                  {medicine.imageUrl && (
                    <img 
                      src={medicine.imageUrl} 
                      alt={medicine.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      data-testid={`medicine-image-${medicine.id}`}
                    />
                  )}
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{medicine.name}</CardTitle>
                    <Badge variant={medicine.category === "organic" ? "secondary" : 
                                  medicine.category === "ayurvedic" ? "outline" : "default"}>
                      {t(`medicine.${medicine.category}`)}
                    </Badge>
                  </div>
                  {medicine.brand && (
                    <p className="text-sm text-muted-foreground">{medicine.brand}</p>
                  )}
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {medicine.description}
                  </p>
                  
                  {medicine.pestTargets && (
                    <div className="mb-4">
                      <p className="text-xs font-medium mb-2">{t("medicine.effectiveAgainst")}:</p>
                      <div className="flex flex-wrap gap-1">
                        {medicine.pestTargets.slice(0, 3).map((pest, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {pest}
                          </Badge>
                        ))}
                        {medicine.pestTargets.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{medicine.pestTargets.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      {medicine.category?.startsWith('hardware') && medicine.price > 50000 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-primary">₹{medicine.price.toLocaleString()}</p>
                            <Badge variant="secondary" className="text-xs">Buy</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-green-600">
                              ₹{medicine.rentalPrice || Math.round(medicine.price * 0.003)}/day
                            </p>
                            <Badge variant="outline" className="text-xs">Rent</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {medicine.inStock ? `Available: ${medicine.stockQuantity}` : 'Out of Stock'}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold text-primary">₹{medicine.price}</p>
                          <p className="text-xs text-muted-foreground">
                            {medicine.inStock 
                              ? `${t("medicine.inStock")} (${medicine.stockQuantity})`
                              : t("medicine.outOfStock")
                            }
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getCartQuantity(medicine.id) > 0 ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              const cartItem = cartItems.find((item: CartItem) => item.medicineId === medicine.id);
                              if (cartItem) {
                                handleUpdateCart(cartItem.id, cartItem.quantity - 1);
                              }
                            }}
                            data-testid={`decrease-quantity-${medicine.id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="min-w-[2rem] text-center">{getCartQuantity(medicine.id)}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              const cartItem = cartItems.find((item: CartItem) => item.medicineId === medicine.id);
                              if (cartItem) {
                                handleUpdateCart(cartItem.id, cartItem.quantity + 1);
                              }
                            }}
                            data-testid={`increase-quantity-${medicine.id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* Show both Add to Cart and Rent options for expensive hardware */}
                          {medicine.category?.startsWith('hardware') && medicine.price > 50000 ? (
                            <div className="flex flex-col gap-1 w-full">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(medicine.id, 1, false);
                                }}
                                disabled={!medicine.inStock || addToCartMutation.isPending}
                                size="sm"
                                className="w-full text-xs"
                                data-testid={`add-to-cart-${medicine.id}`}
                              >
                                {addToCartMutation.isPending ? (
                                  <>Adding...</>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3 mr-1" />
                                    Buy
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRentClick(medicine);
                                }}
                                disabled={!medicine.inStock}
                                size="sm"
                                variant="outline"
                                className="w-full text-xs"
                                data-testid={`rent-${medicine.id}`}
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Rent Now
                              </Button>
                            </div>
                          ) : medicine.category === "waste-service" ? (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(medicine.id, 1, false);
                              }}
                              disabled={!medicine.inStock || addToCartMutation.isPending}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              data-testid={`book-waste-service-${medicine.id}`}
                            >
                              {addToCartMutation.isPending ? (
                                <>Booking...</>
                              ) : (
                                <>
                                  <Recycle className="w-4 h-4 mr-1" />
                                  Book Service
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(medicine.id, 1, false);
                              }}
                              disabled={!medicine.inStock || addToCartMutation.isPending}
                              size="sm"
                              data-testid={`add-to-cart-${medicine.id}`}
                            >
                              {addToCartMutation.isPending ? (
                                <>Adding...</>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-1" />
                                  {t("medicine.addToCart")}
                                </>
                              )}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredMedicines.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("medicine.noResults")}</p>
            </div>
          )}
        </div>

        {/* Cart Modal */}
        <Dialog open={cartOpen} onOpenChange={setCartOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {t("medicine.cart")}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
                {cartItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    {t("medicine.emptyCart")}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item: CartItem & { medicine: Medicine }) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg" data-testid={`cart-item-${item.id}`}>
                        {item.medicine?.imageUrl && (
                          <img 
                            src={item.medicine.imageUrl} 
                            alt={item.medicine.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.medicine?.name}</p>
                          <p className="text-xs text-muted-foreground">₹{item.medicine?.price} each</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => handleUpdateCart(item.id, item.quantity - 1)}
                              data-testid={`cart-decrease-${item.id}`}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm min-w-[1.5rem] text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => handleUpdateCart(item.id, item.quantity + 1)}
                              data-testid={`cart-increase-${item.id}`}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">₹{(item.medicine?.price * item.quantity) || 0}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">{t("medicine.total")}:</span>
                        <span className="font-bold text-lg">₹{getTotalPrice()}</span>
                      </div>
                      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full" data-testid="checkout-button">
                            <Truck className="w-4 h-4 mr-2" />
                            {t("medicine.checkout")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <MapPin className="w-5 h-5" />
                              {t("medicine.deliveryDetails")}
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            {/* Order Summary */}
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">{t("medicine.orderSummary")}</h4>
                              <div className="space-y-1 text-sm">
                                {cartItems.map((item: CartItem & { medicine: Medicine }) => (
                                  <div key={item.id} className="flex justify-between">
                                    <span>{item.medicine?.name} x{item.quantity}</span>
                                    <span>₹{(item.medicine?.price * item.quantity) || 0}</span>
                                  </div>
                                ))}
                                <div className="border-t pt-1 font-semibold flex justify-between">
                                  <span>{t("medicine.total")}:</span>
                                  <span>₹{getTotalPrice()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Delivery Form */}
                            <div className="grid grid-cols-1 gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="fullName">{t("medicine.fullName")} *</Label>
                                  <Input
                                    id="fullName"
                                    value={deliveryForm.fullName}
                                    onChange={(e) => setDeliveryForm({...deliveryForm, fullName: e.target.value})}
                                    placeholder={t("medicine.enterFullName")}
                                    data-testid="input-fullname"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="phone">{t("medicine.phone")} *</Label>
                                  <Input
                                    id="phone"
                                    value={deliveryForm.phone}
                                    onChange={(e) => setDeliveryForm({...deliveryForm, phone: e.target.value})}
                                    placeholder={t("medicine.enterPhone")}
                                    data-testid="input-phone"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="address">{t("medicine.address")} *</Label>
                                <Textarea
                                  id="address"
                                  value={deliveryForm.address}
                                  onChange={(e) => setDeliveryForm({...deliveryForm, address: e.target.value})}
                                  placeholder={t("medicine.enterAddress")}
                                  rows={3}
                                  data-testid="input-address"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="pincode">{t("medicine.pincode")} *</Label>
                                  <Input
                                    id="pincode"
                                    value={deliveryForm.pincode}
                                    onChange={(e) => setDeliveryForm({...deliveryForm, pincode: e.target.value})}
                                    placeholder={t("medicine.enterPincode")}
                                    maxLength={6}
                                    data-testid="input-pincode"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="state">{t("medicine.state")} *</Label>
                                  <Select 
                                    value={deliveryForm.state} 
                                    onValueChange={(value) => {
                                      setDeliveryForm({...deliveryForm, state: value, city: "", district: ""});
                                    }}
                                  >
                                    <SelectTrigger data-testid="select-state">
                                      <SelectValue placeholder={t("medicine.selectState")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {indianStates.map((state) => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="city">{t("medicine.city")} *</Label>
                                  <Select 
                                    value={deliveryForm.city} 
                                    onValueChange={(value) => {
                                      setDeliveryForm({...deliveryForm, city: value, district: value});
                                    }}
                                    disabled={!deliveryForm.state}
                                  >
                                    <SelectTrigger data-testid="select-city">
                                      <SelectValue placeholder={t("medicine.selectCity")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getCitiesByState(deliveryForm.state).map((city) => (
                                        <SelectItem key={city} value={city}>{city}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="district">{t("medicine.district")}</Label>
                                  <Input
                                    id="district"
                                    value={deliveryForm.district}
                                    onChange={(e) => setDeliveryForm({...deliveryForm, district: e.target.value})}
                                    placeholder={t("medicine.enterDistrict")}
                                    data-testid="input-district"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => setCheckoutOpen(false)} 
                                className="flex-1"
                                data-testid="button-cancel-order"
                              >
                                {t("common.cancel")}
                              </Button>
                              <Button 
                                onClick={handlePlaceOrder} 
                                disabled={placeOrderMutation.isPending}
                                className="flex-1"
                                data-testid="button-place-order"
                              >
                                {placeOrderMutation.isPending ? (
                                  t("medicine.placingOrder")
                                ) : (
                                  `${t("medicine.placeOrder")} (₹${getTotalPrice()})`
                                )}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Medicine Detail Modal */}
      <MedicineDetailModal
        medicine={selectedMedicine}
        open={medicineDetailOpen}
        onOpenChange={handleMedicineDetailClose}
      />

      {/* Rental Dialog */}
      <Dialog open={rentalDialogOpen} onOpenChange={setRentalDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-800">
              <Clock className="w-5 h-5 text-orange-600" />
              Rent Equipment - {rentalFormData.medicineName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="bg-white/60 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-3">Rental Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-orange-700">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={rentalFormData.startDate}
                    onChange={(e) => setRentalFormData(prev => ({...prev, startDate: e.target.value}))}
                    className="border-orange-300 focus:border-orange-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="rentalPeriod" className="text-orange-700">Rental Period (Days) *</Label>
                  <Select 
                    value={rentalFormData.rentalPeriod.toString()} 
                    onValueChange={(value) => updateRentalCost(parseInt(value))}
                  >
                    <SelectTrigger className="border-orange-300 focus:border-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days (1 week)</SelectItem>
                      <SelectItem value="15">15 days</SelectItem>
                      <SelectItem value="30">30 days (1 month)</SelectItem>
                      <SelectItem value="60">60 days (2 months)</SelectItem>
                      <SelectItem value="90">90 days (3 months)</SelectItem>
                      <SelectItem value="180">180 days (6 months)</SelectItem>
                      <SelectItem value="365">365 days (1 year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Daily Rate:</span>
                  <span className="font-medium">₹{Math.round(rentalFormData.totalCost / rentalFormData.rentalPeriod)}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Rental Period:</span>
                  <span className="font-medium">{rentalFormData.rentalPeriod} days</span>
                </div>
                <div className="border-t border-green-200 pt-2 flex justify-between text-lg font-bold text-green-800">
                  <span>Total Rental Cost:</span>
                  <span>₹{rentalFormData.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                📋 <strong>Rental Terms:</strong> Equipment will be delivered on start date. 
                Security deposit may be required. Return in same condition to avoid additional charges.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setRentalDialogOpen(false)} 
              className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRentalSubmit}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              Add to Cart - ₹{rentalFormData.totalCost.toLocaleString()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sell Your Waste Dialog */}
      <Dialog open={sellWasteOpen} onOpenChange={setSellWasteOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" />
              Sell Your Farm Waste
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wasteType">Waste Type</Label>
                <Select value={sellWasteForm.wasteType} onValueChange={(value) => setSellWasteForm(prev => ({...prev, wasteType: value}))}>
                  <SelectTrigger data-testid="waste-type-select">
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice-husk">Rice Husk</SelectItem>
                    <SelectItem value="wheat-straw">Wheat Straw</SelectItem>
                    <SelectItem value="corn-stalks">Corn Stalks</SelectItem>
                    <SelectItem value="sugarcane-bagasse">Sugarcane Bagasse</SelectItem>
                    <SelectItem value="cotton-stalks">Cotton Stalks</SelectItem>
                    <SelectItem value="vegetable-waste">Vegetable Waste</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity (in tons)</Label>
                <Input
                  id="quantity"
                  placeholder="e.g. 5"
                  value={sellWasteForm.quantity}
                  onChange={(e) => setSellWasteForm(prev => ({...prev, quantity: e.target.value}))}
                  data-testid="waste-quantity-input"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Village, District, State"
                  value={sellWasteForm.location}
                  onChange={(e) => setSellWasteForm(prev => ({...prev, location: e.target.value}))}
                  data-testid="waste-location-input"
                />
              </div>
              <div>
                <Label htmlFor="price">Expected Price (₹ per ton)</Label>
                <Input
                  id="price"
                  placeholder="e.g. 2000"
                  value={sellWasteForm.price}
                  onChange={(e) => setSellWasteForm(prev => ({...prev, price: e.target.value}))}
                  data-testid="waste-price-input"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                placeholder="+91 9876543210"
                value={sellWasteForm.contactPhone}
                onChange={(e) => setSellWasteForm(prev => ({...prev, contactPhone: e.target.value}))}
                data-testid="waste-contact-input"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the quality, storage conditions, and any other relevant details..."
                value={sellWasteForm.description}
                onChange={(e) => setSellWasteForm(prev => ({...prev, description: e.target.value}))}
                rows={3}
                data-testid="waste-description-input"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  toast({
                    title: "Listing Submitted!",
                    description: "Your waste listing has been submitted. Potential buyers will contact you soon.",
                  });
                  setSellWasteOpen(false);
                  setSellWasteForm({
                    wasteType: "",
                    quantity: "",
                    location: "",
                    price: "",
                    description: "",
                    contactPhone: ""
                  });
                }}
                data-testid="submit-waste-listing"
              >
                <Upload className="w-4 h-4 mr-2" />
                List My Waste
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSellWasteOpen(false)}
                data-testid="cancel-waste-listing"
              >
                Cancel
              </Button>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Tip:</strong> Convert your farm waste into income! Many industries need agricultural waste for biomass, animal feed, and eco-friendly products.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Sell Waste Button - Only show when on waste management category */}
      {selectedCategory === "waste-services" && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setSellWasteOpen(true)}
            className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            data-testid="floating-sell-waste-button"
          >
            <DollarSign className="w-6 h-6" />
          </Button>
          <div className="absolute -left-32 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Sell Your Waste
          </div>
        </div>
      )}
    </div>
  );
}