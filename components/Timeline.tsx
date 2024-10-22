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
      <div className="absolute left-1/4 top-12 bottom-12 w-0.5 bg-gray-200"></div>
      {items.map((item, index) => (
        <div key={index} className={`relative flex pb-6 pt-6 last:mb-0 items-center ${index !== 0 ? !item.connectedToPrevious ? 'border-t' : '' : ''}`}>
          <div className="w-1/4 flex justify-end pr-16">
            <div className="text-right flex justify-center gap-1">
              {item.endDate === "Present" 
              ? 
              <>
                <p className="text-sm text-muted-foreground">{item.startDate} - </p> 
                <p className="text-sm text-black font-normal bg-yellow-200 px-1 rounded-sm"> Present</p>
              </>
              : <p className="text-sm text-muted-foreground">{item.startDate} - {item.endDate}</p>}
            </div>
          </div>
          {item.connectedToPrevious ? (
            <div className="w-24 h-24 flex items-center justify-center -ml-12">
              <span className="text-4xl text-gray-200 ml-0.5">-</span>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-white z-10 flex items-center justify-center border-2 border-gray-200 flex-shrink-0 -ml-12">
              <Image
                src={item.image}
                alt={item.title}
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 ml-8">
            <div className="flex gap-2 items-center text-lg">
              <h3 className="text-primary font-normal">{item.title}</h3>
              <h4 className="text-primary font-light text-xs mb-0.5">@</h4>
              <h4 className="text-primary font-light">{item.location}</h4>
            </div>
            <p className="text-muted-foreground font-normal">{item.description}</p>
            {item.supportingMedia && <Image src={item.supportingMedia} alt={item.title} width={120} height={120} className="rounded-md object-cover" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
