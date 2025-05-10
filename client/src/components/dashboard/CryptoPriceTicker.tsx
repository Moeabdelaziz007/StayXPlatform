import { useEffect, useState } from 'react';

interface CryptoPrice {
  btc: string;
  eth: string;
}

// This would normally fetch from a real API
const fetchCryptoPrices = async (): Promise<CryptoPrice> => {
  // Simulated API response with randomized prices (in a real app, this would be real data)
  return {
    btc: `$${(Math.random() * 5000 + 40000).toFixed(2)}`,
    eth: `$${(Math.random() * 300 + 2000).toFixed(2)}`
  };
};

const CryptoPriceTicker = () => {
  const [prices, setPrices] = useState<CryptoPrice>({
    btc: "$42,584.20",
    eth: "$2,253.86"
  });
  
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const newPrices = await fetchCryptoPrices();
        setPrices(newPrices);
      } catch (error) {
        console.error("Error fetching crypto prices", error);
      }
    };
    
    // Initial fetch
    fetchPrices();
    
    // Setup interval for updates (every 60 seconds)
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <i className="ri-bitcoin-line text-amber-500 mr-1.5"></i>
          <span>BTC</span>
        </div>
        <span>{prices.btc}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <i className="ri-ethereum-line text-purple-400 mr-1.5"></i>
          <span>ETH</span>
        </div>
        <span>{prices.eth}</span>
      </div>
    </div>
  );
};

export default CryptoPriceTicker;
