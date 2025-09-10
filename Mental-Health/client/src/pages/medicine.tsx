import { useState } from "react";
import { Pill, ShoppingCart, Search, Star, Clock, MapPin, Plus, Minus, Upload, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/ui/back-button";

interface Medicine {
  id: number;
  name: string;
  genericName: string;
  category: string;
  price: number;
  discountPrice?: number;
  manufacturer: string;
  rating: number;
  reviewCount: number;
  description: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  inStock: boolean;
  prescription: boolean;
  image: string;
}

const medicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    category: "Pain Relief",
    price: 45,
    discountPrice: 38,
    manufacturer: "Cipla Ltd.",
    rating: 4.5,
    reviewCount: 245,
    description: "Effective pain relief and fever reducer for mild to moderate pain",
    uses: ["Headache", "Fever", "Body aches", "Toothache"],
    dosage: "1-2 tablets every 4-6 hours as needed",
    sideEffects: ["Rare: skin rash", "Overdose: liver damage"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Vitamin D3 1000 IU",
    genericName: "Cholecalciferol",
    category: "Vitamins",
    price: 280,
    discountPrice: 225,
    manufacturer: "Sun Pharma",
    rating: 4.7,
    reviewCount: 189,
    description: "Essential vitamin for bone health and immune system support",
    uses: ["Bone health", "Immune support", "Vitamin D deficiency"],
    dosage: "1 tablet daily with meal",
    sideEffects: ["Rare: nausea", "High doses: kidney stones"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    category: "Digestive",
    price: 120,
    discountPrice: 95,
    manufacturer: "Dr. Reddy's",
    rating: 4.3,
    reviewCount: 156,
    description: "Proton pump inhibitor for acid reflux and stomach ulcer treatment",
    uses: ["Acid reflux", "GERD", "Stomach ulcers", "Heartburn"],
    dosage: "1 capsule daily before breakfast",
    sideEffects: ["Headache", "Nausea", "Stomach pain"],
    inStock: true,
    prescription: true,
    image: "https://images.unsplash.com/photo-1471864700033-781b42eb91b5?w=300&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Cetirizine 10mg",
    genericName: "Cetirizine HCl",
    category: "Allergy",
    price: 65,
    discountPrice: 52,
    manufacturer: "Lupin Ltd.",
    rating: 4.4,
    reviewCount: 203,
    description: "Antihistamine for allergic reactions and seasonal allergies",
    uses: ["Allergic rhinitis", "Hives", "Itching", "Sneezing"],
    dosage: "1 tablet once daily",
    sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1471864700033-781b42eb91b5?w=300&h=200&fit=crop"
  },
  {
    id: 5,
    name: "Melatonin 3mg",
    genericName: "Melatonin",
    category: "Sleep Aid",
    price: 450,
    discountPrice: 385,
    manufacturer: "HealthKart",
    rating: 4.6,
    reviewCount: 312,
    description: "Natural sleep hormone supplement for better sleep quality",
    uses: ["Insomnia", "Jet lag", "Sleep disorders", "Shift work"],
    dosage: "1 tablet 30 minutes before bedtime",
    sideEffects: ["Morning drowsiness", "Vivid dreams", "Headache"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"
  },
  {
    id: 6,
    name: "Ashwagandha 300mg",
    genericName: "Withania somnifera",
    category: "Stress Relief",
    price: 380,
    discountPrice: 320,
    manufacturer: "Himalaya",
    rating: 4.5,
    reviewCount: 267,
    description: "Ayurvedic herb for stress management and anxiety relief",
    uses: ["Stress relief", "Anxiety", "Mental fatigue", "Energy boost"],
    dosage: "1-2 capsules twice daily with meals",
    sideEffects: ["Mild stomach upset", "Drowsiness"],
    inStock: true,
    prescription: false,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"
  }
];

const categories = ["All", "Pain Relief", "Vitamins", "Digestive", "Allergy", "Sleep Aid", "Stress Relief"];

interface CheckoutFormProps {
  medicines: Medicine[];
  cart: {[key: number]: number};
  total: number;
}

function CheckoutForm({ medicines, cart, total }: CheckoutFormProps) {
  const [orderData, setOrderData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    deliveryNotes: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    toast({
      title: "Order Placed Successfully!",
      description: `Your order of ₹${total} has been placed. You will receive a confirmation email shortly.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {Object.entries(cart).map(([medicineId, quantity]) => {
            const medicine = medicines.find(m => m.id === parseInt(medicineId));
            if (!medicine) return null;
            const price = medicine.discountPrice || medicine.price;

            return (
              <div key={medicineId} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                </div>
                <p className="font-medium">₹{price * quantity}</p>
              </div>
            );
          })}
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount:</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={orderData.fullName}
              onChange={(e) => setOrderData(prev => ({ ...prev, fullName: e.target.value }))}
              required
              data-testid="input-full-name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={orderData.email}
              onChange={(e) => setOrderData(prev => ({ ...prev, email: e.target.value }))}
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={orderData.phone}
              onChange={(e) => setOrderData(prev => ({ ...prev, phone: e.target.value }))}
              required
              data-testid="input-phone"
            />
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Delivery Address</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Textarea
              id="address"
              value={orderData.address}
              onChange={(e) => setOrderData(prev => ({ ...prev, address: e.target.value }))}
              required
              placeholder="House/Flat no., Street name, Area"
              data-testid="input-address"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={orderData.city}
                onChange={(e) => setOrderData(prev => ({ ...prev, city: e.target.value }))}
                required
                data-testid="input-city"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={orderData.state}
                onChange={(e) => setOrderData(prev => ({ ...prev, state: e.target.value }))}
                required
                data-testid="input-state"
              />
            </div>
            <div>
              <Label htmlFor="pincode">PIN Code *</Label>
              <Input
                id="pincode"
                value={orderData.pincode}
                onChange={(e) => setOrderData(prev => ({ ...prev, pincode: e.target.value }))}
                required
                data-testid="input-pincode"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
            <Textarea
              id="deliveryNotes"
              value={orderData.deliveryNotes}
              onChange={(e) => setOrderData(prev => ({ ...prev, deliveryNotes: e.target.value }))}
              placeholder="Any special instructions for delivery"
              data-testid="input-delivery-notes"
            />
          </div>
        </div>
      </div>

      {/* Payment & Place Order */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Cash on Delivery (COD)</p>
          <p className="text-xs text-muted-foreground mt-1">
            Pay when your order is delivered to your doorstep
          </p>
        </div>
        <Button type="submit" size="lg" className="w-full" data-testid="btn-place-order">
          Place Order - ₹{total}
        </Button>
      </div>
    </form>
  );
}

export default function Medicine() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const { toast } = useToast();

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.uses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicineId: number) => {
    setCart(prev => ({
      ...prev,
      [medicineId]: (prev[medicineId] || 0) + 1
    }));
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart successfully.",
    });
  };

  const removeFromCart = (medicineId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[medicineId] && newCart[medicineId] > 1) {
        newCart[medicineId] -= 1;
      } else {
        delete newCart[medicineId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [medicineId, quantity]) => {
      const medicine = medicines.find(m => m.id === parseInt(medicineId));
      if (medicine) {
        const price = medicine.discountPrice || medicine.price;
        return total + (price * quantity);
      }
      return total;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <BackButton />
      </div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Buy Medicine</h1>
        <p className="text-lg text-muted-foreground">
          Order medicines online with fast delivery and genuine products
        </p>
      </div>

      {/* Search and Cart Summary */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search medicines, symptoms, or conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-medicine-search"
            />
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-2">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {getCartItemCount()} items • ₹{getCartTotal()}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="normal-medicine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="normal-medicine" data-testid="tab-normal-medicine">Normal Medicine</TabsTrigger>
          <TabsTrigger value="prescription-upload" data-testid="tab-prescription-upload">Prescription Upload</TabsTrigger>
          <TabsTrigger value="cart" data-testid="tab-cart">
            Cart ({getCartItemCount()})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="normal-medicine" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-testid={`filter-${category.toLowerCase().replace(' ', '-')}`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Medicine Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-video mb-3 overflow-hidden rounded-lg">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{medicine.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{medicine.genericName}</p>
                      <p className="text-xs text-muted-foreground">{medicine.manufacturer}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="secondary" className="mb-1">{medicine.category}</Badge>
                      {medicine.prescription && (
                        <Badge variant="destructive" className="text-xs">Rx Required</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{medicine.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({medicine.reviewCount} reviews)</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{medicine.description}</p>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Uses:</strong> {medicine.uses.slice(0, 3).join(", ")}
                      {medicine.uses.length > 3 && "..."}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <strong>Dosage:</strong> {medicine.dosage}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {medicine.discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-primary">₹{medicine.discountPrice}</span>
                          <span className="text-sm text-muted-foreground line-through">₹{medicine.price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-primary">₹{medicine.price}</span>
                      )}
                    </div>
                    {medicine.inStock ? (
                      <div className="flex items-center gap-2">
                        {cart[medicine.id] ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(medicine.id)}
                              data-testid={`btn-decrease-${medicine.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="min-w-[20px] text-center">{cart[medicine.id]}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(medicine.id)}
                              data-testid={`btn-increase-${medicine.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => addToCart(medicine.id)}
                            data-testid={`btn-add-${medicine.id}`}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary">Out of Stock</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prescription-upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Prescription
              </CardTitle>
              <p className="text-muted-foreground">
                Upload your prescription and we'll help you order the exact medicines your doctor prescribed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload your prescription</h3>
                <p className="text-muted-foreground mb-4">
                  Supported formats: JPG, PNG, PDF (Max size: 10MB)
                </p>
                <Button className="mb-2" data-testid="btn-upload-prescription">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground">
                  Your prescription will be verified by our licensed pharmacists
                </p>
              </div>

              {/* Information Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Step 1</h4>
                    <p className="text-sm text-muted-foreground">Upload clear photo of prescription</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Step 2</h4>
                    <p className="text-sm text-muted-foreground">Our pharmacist will verify</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Step 3</h4>
                    <p className="text-sm text-muted-foreground">Add to cart and checkout</p>
                  </CardContent>
                </Card>
              </div>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Important Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Ensure the prescription is clearly visible and not blurred
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Doctor's signature and clinic stamp must be visible
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Prescription should not be older than 30 days
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      For controlled medications, original prescription may be required
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shopping Cart ({getCartItemCount()} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => {
                      const browseTab = document.querySelector('[data-testid="tab-normal-medicine"]') as HTMLElement;
                      browseTab?.click();
                    }}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(cart).map(([medicineId, quantity]) => {
                    const medicine = medicines.find(m => m.id === parseInt(medicineId));
                    if (!medicine) return null;
                    const price = medicine.discountPrice || medicine.price;

                    return (
                      <div key={medicineId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={medicine.image}
                            alt={medicine.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium">{medicine.name}</h4>
                            <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                            <p className="text-sm text-primary font-medium">₹{price} each</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(medicine.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="min-w-[30px] text-center">{quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(medicine.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{price * quantity}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total: ₹{getCartTotal()}</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="lg" data-testid="btn-checkout">
                            Proceed to Checkout
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details & Address</DialogTitle>
                          </DialogHeader>
                          <CheckoutForm medicines={medicines} cart={cart} total={getCartTotal()} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">Get medicines delivered within 2-4 hours in major cities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Pill className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Genuine Products</h3>
            <p className="text-sm text-muted-foreground">All medicines are sourced from verified manufacturers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Pan India Delivery</h3>
            <p className="text-sm text-muted-foreground">Available across 1000+ cities nationwide</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}