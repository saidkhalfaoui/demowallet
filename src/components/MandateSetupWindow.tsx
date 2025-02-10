
import { X, Building } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

interface MandateSetupWindowProps {
  onClose: () => void;
  onComplete: () => void;
}

const MandateSetupWindow = ({ onClose, onComplete }: MandateSetupWindowProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showBankList, setShowBankList] = useState(false);
  const { toast } = useToast();

  const banks = [
    { name: "Emirates NBD", logo: "/lovable-uploads/5ebaa0bf-8c67-417f-a820-30b9e5accdda.png" },
    { name: "Abu Dhabi Commercial Bank", logo: "/lovable-uploads/12dd1ad3-fa42-4c00-8235-48f81f6da286.png" },
    { name: "Dubai Islamic Bank", logo: "/lovable-uploads/b20af39f-5842-4bb4-9cd4-5eacdd5dbf67.png" },
    { name: "First Abu Dhabi Bank", logo: "/lovable-uploads/6ae1cae6-4d1b-4607-b173-7adea608f825.png" },
    { name: "Mashreq Bank", logo: "/lovable-uploads/6ae1cae6-4d1b-4607-b173-7adea608f825.png" },
  ];

  const handleBankSelect = (bankName: string) => {
    console.log('Selected bank:', bankName);
    setShowBankList(false);
    toast({
      title: "Bank Selected",
      description: `You selected ${bankName}. Proceeding with setup.`,
    });
    onComplete();
  };

  const handleContinue = () => {
    setShowBankList(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 m-4 max-w-lg w-full space-y-6 relative animate-in fade-in zoom-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        {!showBankList ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-900">Setup Variable Recurring Payment</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What is a VRP Mandate?</h3>
                <p className="text-blue-700">
                  A Variable Recurring Payment (VRP) mandate allows secure, automated payments from your account with flexible amounts.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Steps to complete:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Connect your bank account securely</li>
                  <li>Review and authorize the VRP mandate</li>
                  <li>Confirm the setup with your bank</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  You'll be redirected to your bank's secure website to complete this process.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Setting up..." : "Continue to Bank"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900">Select Your Bank</h2>
            <div className="grid grid-cols-1 gap-4">
              {banks.map((bank) => (
                <Button
                  key={bank.name}
                  variant="outline"
                  className="flex items-center gap-4 p-4 h-auto justify-start hover:bg-blue-50"
                  onClick={() => handleBankSelect(bank.name)}
                >
                  <img src={bank.logo} alt={bank.name} className="w-8 h-8 object-contain" />
                  <span className="text-blue-900">{bank.name}</span>
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowBankList(false)}
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MandateSetupWindow;
