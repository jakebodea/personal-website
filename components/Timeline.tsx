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
    <div className="relative">
      {/* Main Timeline Line - starts from first item */}
      <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-primary/60"></div>
      
      {items.map((item, index) => (
        <div key={index} className="relative pl-16 pb-12 group">
          {/* Timeline Dot */}
          <div className="absolute left-6 top-8 -translate-x-1/2 z-10">
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
          <div className="bg-white dark:bg-secondary border-2 border-primary/20 dark:border-primary/30 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-primary/40 dark:group-hover:border-primary/50">
            {/* Date */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground font-medium">
                {item.startDate} - 
              </span>
              {item.endDate === "Present" ? (
                <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                  Present
                </span>
              ) : (
                <span className="text-sm text-muted-foreground font-medium">
                  {item.endDate}
                </span>
              )}
            </div>

            {/* Header with Logo and Title */}
            <div className="flex items-start gap-4 mb-4">
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
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-primary mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 text-primary/70">
                  <span className="text-sm">@</span>
                  <span className="font-medium">{item.location}</span>
                </div>
              </div>
            </div>

            {/* Hover to expand indicator */}
            <div className="flex items-center justify-end mb-2">
              <div className="w-4 h-4 text-muted-foreground/50">
                <svg className="w-full h-full transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Description - Hidden by default, shown on hover */}
            <div className="overflow-hidden">
              <div className="max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out">
                <div className="pt-2 border-t border-border/30">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Supporting Media */}
            {item.supportingMedia && (
              <div className="mt-4 overflow-hidden">
                <div className="max-h-0 group-hover:max-h-96 transition-all duration-700 ease-in-out">
                  <div className="pt-4">
                    <Image 
                      src={item.supportingMedia} 
                      alt={item.title} 
                      width={300} 
                      height={200} 
                      className="rounded-lg border-2 border-border shadow-md" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* End Marker */}
      <div className="absolute left-6 -bottom-2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-sm"></div>
    </div>
  );
};

export default Timeline;
