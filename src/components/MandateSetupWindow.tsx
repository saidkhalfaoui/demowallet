
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface MandateSetupWindowProps {
  onClose: () => void;
  onComplete: () => void;
}

const MandateSetupWindow = ({ onClose, onComplete }: MandateSetupWindowProps) => {
  const handleContinue = () => {
    window.open(`https://link.tink.com/1.0/pay/vrp-mandate?client_id=e5ca99078f154a58854f5505aebfc6ac&consent_id=f0d14e90-a7de-4e4c-bfea-8343cd7c3dfc&authorization_code=242a504a8f9b4a029ea40270e8b68c92&redirect_uri=fingerpay://callback`, '_blank');
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 m-4 max-w-lg w-full space-y-6 relative animate-in fade-in zoom-in">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-blue-900">Setup Variable Recurring Payment</h2>
          
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
                <li>Connect your bank account securely through Tink</li>
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
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Continue to Bank
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandateSetupWindow;
