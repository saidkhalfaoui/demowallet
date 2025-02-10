
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import MandateSetupWindow from './MandateSetupWindow';
import { Building } from 'lucide-react';

interface AddFundingSourceProps {
  onComplete: () => void;
}

const AddFundingSource = ({ onComplete }: AddFundingSourceProps) => {
  const [method, setMethod] = useState<'tink' | 'coinbase' | 'paypal' | null>(null);
  const [showMandateSetup, setShowMandateSetup] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    console.log('Handling form submission for method:', method);
    e.preventDefault();
    toast({
      title: "Funding Source Added",
      description: `Your ${method} account has been successfully connected.`,
    });
    console.log('Form submission complete, calling onComplete callback');
    onComplete();
  };

  const handleTinkClick = () => {
    console.log('Opening mandate setup window...');
    setShowMandateSetup(true);
  };

  const handleMandateComplete = () => {
    setShowMandateSetup(false);
    toast({
      title: "VRP Setup Initiated",
      description: "Please complete the process in your bank's website",
    });
  };

  console.log('Current selected method:', method);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 w-full max-w-md slide-up">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Let's Connect your Wallet</h2>
        
        {!method ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-32 p-4 flex flex-col items-center justify-center bg-white hover:bg-blue-50 border-blue-200 transition-all"
              onClick={handleTinkClick}
            >
              <Building className="w-16 h-16 text-blue-600" />
              <span className="mt-2 text-sm text-blue-600">Bank Account</span>
            </Button>
            <Button
              variant="outline"
              className="h-32 p-4 flex flex-col items-center justify-center bg-white hover:bg-blue-50 border-blue-200 transition-all"
              onClick={() => {
                console.log('Selected Coinbase method');
                setMethod('coinbase');
              }}
            >
              <img 
                src="/lovable-uploads/5281bc9f-75dc-4993-b617-58f483631369.png" 
                alt="Coinbase Logo" 
                className="w-32 object-contain"
              />
            </Button>
            <Button
              variant="outline"
              className="h-32 p-4 flex flex-col items-center justify-center bg-white hover:bg-blue-50 border-blue-200 transition-all"
              onClick={() => {
                console.log('Selected PayPal method');
                setMethod('paypal');
              }}
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
                <Label htmlFor="walletAddress" className="text-blue-900">Wallet Address</Label>
                <Input 
                  id="walletAddress" 
                  placeholder="Enter your Coinbase wallet address" 
                  className="bg-white border-blue-200 text-blue-900 placeholder-blue-400"
                />
              </div>
            )}
            
            {method === 'paypal' && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-900">PayPal Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your PayPal email"
                  className="bg-white border-blue-200 text-blue-900 placeholder-blue-400"
                />
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  console.log('Returning to method selection');
                  setMethod(null);
                }} 
                className="flex-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-900"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Connect {method?.charAt(0).toUpperCase() + method?.slice(1)}
              </Button>
            </div>
          </form>
        )}

        {/* Mandate Setup Window */}
        {showMandateSetup && (
          <MandateSetupWindow
            onClose={() => setShowMandateSetup(false)}
            onComplete={handleMandateComplete}
          />
        )}
      </div>
    </div>
  );
};

export default AddFundingSource;
