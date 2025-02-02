import { useState } from 'react';
import { Fingerprint } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AuthScreenProps {
  onAuthenticate: () => void;
}

const AuthScreen = ({ onAuthenticate }: AuthScreenProps) => {
  const [authenticating, setAuthenticating] = useState(false);
  const { toast } = useToast();

  const handleAuth = async () => {
    setAuthenticating(true);
    // Simulate fingerprint authentication
    setTimeout(() => {
      setAuthenticating(false);
      toast({
        title: "Authentication Successful",
        description: "Welcome back to your wallet!",
      });
      onAuthenticate();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="glass-card p-8 w-full max-w-md mx-4 slide-up">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-6">Digital Wallet</h1>
          <div className="mb-8">
            <Button
              variant="outline"
              size="lg"
              className="w-32 h-32 rounded-full bg-blue-800 hover:bg-blue-700 border-2 border-blue-400"
              onClick={handleAuth}
              disabled={authenticating}
            >
              <Fingerprint className={`w-24 h-24 text-blue-200 ${authenticating ? 'animate-pulse' : ''}`} />
            </Button>
            <p className="text-blue-200 mt-4">
              {authenticating ? 'Authenticating...' : 'Touch to unlock'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;