import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Phone, 
  ExternalLink,
  CreditCard,
  Building,
  FileText,
  UserCheck,
  Lock,
  Eye,
  TrendingUp
} from "lucide-react";

export default function LoanScamInfo() {
  const trustedBanks = [
    {
      name: "State Bank of India",
      logo: "/Bank_logo_icon_6754e0dd.png",
      schemes: ["Kisan Credit Card", "Agriculture Gold Loan", "Crop Loan"],
      website: "https://sbi.co.in/web/agri-rural/agriculture",
      helpline: "1800-11-2211"
    },
    {
      name: "HDFC Bank",
      logo: "/Bank_logo_icon_6754e0dd.png",
      schemes: ["Kisan Dhan Vikas", "Agriculture Equipment Loan", "Dairy Loan"],
      website: "https://www.hdfcbank.com/personal/borrow/popular-loans/loan-against-property/agriculture-loan",
      helpline: "1800-266-4332"
    },
    {
      name: "ICICI Bank",
      logo: "/Bank_logo_icon_6754e0dd.png",
      schemes: ["Crop Loan", "Agriculture Term Loan", "Kisan Credit Card"],
      website: "https://www.icicibank.com/personal-banking/loans/rural-and-agri-loans",
      helpline: "1860-120-7777"
    },
    {
      name: "Punjab National Bank",
      logo: "/Bank_logo_icon_6754e0dd.png",
      schemes: ["PNB Kisan Credit Card", "Agriculture Gold Loan", "Warehouse Receipt Loan"],
      website: "https://www.pnbindia.in/agri-loan.html",
      helpline: "1800-180-2222"
    }
  ];

  const scamWarnings = [
    {
      type: "Phone Scams",
      icon: Phone,
      warning: "Callers claiming instant loan approval without documentation",
      redFlags: [
        "Asking for money upfront as 'processing fee'",
        "Pressure to decide immediately",
        "No physical office address",
        "Requesting bank details over phone"
      ],
      prevention: "Never pay processing fees in advance. Legitimate banks don't ask for upfront payments."
    },
    {
      type: "Online Fraud",
      icon: CreditCard,
      warning: "Fake loan websites with too-good-to-be-true offers",
      redFlags: [
        "Extremely low interest rates (below 2-3%)",
        "No credit score requirements",
        "Instant approval claims",
        "Poor website design and spelling mistakes"
      ],
      prevention: "Always verify the website URL and check for official bank certification."
    },
    {
      type: "Document Fraud",
      icon: FileText,
      warning: "Fraudsters offering to create fake income documents",
      redFlags: [
        "Offering to inflate income certificates",
        "Creating fake employment records",
        "Forged property documents",
        "Fake guarantor arrangements"
      ],
      prevention: "Use only genuine documents. Bank fraud can lead to criminal charges."
    }
  ];

  const governmentSchemes = [
    {
      name: "PM-KISAN",
      description: "₹6,000 per year direct benefit transfer to farmer families",
      eligibility: "All landholding farmers",
      website: "https://pmkisan.gov.in/",
      helpline: "155261"
    },
    {
      name: "Kisan Credit Card",
      description: "Flexible credit facility for agriculture and allied activities",
      eligibility: "Farmers with valid land records",
      website: "https://www.india.gov.in/spotlight/kisan-credit-card-kcc",
      helpline: "1800-180-1551"
    },
    {
      name: "NABARD Schemes",
      description: "Various rural development and agriculture financing schemes",
      eligibility: "Small and marginal farmers",
      website: "https://www.nabard.org/",
      helpline: "1800-425-0018"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-10 h-10 text-green-600" />
          <h1 className="text-4xl font-bold text-card-foreground">Loan & Scam Information</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Protect yourself from financial fraud and access legitimate agricultural loans and government schemes
        </p>
      </div>

      {/* Emergency Alert */}
      <Alert className="mb-8 border-red-200 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Fraud Alert:</strong> If you've been scammed or suspect fraud, immediately contact: 
          <strong> Cyber Crime Helpline: 1930</strong> | <strong>Banking Ombudsman: 14448</strong>
        </AlertDescription>
      </Alert>

      {/* Trusted Banks Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <Building className="w-6 h-6 text-green-600" />
          Trusted Banks for Agricultural Loans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trustedBanks.map((bank, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{bank.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium">Available Schemes:</p>
                      <div className="flex flex-wrap gap-1">
                        {bank.schemes.map((scheme, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {scheme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(bank.website, '_blank')}
                        data-testid={`visit-bank-${index}`}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(`tel:${bank.helpline}`, '_self')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {bank.helpline}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Scam Awareness */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          Common Loan Scams to Avoid
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {scamWarnings.map((scam, index) => {
            const Icon = scam.icon;
            return (
              <Card key={index} className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Icon className="w-5 h-5" />
                    {scam.type}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 font-medium">{scam.warning}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold text-red-700">Red Flags:</p>
                    {scam.redFlags.map((flag, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <XCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{flag}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-green-800 font-medium">{scam.prevention}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Government Schemes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Government Schemes & Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {governmentSchemes.map((scheme, index) => (
            <Card key={index} className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-blue-700">{scheme.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{scheme.description}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold">Eligibility:</p>
                  <p className="text-xs text-muted-foreground">{scheme.eligibility}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(scheme.website, '_blank')}
                    data-testid={`visit-scheme-${index}`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Official Website
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`tel:${scheme.helpline}`, '_self')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Helpline: {scheme.helpline}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-green-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-green-800">Safe Borrowing Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">Verify Lender</h3>
            <p className="text-sm text-green-700">Always check RBI license and credentials</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">Read Documents</h3>
            <p className="text-sm text-green-700">Understand all terms and conditions</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">No Upfront Fees</h3>
            <p className="text-sm text-green-700">Legitimate lenders don't ask for advance payment</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">Compare Options</h3>
            <p className="text-sm text-green-700">Shop around for the best interest rates</p>
          </div>
        </div>
      </div>
    </div>
  );
}