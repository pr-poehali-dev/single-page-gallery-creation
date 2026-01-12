import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const id = element.getAttribute('data-animate');
        if (id && rect.top < window.innerHeight * 0.8) {
          setIsVisible(prev => ({ ...prev, [id]: true }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryImages = [
    'https://i.postimg.cc/D0pdWC4H/Screenshot-38.jpg',
    'https://i.postimg.cc/SR17XZzF/Screenshot-39.jpg',
    'https://i.postimg.cc/nrSYsdQJ/Screenshot-40.jpg',
    'https://i.postimg.cc/cCkMKD8G/Screenshot-41.jpg',
    'https://i.postimg.cc/1X7cgWNZ/Screenshot-42.jpg',
    'https://i.postimg.cc/59smktKv/Screenshot-43.jpg',
    'https://i.postimg.cc/FFTxnKCg/Screenshot-44.jpg',
    'https://i.postimg.cc/BZmCwv7x/Screenshot-46.jpg',
  ];

  const paymentMethods = [
    { 
      name: 'PayPal', 
      icon: 'Wallet', 
      color: 'from-blue-500 to-blue-600',
      address: 'your-paypal@email.com'
    },
    { 
      name: 'USDT', 
      icon: 'DollarSign', 
      color: 'from-green-500 to-green-600',
      address: 'TRC20: TYour...AddressHere'
    },
    { 
      name: 'BTC', 
      icon: 'Bitcoin', 
      color: 'from-orange-500 to-yellow-500',
      address: 'bc1qyour...bitcoinaddress'
    },
    { 
      name: 'Ethereum', 
      icon: 'Gem', 
      color: 'from-purple-500 to-indigo-600',
      address: '0xYour...EthereumAddress'
    },
  ];

  const pricingPlans = [
    { price: 12, videos: '1,000', popular: false },
    { price: 20, videos: '3,000', popular: true },
    { price: 30, videos: '5,500', popular: false },
    { price: 60, videos: '30,000', popular: false },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
      <div className="container mx-auto px-4 py-16">
        <div 
          data-animate="title"
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible['title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
            MEGA BEST 2026
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-light">500 GB</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              data-animate={`gallery-${index}`}
              className={`transition-all duration-700 delay-${index * 50} ${
                isVisible[`gallery-${index}`] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <div className="group relative overflow-hidden rounded-2xl aspect-square shadow-xl hover:shadow-2xl transition-all duration-500">
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        <div 
          data-animate="pricing"
          className={`max-w-7xl mx-auto mb-16 transition-all duration-700 ${
            isVisible['pricing'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-white/80 text-center mb-12">
            Select the perfect package for your needs
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative p-8 bg-white/10 backdrop-blur-lg border-2 hover:scale-105 transition-all duration-300 cursor-pointer ${
                  plan.popular ? 'border-yellow-400 shadow-2xl shadow-yellow-500/50' : 'border-white/20'
                } ${
                  selectedPlan === index ? 'ring-4 ring-white/50' : ''
                }`}
                onClick={() => setSelectedPlan(index)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                    POPULAR
                  </div>
                )}
                <div className="text-center">
                  <div className="mb-4">
                    <Icon name="Video" className="text-white mx-auto" size={40} />
                  </div>
                  <div className="text-5xl font-black text-white mb-2">
                    ${plan.price}
                  </div>
                  <div className="text-3xl font-bold text-white/90 mb-6">
                    {plan.videos}
                  </div>
                  <p className="text-white/70 text-sm">Videos</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {selectedPlan !== null && (
          <div 
            data-animate="payment"
            className={`max-w-4xl mx-auto transition-all duration-700 ${
              isVisible['payment'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <p className="text-white/70 text-lg mb-2">Selected Plan:</p>
                <div className="text-4xl font-black text-white">
                  ${pricingPlans[selectedPlan].price} - {pricingPlans[selectedPlan].videos} Videos
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                Choose Payment Method
              </h2>
              <p className="text-lg text-white/80 text-center mb-10">
                Select your preferred way to pay
              </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method, index) => (
                <Button
                  key={index}
                  size="lg"
                  onClick={() => setSelectedPayment(method.name)}
                  className={`bg-gradient-to-r ${method.color} hover:scale-105 text-white font-semibold py-8 text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0`}
                >
                  <Icon name={method.icon} className="mr-3" size={24} />
                  Pay with {method.name}
                </Button>
              ))}
            </div>

              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                  🔒 Secure payment • Instant delivery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900 to-pink-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedPayment && (
                <span className="flex items-center gap-2">
                  <Icon 
                    name={paymentMethods.find(m => m.name === selectedPayment)?.icon || 'Wallet'} 
                    size={28} 
                  />
                  Pay with {selectedPayment}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Send payment to the address below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
              <p className="text-sm text-white/60 mb-2">Payment Address:</p>
              <p className="font-mono text-sm break-all text-white">
                {selectedPayment && paymentMethods.find(m => m.name === selectedPayment)?.address}
              </p>
            </div>
            <Button
              onClick={() => {
                const address = paymentMethods.find(m => m.name === selectedPayment)?.address;
                if (address) copyToClipboard(address);
              }}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Icon name="Copy" className="mr-2" size={18} />
              Copy Address
            </Button>
            <div className="pt-4 text-center text-sm text-white/60">
              <p>After payment, contact us with your transaction ID</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;