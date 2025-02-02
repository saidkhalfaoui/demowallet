import { CheckCircle } from "lucide-react";

const CallbackScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="text-center space-y-4">
        <CheckCircle className="w-24 h-24 text-green-400 mx-auto animate-bounce" />
        <h2 className="text-2xl font-bold text-white">Ready to tap</h2>
      </div>
    </div>
  );
};

export default CallbackScreen;