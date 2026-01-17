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

const Index = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [visitors, setVisitors] = useState<number>(0);

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

  useEffect(() => {
    const storedCount = localStorage.getItem('visitorCount');
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    
    let currentCount = storedCount ? parseInt(storedCount) : 1500;
    
    if (!lastVisit || now - parseInt(lastVisit) > 30 * 60 * 1000) {
      currentCount = currentCount + 1;
      localStorage.setItem('visitorCount', currentCount.toString());
      localStorage.setItem('lastVisit', now.toString());
    }
    
    setVisitors(currentCount);
  }, []);

  const galleryImages = [
    'https://cdn.poehali.dev/files/Screenshot-38.jpg',
    'https://cdn.poehali.dev/files/Screenshot-39.jpg',
    'https://cdn.poehali.dev/files/Screenshot-40.jpg',
    'https://cdn.poehali.dev/files/Screenshot-42.jpg',
    'https://cdn.poehali.dev/files/Screenshot-43.jpg',
    'https://cdn.poehali.dev/files/Screenshot-47.jpg',
    'https://cdn.poehali.dev/files/Screenshot_5.png',
    'https://cdn.poehali.dev/files/Screenshot_4.png',
  ];

  const paymentMethods = [
    { 
      name: 'PayPal', 
      icon: 'Wallet', 
      color: 'from-blue-500 to-blue-600',
      address: 'zoid.ketevan@gmail.com',
      label: 'PayPal Email',
      note: 'Use family and friend'
    },
    { 
      name: 'BTC', 
      icon: 'Bitcoin', 
      color: 'from-orange-500 to-yellow-500',
      address: 'bc1qz6fgwwv56r7evq3dfylhdqpn27lj4dcs5gdfk3',
      label: 'BTC Address'
    },
    { 
      name: 'ETH', 
      icon: 'Gem', 
      color: 'from-purple-500 to-indigo-500',
      address: '0xB7f25E58E0C86eC79eCeEcd23B1C5EC9bf1eED09',
      label: 'ETH Address'
    },
    { 
      name: 'LTC', 
      icon: 'Coins', 
      color: 'from-gray-400 to-gray-600',
      address: 'ltc1qws5rgzs7m4m6u30ww3a36edr9s6cw6c3h0wdex',
      label: 'LTC Address'
    },
  ];

  const plans = [
    {
      name: 'Basic',
      storage: '100 GB',
      price: '$5',
      features: ['500 GB Storage', 'Basic Support', '10 GB Transfer'],
      popular: false
    },
    {
      name: 'Pro',
      storage: '500 GB',
      price: '$15',
      features: ['500 GB Storage', 'Priority Support', '100 GB Transfer', 'Advanced Features'],
      popular: true
    },
    {
      name: 'Enterprise',
      storage: '2 TB',
      price: '$45',
      features: ['2 TB Storage', '24/7 Support', 'Unlimited Transfer', 'All Features', 'Custom Domain'],
      popular: false
    },
  ];

  const reviews = [
    { name: 'Sarah M.', plan: 'Pro Plan', rating: 5, text: 'Amazing service! Fast and reliable. Worth every penny!', date: '2 days ago' },
    { name: 'John D.', plan: 'Enterprise', rating: 5, text: 'Best cloud storage I have ever used. Customer support is top-notch.', date: '1 week ago' },
    { name: 'Emily R.', plan: 'Basic Plan', rating: 4, text: 'Great value for money. Simple and easy to use interface.', date: '3 days ago' },
    { name: 'Michael B.', plan: 'Pro Plan', rating: 5, text: 'Switched from competitors and never looked back. Highly recommended!', date: '5 days ago' },
    { name: 'Lisa K.', plan: 'Enterprise', rating: 5, text: 'Perfect for my business needs. Secure and professional service.', date: '1 day ago' },
    { name: 'David W.', plan: 'Pro Plan', rating: 5, text: 'Outstanding performance and reliability. Customer service is excellent!', date: '4 days ago' },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div 
          data-animate="title"
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible['title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
            MEGA BEST 2026
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light">500 GB</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-7xl mx-auto mb-12 md:mb-16">
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 md:mb-4">
            Choose Your Plan
          </h2>
          <p className="text-base sm:text-xl text-white/80 text-center mb-4 md:mb-6">
            Select the perfect package for your needs
          </p>
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/30 flex items-center gap-2">
              <Icon name="Users" className="text-white" size={18} />
              <span className="text-white font-bold text-sm sm:text-base">
                {visitors.toLocaleString()} happy customers
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-white via-purple-50 to-pink-50 border-4 border-yellow-400 shadow-2xl' 
                    : 'bg-white/95 backdrop-blur-lg border border-white/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold rounded-bl-xl">
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div className="p-4 sm:p-8">
                  <h3 className="text-2xl sm:text-3xl font-black mb-2 text-gray-900">{plan.name}</h3>
                  <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 sm:mb-6">
                    {plan.price}
                    <span className="text-base sm:text-xl text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                        <Icon name="Check" className="text-green-500 shrink-0" size={20} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => setSelectedPlan(index)}
                    className={`w-full text-sm sm:text-lg font-bold py-4 sm:py-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    Get Started
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {selectedPlan !== null && (
          <div 
            data-animate="payment"
            className={`max-w-5xl mx-auto mb-16 transition-all duration-700 ${
              isVisible['payment'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Card className="bg-white/95 backdrop-blur-lg border-2 border-white/40 p-4 sm:p-8 shadow-2xl">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Choose Payment Method</h2>
              <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8">
                Selected Plan: <span className="font-bold text-purple-600">{plans[selectedPlan].name}</span> - {plans[selectedPlan].price}/month
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {paymentMethods.map((method) => (
                  <button
                    key={method.name}
                    onClick={() => setSelectedPayment(method.name)}
                    className={`p-3 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedPayment === method.name
                        ? 'border-purple-600 bg-purple-50 scale-105 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                      <Icon name={method.icon as any} className="text-white" size={24} />
                    </div>
                    <div className="font-bold text-xs sm:text-base text-gray-900">{method.name}</div>
                  </button>
                ))}
              </div>

              {selectedPayment && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl border-2 border-purple-200">
                  {paymentMethods.find(m => m.name === selectedPayment)?.note && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 sm:p-4 mb-4 rounded">
                      <p className="text-xs sm:text-sm text-yellow-800 font-semibold">
                        ⚠️ {paymentMethods.find(m => m.name === selectedPayment)?.note}
                      </p>
                    </div>
                  )}
                  <h3 className="font-bold text-base sm:text-xl text-gray-900 mb-3 sm:mb-4">
                    {paymentMethods.find(m => m.name === selectedPayment)?.label}
                  </h3>
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={paymentMethods.find(m => m.name === selectedPayment)?.address}
                      readOnly
                      className="flex-1 p-2 sm:p-4 border-2 border-purple-300 rounded-xl bg-white font-mono text-xs sm:text-base"
                    />
                    <Button
                      onClick={() => copyToClipboard(
                        paymentMethods.find(m => m.name === selectedPayment)?.address || '',
                        paymentMethods.find(m => m.name === selectedPayment)?.label || ''
                      )}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 sm:px-6"
                    >
                      <Icon name="Copy" size={20} />
                    </Button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                    💡 After payment, contact admin with your transaction ID
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        <div 
          data-animate="reviews"
          className={`max-w-7xl mx-auto mb-16 transition-all duration-700 ${
            isVisible['reviews'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 md:mb-4">
            Customer Reviews
          </h2>
          <p className="text-base sm:text-xl text-white/80 text-center mb-8 md:mb-12">
            What our customers say about us ⭐
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card
                key={index}
                className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-white text-lg">{review.name}</div>
                    <div className="text-white/60 text-sm">{review.plan}</div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="Star" className="text-yellow-400 fill-yellow-400" size={16} />
                    ))}
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-3 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Icon name="Clock" size={14} />
                  {review.date}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col gap-2 sm:gap-3">
        <Button
          onClick={() => window.open('https://t.me/tokare2', '_blank')}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <Icon name="Send" className="mr-1 sm:mr-2" size={18} />
          Contact Admin
        </Button>

        <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-white/30 text-white text-xs sm:text-sm font-semibold text-center shadow-lg">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Online Support</span>
          </div>
        </div>
      </div>

      <Dialog open={selectedPlan !== null} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Follow the payment instructions above to complete your subscription.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
