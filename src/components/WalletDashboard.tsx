import { Wallet, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";

const WalletDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="glass-card p-6 slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">My Wallet</h2>
            <Wallet className="text-blue-200" />
          </div>
          <div className="bg-blue-800 rounded-xl p-6 mb-4">
            <p className="text-blue-200 text-sm">Available Balance</p>
            <p className="text-white text-3xl font-bold">$1,250.00</p>
          </div>
          <div className="flex items-center justify-between text-blue-200">
            <div className="flex items-center">
              <CreditCard className="mr-2" />
              <span>••••4582</span>
            </div>
            <ShieldCheck className="text-green-400" />
          </div>
        </div>

        <div className="glass-card p-6 slide-up">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <CreditCard className="mb-2" />
              Send Money
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <ShieldCheck className="mb-2" />
              Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;