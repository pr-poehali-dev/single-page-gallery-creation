import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
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
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/7efcfd8f-f0f7-4f9a-8b34-c984973a3b0d.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/924f92bf-d970-40d0-af1d-e11478b2ea6d.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/f85e7320-bc01-4793-a6c8-6e831d50c789.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/7efcfd8f-f0f7-4f9a-8b34-c984973a3b0d.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/924f92bf-d970-40d0-af1d-e11478b2ea6d.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/f85e7320-bc01-4793-a6c8-6e831d50c789.jpg',
  ];

  const services = [
    {
      icon: 'Sparkles',
      title: 'Creative Design',
      description: 'Transform your vision into stunning visual experiences that captivate your audience'
    },
    {
      icon: 'Rocket',
      title: 'Fast Delivery',
      description: 'Quick turnaround without compromising quality, meeting your deadlines every time'
    },
    {
      icon: 'Target',
      title: 'Strategic Planning',
      description: 'Data-driven strategies tailored to achieve your specific business goals'
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div 
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            Elevate Your
            <span className="block bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Business Today
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-light max-w-2xl mx-auto">
            Premium services that deliver exceptional results and drive meaningful growth
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            Get Started
            <Icon name="ArrowRight" className="ml-2" size={20} />
          </Button>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" className="text-white" size={40} />
        </div>
      </div>

      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="services-title"
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible['services-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-gray-600">Excellence in every detail</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                data-animate={`service-${index}`}
                className={`transition-all duration-700 delay-${index * 100} ${
                  isVisible[`service-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon name={service.icon} className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="gallery-title"
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible['gallery-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              Our Gallery
            </h2>
            <p className="text-xl text-white/90">Showcasing excellence and creativity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-xl font-bold mb-1">Project {index + 1}</h4>
                      <p className="text-sm text-white/80">Creative Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div 
            data-animate="contact-title"
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible['contact-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Let's Work Together
            </h2>
            <p className="text-xl text-gray-400">Ready to elevate your business?</p>
          </div>

          <div
            data-animate="contact-form"
            className={`transition-all duration-700 delay-200 ${
              isVisible['contact-form'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Card className="p-8 md:p-12 bg-gray-800 border-gray-700">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <Input 
                      placeholder="Your name" 
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us about your project..." 
                    rows={6}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
                >
                  Send Message
                  <Icon name="Send" className="ml-2" size={18} />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 bg-black text-center">
        <p className="text-gray-400">
          © 2026 Your Business. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
