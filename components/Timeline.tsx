import React from "react";
import Image from "next/image";

interface TimelineItem {
  startDate: string;
  endDate?: string;
  image: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
      {items.map((item, index) => (
        <div key={index} className="relative flex items-center mb-12 last:mb-0">
          <div className="flex-1 mr-8 text-right">
            <p className="text-sm text-muted-foreground">
              {item.startDate} {item.endDate && `- ${item.endDate}`}
            </p>
          </div>
          <div className="w-24 h-24 rounded-full bg-white z-10 flex items-center justify-center border-2 border-gray-200 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.title}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1 ml-8">
            <h3 className="text-lg text-primary font-semibold">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
