import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Coins, Gift, Users, History, Wallet, 
  TrendingUp, Star, Plus, Minus, Clock, CheckCircle,
  Copy, Share, QrCode, ShoppingCart
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackButton from "../BackButton";

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface Referral {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'completed' | 'expired';
  reward: number;
  date: string;
}

export default function QuickFixWallet() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState("QFIX12345");
  const [newReferralPhone, setNewReferralPhone] = useState("");

  // Mock data - replace with actual API calls
  useEffect(() => {
    setBalance(150.50);
    setCoins(1250);
    
    setTransactions([
      {
        id: "1",
        type: "debit",
        amount: 250,
        description: "Plumbing service payment",
        date: "2024-01-15",
        status: "completed"
      },
      {
        id: "2",
        type: "credit",
        amount: 400,
        description: "Referral bonus - John completed a job",
        date: "2024-01-14",
        status: "completed"
      },
      {
        id: "3",
        type: "credit",
        amount: 25,
        description: "Cashback from electrical service",
        date: "2024-01-13",
        status: "completed"
      }
    ]);

    setReferrals([
      {
        id: "1",
        name: "John Doe",
        phone: "+91 98765 43210",
        status: "completed",
        reward: 400,
        date: "2024-01-14"
      },
      {
        id: "2",
        name: "Jane Smith",
        phone: "+91 87654 32109",
        status: "pending",
        reward: 400,
        date: "2024-01-15"
      }
    ]);
  }, []);

  const handleAddMoney = () => {
    toast.success("Redirecting to payment gateway...");
    // Implement payment gateway integration
  };

  const handleUseCoinsForPayment = () => {
    toast.success("QuickFix Coins selected as payment method!");
    // Navigate back to payment selection or booking
    navigate("/customer/book-service", { 
      state: { paymentMethod: 'quickfix_coins', availableCoins: coins } 
    });
  };

  const handleUseForProducts = () => {
    toast.info("Redirecting to products section...");
    navigate("/customer/products");
  };

  const handleWithdraw = () => {
    toast.info("Withdrawal feature coming soon!");
  };

  const copyReferralCode = () => {
    const referralLink = `https://quickfix.app/invite/${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const shareReferralCode = () => {
    const referralLink = `https://quickfix.app/invite/${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join QuickFix',
        text: `Use my referral code ${referralCode} and get 400 coins when you complete your first job!`,
        url: referralLink
      });
    } else {
      copyReferralCode();
    }
  };

  const sendReferral = () => {
    if (!newReferralPhone.trim()) {
      toast.error("Please enter a phone number");
      return;
    }
    
    const referralLink = `https://quickfix.app/invite/${referralCode}`;
    const message = `Hi! Join QuickFix using my referral link: ${referralLink} and get 400 coins when you complete your first job!`;
    
    // Send via WhatsApp
    const whatsappUrl = `https://wa.me/${newReferralPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    const newReferral: Referral = {
      id: Date.now().toString(),
      name: "Pending User",
      phone: newReferralPhone,
      status: "pending",
      reward: 400,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReferrals([...referrals, newReferral]);
    setNewReferralPhone("");
    toast.success("Referral link sent via WhatsApp!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <Minus className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pb-10 animate-fade-in">
      <div className="mb-4">
        <BackButton withLabel />
      </div>
      
      <h1 className="text-2xl font-bold mb-6">QuickFix Wallet</h1>
      
      {/* Balance Card */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Wallet className="w-6 h-6 mr-2" />
            <span className="text-lg font-semibold">Total Balance</span>
          </div>
          <div className="text-3xl font-bold mb-4">₹{balance.toFixed(2)}</div>
          
          <div className="flex items-center justify-center mb-4">
            <Coins className="w-5 h-5 mr-2 text-yellow-300" />
            <span className="text-lg">{coins} Coins</span>
            <span className="text-sm ml-2 opacity-80">(₹{(coins / 10).toFixed(2)})</span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleAddMoney} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button variant="outline" size="sm" onClick={handleUseCoinsForPayment} className="flex-1 text-white border-white hover:bg-white hover:text-purple-600">
              <Coins className="w-4 h-4 mr-2" />
              Use Coins
            </Button>
            <Button variant="outline" size="sm" onClick={handleUseForProducts} className="flex-1 text-white border-white hover:bg-white hover:text-purple-600">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Products
            </Button>
          </div>
        </div>
      </Card>

      {/* Earning Opportunities */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
          Earn More Coins
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-green-600">
            <Gift className="w-4 h-4 mr-2" />
            <span>Earn 400 coins when referral completes a job</span>
          </div>
          <div className="flex items-center text-blue-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Get 1% back as coins for online payments</span>
          </div>
          <div className="flex items-center text-purple-600">
            <Star className="w-4 h-4 mr-2" />
            <span>Get 1000 coins when bill reaches ₹5000</span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="referrals">
            <Users className="w-4 h-4 mr-2" />
            Referrals
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Wallet className="w-4 h-4 mr-2" />
            Manage
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-4">
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(transaction.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="referrals" className="mt-4">
          <div className="space-y-4">
            {/* Referral Code Section */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Your Referral Link</h3>
              <div className="flex items-center gap-2 mb-3">
                <Input 
                  value={`https://quickfix.app/invite/${referralCode}`} 
                  readOnly 
                  className="flex-1 text-xs" 
                />
                <Button size="sm" variant="outline" onClick={copyReferralCode}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={shareReferralCode}>
                  <Share className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-600">Share this link with friends and earn 400 coins when they complete their first job!</p>
            </Card>

            {/* Send Referral */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Invite a Friend via WhatsApp</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter phone number with country code"
                  value={newReferralPhone}
                  onChange={(e) => setNewReferralPhone(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={sendReferral}>Send</Button>
              </div>
            </Card>

            {/* Referral List */}
            <div className="space-y-3">
              {referrals.map((referral) => (
                <Card key={referral.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{referral.name}</p>
                      <p className="text-xs text-gray-500">{referral.phone}</p>
                      <p className="text-xs text-gray-500">{referral.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        {getStatusIcon(referral.status)}
                        <span className="ml-1 text-xs capitalize">{referral.status}</span>
                      </div>
                      <p className="text-sm font-semibold text-green-600">
                        +{referral.reward} coins
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="manage" className="mt-4">
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Convert Coins</h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded text-sm">
                  <p className="font-medium">Exchange Rate</p>
                  <p>10 coins = ₹1 (service charges only)</p>
                </div>
                <Button variant="outline" className="w-full">
                  Convert Coins to Balance
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Payment Methods</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Add UPI ID
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Add Bank Account
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Add Card
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Settings</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Transaction Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Auto-reload Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download Statement
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
