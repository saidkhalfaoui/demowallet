import { useState } from 'react';
import { Building, CreditCard, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface AddFundingSourceProps {
  onComplete: () => void;
}

const AddFundingSource = ({ onComplete }: AddFundingSourceProps) => {
  const [method, setMethod] = useState<'tink' | 'coinbase' | 'paypal' | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Funding Source Added",
      description: `Your ${method} account has been successfully connected.`,
    });
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="glass-card p-8 w-full max-w-md slide-up">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Add Funding Source</h2>
        
        {!method ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="p-8 flex flex-col items-center hover:bg-blue-700 transition-all"
              onClick={() => setMethod('tink')}
            >
              <Building className="w-8 h-8 mb-2" />
              <span>Tink</span>
              <span className="text-xs text-gray-300 mt-1">Bank Account</span>
            </Button>
            <Button
              variant="outline"
              className="p-8 flex flex-col items-center hover:bg-blue-700 transition-all"
              onClick={() => setMethod('coinbase')}
            >
              <CreditCard className="w-8 h-8 mb-2" />
              <span>Coinbase</span>
              <span className="text-xs text-gray-300 mt-1">Crypto Wallet</span>
            </Button>
            <Button
              variant="outline"
              className="p-8 flex flex-col items-center hover:bg-blue-700 transition-all"
              onClick={() => setMethod('paypal')}
            >
              <Wallet className="w-8 h-8 mb-2" />
              <span>PayPal</span>
              <span className="text-xs text-gray-300 mt-1">Digital Wallet</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {method === 'tink' && (
              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-white">Bank Name</Label>
                <Input id="bankName" placeholder="Select your bank" />
              </div>
            )}
            
            {method === 'coinbase' && (
              <div className="space-y-2">
                <Label htmlFor="walletAddress" className="text-white">Wallet Address</Label>
                <Input id="walletAddress" placeholder="Enter your Coinbase wallet address" />
              </div>
            )}
            
            {method === 'paypal' && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">PayPal Email</Label>
                <Input id="email" type="email" placeholder="Enter your PayPal email" />
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setMethod(null)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Connect {method?.charAt(0).toUpperCase() + method?.slice(1)}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddFundingSource;