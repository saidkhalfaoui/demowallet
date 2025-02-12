
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

const MandateSetupWindow = ({ onClose, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createUser = async () => {
    try {
      const response = await fetch('https://api.tink.com/api/v1/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer e5ca99078f154a58854f5505aebfc6ac',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          external_user_id: `user_${Date.now()}`,
          market: 'GB',
          locale: 'en_US'
        })
      });
      
      if (!response.ok) throw new Error('Failed to create Tink user');
      return await response.json();
    } catch (error) {
      console.error('Error creating Tink user:', error);
      throw error;
    }
  };

  const createConsent = async (userId) => {
    try {
      const response = await fetch('https://api.tink.com/api/v1/consent/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer e5ca99078f154a58854f5505aebfc6ac',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          user_id: userId,
          scope: ['payment:read', 'payment:write'],
          market: 'GB'
        })
      });

      if (!response.ok) throw new Error('Failed to create consent');
      return await response.json();
    } catch (error) {
      console.error('Error creating consent:', error);
      throw error;
    }
  };

  const getAuthorizationCode = async (userId, consentId) => {
    try {
      const response = await fetch('https://api.tink.com/api/v1/oauth/authorization-grant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer e5ca99078f154a58854f5505aebfc6ac',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          user_id: userId,
          consent_id: consentId,
          scope: ['payment:read', 'payment:write']
        })
      });

      if (!response.ok) throw new Error('Failed to get authorization code');
      return await response.json();
    } catch (error) {
      console.error('Error getting authorization code:', error);
      throw error;
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Step 1: Create Tink user
      const { user_id } = await createUser();
      console.log('Created user:', user_id);

      // Step 2: Create consent
      const { id: consentId } = await createConsent(user_id);
      console.log('Created consent:', consentId);

      // Step 3: Get authorization code
      const { code: authorizationCode } = await getAuthorizationCode(user_id, consentId);
      console.log('Got authorization code:', authorizationCode);

      // Step 4: Open Tink link with the generated parameters
      const tinkUrl = `https://link.tink.com/1.0/pay/vrp-mandate?client_id=e5ca99078f154a58854f5505aebfc6ac&consent_id=${consentId}&authorization_code=${authorizationCode}&redirect_uri=fingerpay://callback`;
      window.open(tinkUrl, '_blank');
      onComplete();
    } catch (error) {
      console.error('Error in Tink setup flow:', error);
      toast({
        title: "Error",
        description: "Failed to setup VRP mandate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
      </div>
    </div>
  );
};

export default MandateSetupWindow;
