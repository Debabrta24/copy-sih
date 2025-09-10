import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Clock, 
  Droplets, 
  Calendar, 
  AlertTriangle, 
  Target, 
  Beaker, 
  ShoppingCart,
  Leaf,
  Package,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Info
} from "lucide-react";
import { useLanguage } from "./language-provider";
import { useToast } from "@/hooks/use-toast";

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand?: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
  pestTargets?: string[];
  activeIngredients?: string[];
  usage?: string;
}

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicineDetailModal({ medicine, open, onOpenChange }: MedicineDetailModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  if (!medicine) return null;

  // Parse usage instructions to extract structured information
  const parseUsage = (usage: string) => {
    const sections = {
      dosage: "",
      timing: "",
      frequency: "",
      method: "",
      precautions: "",
      benefits: "",
      storage: "",
      compatibility: "",
      effectiveness: "",
      safety: ""
    };

    if (usage) {
      const parts = usage.split(/[A-Z]+:/);
      const headers = usage.match(/[A-Z]+:/g) || [];
      
      headers.forEach((header, index) => {
        const key = header.toLowerCase().replace(":", "");
        const content = parts[index + 1]?.trim() || "";
        
        if (key.includes("dosage") || key.includes("dose")) sections.dosage = content;
        else if (key.includes("timing") || key.includes("time")) sections.timing = content;
        else if (key.includes("frequency") || key.includes("freq")) sections.frequency = content;
        else if (key.includes("method") || key.includes("application")) sections.method = content;
        else if (key.includes("precaution") || key.includes("safety")) sections.precautions = content;
        else if (key.includes("benefit") || key.includes("advantage")) sections.benefits = content;
        else if (key.includes("storage") || key.includes("store")) sections.storage = content;
        else if (key.includes("compatibility") || key.includes("mix")) sections.compatibility = content;
        else if (key.includes("effectiveness") || key.includes("effect")) sections.effectiveness = content;
      });
    }

    return sections;
  };

  const usageDetails = parseUsage(medicine.usage || "");

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      // Simulate adding to cart
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Added to Cart!",
        description: `${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${medicine.name} added to your cart.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "organic":
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200";
      case "chemical":
        return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200";
      case "ayurvedic":
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
                <span>{medicine.name}</span>
                <Badge className={getCategoryColor(medicine.category)}>
                  {medicine.category.charAt(0).toUpperCase() + medicine.category.slice(1)}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-2 text-base">
                {medicine.description}
              </DialogDescription>
              {medicine.brand && (
                <p className="text-sm text-muted-foreground mt-1">
                  By {medicine.brand}
                </p>
              )}
            </div>
            {medicine.imageUrl && (
              <img
                src={medicine.imageUrl}
                alt={medicine.name}
                className="w-24 h-24 object-cover rounded-lg border ml-4"
              />
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Price and Stock Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      {medicine.price}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {medicine.inStock ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">In Stock</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 font-medium">Out of Stock</span>
                      </>
                    )}
                  </div>
                  {medicine.stockQuantity && (
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {medicine.stockQuantity} units available
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <label htmlFor="quantity" className="text-sm font-medium">Qty:</label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border rounded px-2 py-1 text-sm"
                      data-testid="quantity-selector"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={!medicine.inStock || addingToCart}
                    className="flex items-center space-x-2"
                    data-testid="add-to-cart-button"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pest Targets */}
          {medicine.pestTargets && medicine.pestTargets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-red-500" />
                  <span>Target Pests & Diseases</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {medicine.pestTargets.map((pest, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {pest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Ingredients */}
          {medicine.activeIngredients && medicine.activeIngredients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Beaker className="w-5 h-5 text-blue-500" />
                  <span>Active Ingredients</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {medicine.activeIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-green-500" />
                <span>Detailed Usage Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {usageDetails.dosage && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <h4 className="font-semibold">Dosage</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{usageDetails.dosage}</p>
                </div>
              )}

              {usageDetails.timing && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <h4 className="font-semibold">Best Time to Apply</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{usageDetails.timing}</p>
                </div>
              )}

              {usageDetails.frequency && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <h4 className="font-semibold">Application Frequency</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{usageDetails.frequency}</p>
                </div>
              )}

              {usageDetails.method && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Leaf className="w-4 h-4 text-green-500" />
                    <h4 className="font-semibold">Application Method</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{usageDetails.method}</p>
                </div>
              )}

              {usageDetails.precautions && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <h4 className="font-semibold text-red-600">Safety Precautions</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{usageDetails.precautions}</p>
                </div>
              )}

              {usageDetails.benefits && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <h4 className="font-semibold text-green-600">Benefits</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{usageDetails.benefits}</p>
                </div>
              )}

              {usageDetails.effectiveness && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <h4 className="font-semibold">Effectiveness</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{usageDetails.effectiveness}</p>
                </div>
              )}

              {usageDetails.storage && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <h4 className="font-semibold">Storage Instructions</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">{usageDetails.storage}</p>
                </div>
              )}

              {/* If no structured usage data, show raw usage */}
              {!Object.values(usageDetails).some(val => val) && medicine.usage && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Usage Instructions</h4>
                  <p className="text-sm text-muted-foreground">{medicine.usage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />
        
        <div className="flex-shrink-0 flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            onClick={handleAddToCart}
            disabled={!medicine.inStock || addingToCart}
            className="flex items-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add {quantity} to Cart</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}