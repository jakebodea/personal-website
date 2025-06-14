import React from "react";
import Image from "next/image";

interface TimelineItem {
  startDate: string;
  endDate?: string;
  image: string;
  title: string;
  location: string;
  description: string;
  supportingMedia?: string;
  connectedToPrevious?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main Timeline Line - centered */}
      <div className="absolute left-1/2 -translate-x-0.5 top-8 bottom-0 w-0.5 bg-primary/60"></div>
      
      {items.map((item, index) => {
        const isLeft = index % 2 === 0;
        
        return (
          <div key={index} className={`relative pb-12 group flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
            {/* Timeline Dot */}
            <div className="absolute left-1/2 top-8 -translate-x-1/2 z-20">
              {item.endDate === "Present" ? (
                <div className="relative">
                  <div className="absolute inset-0 w-5 h-5 rounded-full bg-accent/30 animate-ping"></div>
                  <div className="w-5 h-5 rounded-full bg-white border-3 border-primary shadow-lg relative">
                    <div className="w-full h-full rounded-full bg-primary"></div>
                  </div>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full shadow-lg relative">
                  <div className="absolute inset-0 rounded-full bg-primary"></div>
                  <div className="absolute inset-1 rounded-full bg-card"></div>
                </div>
              )}
            </div>



            {/* Content Card */}
            <div className={`w-full max-w-lg ${isLeft ? 'mr-4 pr-4' : 'ml-4 pl-4'}`}>
              <div className="bg-contrast-light/50 backdrop-blur-sm border-2 border-primary/20 dark:border-primary/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-primary/40 dark:group-hover:border-primary/50">
                {/* Date */}
                <div className={`flex items-center gap-2 mb-4 ${isLeft ? 'justify-start' : 'justify-end'}`}>
                  <span className="text-sm text-muted-foreground font-medium">
                    {item.startDate} - 
                  </span>
                  {item.endDate === "Present" ? (
                    <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      Present
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground font-medium">
                      {item.endDate}
                    </span>
                  )}
                </div>

                {/* Header with Logo and Title */}
                <div className={`flex items-center gap-4 mb-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-white border-2 border-border shadow-md">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain rounded-lg p-2"
                      />
                    </div>
                  </div>
                  
                  <div className={`flex-1 min-w-0 ${isLeft ? 'text-left' : 'text-right'}`}>
                    <h3 className="text-3xl font-serif italic text-primary leading-none">
                      {item.title}
                    </h3>
                    <div className={`flex items-center text-primary/70 ${isLeft ? 'justify-start' : 'justify-end'}`}>
                      <span className="font-serif text-xl leading-none">{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description - Hidden by default, shown on hover */}
                <div className="overflow-hidden">
                  <div className="max-h-0 group-hover:max-h-48 transition-all duration-500 ease-in-out">
                    <div className="pt-3 border-t border-border/30">
                      <p className={`text-muted-foreground leading-relaxed text-sm ${isLeft ? 'text-left' : 'text-right'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Supporting Media */}
                {item.supportingMedia && (
                  <div className="mt-3 overflow-hidden">
                    <div className="max-h-0 group-hover:max-h-96 transition-all duration-700 ease-in-out">
                      <div className={`pt-3 ${isLeft ? 'text-left' : 'text-right'}`}>
                        <Image 
                          src={item.supportingMedia} 
                          alt={item.title} 
                          width={350} 
                          height={220} 
                          className="rounded-lg border-2 border-border shadow-md" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* End Marker */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-2 h-2 rounded-full bg-primary shadow-sm"></div>
    </div>
  );
};

export default Timeline;
