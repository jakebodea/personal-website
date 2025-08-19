"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface TimelineItem {
  startDate: string;
  endDate?: string;
  image: string;
  title: string;
  location: string;
  bullets: string[];
}

interface MobileTimelineProps {
  items: TimelineItem[];
}

const MobileTimeline: React.FC<MobileTimelineProps> = ({ items }) => {
  return (
    <div className="relative w-full">
      {/* Left-aligned Timeline Line */}
      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-primary/60"></div>
      
      {items.map((item, index) => {
        return (
          <div key={index} className="relative pb-6 last:pb-0">
            {/* Timeline Dot */}
            <div className="absolute left-3 top-8 -translate-x-1/2 z-20">
              {item.endDate === "Present" ? (
                <div className="relative">
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-accent/30 animate-ping"></div>
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-primary shadow-lg relative">
                    <div className="w-full h-full rounded-full bg-primary"></div>
                  </div>
                </div>
              ) : (
                <div className="w-3 h-3 rounded-full shadow-lg relative">
                  <div className="absolute inset-0 rounded-full bg-primary"></div>
                  <div className="absolute inset-1 rounded-full bg-card"></div>
                </div>
              )}
            </div>

            {/* Content Card */}
            <div className="ml-7 w-full max-w-full overflow-hidden">
              <Card className="backdrop-blur-sm border border-primary/20 dark:border-primary/30 shadow-md bg-contrast-light/50">
                <CardHeader className="pb-3 px-4 pt-4">
                  {/* Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-muted-foreground font-medium">
                      {item.startDate} - 
                    </span>
                    {item.endDate === "Present" ? (
                      <span className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                        Present
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground font-medium">
                        {item.endDate}
                      </span>
                    )}
                  </div>

                  {/* Header with Logo and Title */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-white border border-border shadow-sm">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain rounded-md p-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-serif italic text-primary leading-tight mb-1 break-words">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-primary/70">
                        <span className="font-serif text-sm leading-tight break-words">{item.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-4 pb-4">
                  {/* Bullets - Always visible on mobile for better UX */}
                  <div className="border-t border-border/30 pt-3">
                    <ul className="list-disc pl-4 text-muted-foreground leading-relaxed space-y-1">
                      {item.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="text-sm leading-relaxed break-words">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}
      
      {/* End Marker */}
      <div className="absolute left-3 -translate-x-1/2 -bottom-2 w-2 h-2 rounded-full bg-primary shadow-sm"></div>
    </div>
  );
};

export default MobileTimeline;
