import { useState } from 'react';
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

  const handleTinkClick = () => {
    // Redirect to Tink's VRP mandate page
    window.location.href = 'https://link.tink.com/1.0/pay/vrp-mandate/?client_id=e5ca99078f154a58854f5505aebfc6ac&redirect_uri=https%3A%2F%2Flovable.dev%2Fprojects%2Ffb91051d-9e4d-4510-aeeb-63638d3a9575%2Fcallback&market=GB&locale=en_US';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="glass-card p-8 w-full max-w-md slide-up">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Connect to Your Money</h2>
        
        {!method ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-32 p-4 flex flex-col items-center justify-center hover:bg-blue-700 transition-all"
              onClick={handleTinkClick}
            >
              <img 
                src="/lovable-uploads/6ae1cae6-4d1b-4607-b173-7adea608f825.png" 
                alt="Tink Logo" 
                className="w-16 h-16 object-contain"
              />
            </Button>
            <Button
              variant="outline"
              className="h-32 p-4 flex flex-col items-center justify-center hover:bg-blue-700 transition-all"
              onClick={() => setMethod('coinbase')}
            >
              <img 
                src="/lovable-uploads/5281bc9f-75dc-4993-b617-58f483631369.png" 
                alt="Coinbase Logo" 
                className="w-32 object-contain"
              />
            </Button>
            <Button
              variant="outline"
              className="h-32 p-4 flex flex-col items-center justify-center hover:bg-blue-700 transition-all"
              onClick={() => setMethod('paypal')}
            >
              <img 
                src="/lovable-uploads/248c64b9-c58f-469b-b111-47880f0f85fe.png" 
                alt="PayPal Logo" 
                className="w-12 h-12 object-contain"
              />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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