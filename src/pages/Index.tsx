import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

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
    { name: 'PayPal', icon: 'Wallet', color: 'from-blue-500 to-blue-600' },
    { name: 'USDT', icon: 'DollarSign', color: 'from-green-500 to-green-600' },
    { name: 'BTC', icon: 'Bitcoin', color: 'from-orange-500 to-yellow-500' },
    { name: 'Ethereum', icon: 'Gem', color: 'from-purple-500 to-indigo-600' },
  ];

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
          data-animate="payment"
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            isVisible['payment'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
              Purchase Now
            </h2>
            <p className="text-xl text-white/80 text-center mb-10">
              Choose your preferred payment method
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method, index) => (
                <Button
                  key={index}
                  size="lg"
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
      </div>
    </div>
  );
};

export default Index;