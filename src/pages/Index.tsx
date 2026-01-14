import { useEffect, useState, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  image?: string;
}

const Index = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [visitors, setVisitors] = useState<number>(0);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: 'Hello! I\'m the admin. How can I help you today?',
      sender: 'admin',
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    const currentCount = storedCount ? parseInt(storedCount) : 0;
    const newCount = currentCount + 1;
    localStorage.setItem('visitorCount', newCount.toString());
    setVisitors(newCount);
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
      address: 'zoid.ketevan@gmail.com',
      label: 'PayPal Email'
    },
    { 
      name: 'BTC', 
      icon: 'Bitcoin', 
      color: 'from-orange-500 to-yellow-500',
      address: '1LHwjpMPtuhzNjUp6nXMXaFmu5EGinvWNY',
      label: 'Bitcoin Address'
    },
    { 
      name: 'USDT', 
      icon: 'DollarSign', 
      color: 'from-green-500 to-green-600',
      address: 'TXHWYwxR2Exj9MCn1wCLTfhi8sMvKUN1bj',
      label: 'USDT Address (TRC20)'
    },
    { 
      name: 'Ethereum', 
      icon: 'Gem', 
      color: 'from-purple-500 to-indigo-600',
      address: '0xYour...EthereumAddress',
      label: 'Ethereum Address'
    }
  ];

  const pricingPlans = [
    { price: 12, videos: '1,000', popular: false },
    { price: 20, videos: '3,000', popular: true },
    { price: 30, videos: '5,500', popular: false },
    { price: 60, videos: '30,000', popular: false },
  ];

  const cryptoDonations = [
    { donor: 'Anonymous', amount: '$10', currency: 'USDT', icon: 'DollarSign', color: 'from-green-500 to-green-600' },
    { donor: 'CryptoFan23', amount: '$20', currency: 'Bitcoin', icon: 'Bitcoin', color: 'from-orange-500 to-yellow-500' },
    { donor: 'Whale_Investor', amount: '$30', currency: 'Ethereum', icon: 'Gem', color: 'from-purple-500 to-indigo-600' },
    { donor: 'BTC_Lover', amount: '$60', currency: 'Bitcoin', icon: 'Bitcoin', color: 'from-orange-500 to-yellow-500' },
    { donor: 'Generous_User', amount: '$20', currency: 'USDT', icon: 'DollarSign', color: 'from-green-500 to-green-600' },
    { donor: 'EthereumFan', amount: '$30', currency: 'Ethereum', icon: 'Gem', color: 'from-purple-500 to-indigo-600' },
    { donor: 'Supporter_101', amount: '$10', currency: 'Bitcoin', icon: 'Bitcoin', color: 'from-orange-500 to-yellow-500' },
    { donor: 'BigDonor', amount: '$60', currency: 'USDT', icon: 'DollarSign', color: 'from-green-500 to-green-600' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const message: ChatMessage = {
          id: messages.length + 1,
          text: 'Sent an image',
          sender: 'user',
          timestamp: new Date(),
          image: reader.result as string,
        };
        setMessages([...messages, message]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      };
      reader.readAsDataURL(file);
    }
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

        <div 
          data-animate="donations"
          className={`max-w-7xl mx-auto mb-16 transition-all duration-700 ${
            isVisible['donations'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Recent Crypto Donations
          </h2>
          <p className="text-xl text-white/80 text-center mb-12">
            Thank you to our supporters! 💎
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptoDonations.map((donation, index) => (
              <Card
                key={index}
                className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${donation.color}`}>
                    <Icon name={donation.icon} className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-lg">{donation.donor}</div>
                    <div className="text-white/70 text-sm">{donation.currency}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-white text-xl">{donation.amount}</div>
                  </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
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

      <div className="fixed bottom-6 left-6 z-50">
        {!chatOpen ? (
          <Button
            onClick={() => setChatOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full w-16 h-16 p-0"
          >
            <Icon name="MessageCircle" size={28} />
          </Button>
        ) : (
          <Card className="w-96 h-[500px] bg-white/95 backdrop-blur-lg border-2 border-white/30 shadow-2xl flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="User" className="text-white" size={24} />
                </div>
                <div>
                  <div className="font-bold text-white">Admin</div>
                  <div className="text-xs text-white/70 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Online
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setChatOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="bg-purple-100 border-l-4 border-purple-600 p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Pin" size={14} className="text-purple-600" />
                  <span className="font-semibold text-sm text-purple-900">Pinned Message</span>
                </div>
                <p className="text-sm text-purple-800">
                  Welcome! Send your transaction ID after payment. We'll verify it within 5 minutes.
                </p>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Uploaded"
                        className="rounded-lg mb-2 max-w-full"
                      />
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <Icon name="Image" size={20} />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          onClick={() => window.open('https://t.me/tokare2', '_blank')}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <Icon name="Send" className="mr-2" size={20} />
          Contact Admin
        </Button>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-3 shadow-xl">
          <div className="flex items-center gap-2 text-white">
            <Icon name="Users" size={20} />
            <div className="text-sm">
              <div className="font-semibold">{visitors.toLocaleString()}</div>
              <div className="text-xs text-white/60">Visitors</div>
            </div>
          </div>
        </div>
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
              <p className="text-sm text-white/60 mb-2">
                {selectedPayment && paymentMethods.find(m => m.name === selectedPayment)?.label}
              </p>
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
            <div className="pt-4 space-y-3">
              <div className="text-center text-sm text-white/60">
                <p>After payment, contact admin with your transaction ID</p>
              </div>
              <Button
                onClick={() => window.open('https://t.me/tokare2', '_blank')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold"
              >
                <Icon name="Send" className="mr-2" size={18} />
                Contact Admin on Telegram
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;