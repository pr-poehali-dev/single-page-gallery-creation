import { useEffect, useState } from 'react';

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
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/7efcfd8f-f0f7-4f9a-8b34-c984973a3b0d.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/924f92bf-d970-40d0-af1d-e11478b2ea6d.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/f85e7320-bc01-4793-a6c8-6e831d50c789.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/dc79b578-6552-4b9b-91a1-0c40c97fefa8.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/67940a35-36f4-46f8-bf0a-c25788cab052.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/51d826aa-9063-4fb5-99ec-763bca48d8df.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/5f2a8fc1-41fb-4571-9fa4-e1cccd374fe3.jpg',
    'https://cdn.poehali.dev/projects/b923f0c5-418f-4dde-8b6a-dbf0308f24aa/files/abb6a4b2-2f0f-4ba5-b469-72d5a538d660.jpg',
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
      </div>
    </div>
  );
};

export default Index;
