import { useState } from 'react';
import { CreditCard, Building } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface AddFundingSourceProps {
  onComplete: () => void;
}

const AddFundingSource = ({ onComplete }: AddFundingSourceProps) => {
  const [method, setMethod] = useState<'card' | 'bank' | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Funding Source Added",
      description: "Your payment method has been successfully added.",
    });
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="glass-card p-8 w-full max-w-md slide-up">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Add Funding Source</h2>
        
        {!method ? (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="p-8 flex flex-col items-center hover:bg-blue-700"
              onClick={() => setMethod('card')}
            >
              <CreditCard className="w-8 h-8 mb-2" />
              <span>Credit Card</span>
            </Button>
            <Button
              variant="outline"
              className="p-8 flex flex-col items-center hover:bg-blue-700"
              onClick={() => setMethod('bank')}
            >
              <Building className="w-8 h-8 mb-2" />
              <span>Bank Account</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {method === 'card' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-white">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber" className="text-white">Routing Number</Label>
                  <Input id="routingNumber" placeholder="123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-white">Account Number</Label>
                  <Input id="accountNumber" placeholder="1234567890" />
                </div>
              </>
            )}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setMethod(null)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Add {method === 'card' ? 'Card' : 'Bank'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddFundingSource;