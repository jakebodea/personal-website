"use client";

import Image from "@/components/common/site-image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { MobileTimeline } from "./mobile-timeline";

type Bullet = string | { text: string; paper?: string };

interface TimelineItem {
  startDate: string;
  endDate?: string;
  image: string;
  title: string;
  location: string;
  bullets: Bullet[];
}

interface TimelineProps {
  items: TimelineItem[];
}

const JUSTIFY_START = "justify-start";
const JUSTIFY_END = "justify-end";

const isObjectBullet = (
  bullet: Bullet
): bullet is { text: string; paper?: string } =>
  Object.getPrototypeOf(bullet) !== String.prototype;

const timelineItemKey = (item: TimelineItem) =>
  `${item.startDate}-${item.title}-${item.location}`;

const bulletKey = (bullet: Bullet, index: number) =>
  isObjectBullet(bullet) ? `${bullet.text}-${index}` : `${bullet}-${index}`;

export const Timeline = ({ items }: TimelineProps) => (
  <>
    <div className="overflow-hidden md:hidden">
      <MobileTimeline items={items} />
    </div>

    <div className="relative mx-auto hidden max-w-6xl md:block">
      <div className="absolute bottom-0 left-1/2 top-8 w-0.5 -translate-x-0.5 bg-border" />

      {items.map((item, index) => {
        const isLeft = index % 2 === 0;

        return (
          <div
            key={timelineItemKey(item)}
            className={`group relative flex items-center pb-12 ${isLeft ? JUSTIFY_START : JUSTIFY_END}`}
          >
            <div className="absolute left-1/2 top-8 z-20 -translate-x-1/2">
              {item.endDate === "Present" ? (
                <div className="relative">
                  <div className="absolute inset-0 h-5 w-5 animate-ping rounded-full bg-accent/30" />
                  <div className="border-3 relative h-5 w-5 rounded-full border-primary bg-white shadow-lg">
                    <div className="h-full w-full rounded-full bg-primary" />
                  </div>
                </div>
              ) : (
                <div className="relative h-5 w-5 rounded-full shadow-lg">
                  <div className="absolute inset-0 rounded-full bg-primary" />
                  <div className="absolute inset-1 rounded-full bg-card" />
                </div>
              )}
            </div>

            <div
              className={`w-full max-w-lg ${isLeft ? "mr-4 pr-4" : "ml-4 pl-4"}`}
            >
              <Card className="bg-contrast-light/50 border-2 border-border shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl group-hover:border-muted-foreground/30">
                <CardHeader className="pb-3">
                  <div
                    className={`mb-4 flex items-center gap-2 ${isLeft ? JUSTIFY_START : JUSTIFY_END}`}
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.startDate} -
                    </span>
                    {item.endDate === "Present" ? (
                      <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                        Present
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.endDate}
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-4 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-xl border-2 border-border bg-white shadow-md">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="h-full w-full rounded-lg object-contain p-2"
                        />
                      </div>
                    </div>

                    <div
                      className={`min-w-0 flex-1 ${isLeft ? "text-left" : "text-right"}`}
                    >
                      <h3 className="font-serif text-3xl italic leading-none text-foreground">
                        {item.title}
                      </h3>
                      <div
                        className={`flex items-center text-muted-foreground ${isLeft ? JUSTIFY_START : JUSTIFY_END}`}
                      >
                        <span className="font-serif text-xl leading-none">
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="overflow-hidden">
                    <div className="max-h-0 transition-[max-height] duration-500 ease-in-out group-hover:max-h-[1000px]">
                      <div className="border-t border-border/30 pt-3">
                        <ul className="list-disc pl-5 text-sm leading-relaxed text-muted-foreground">
                          {item.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletKey(bullet, bulletIndex)}>
                              {isObjectBullet(bullet) ? bullet.text : bullet}
                              {isObjectBullet(bullet) &&
                              bullet.paper !== undefined &&
                              bullet.paper !== "" ? (
                                <ul className="mt-0.5 list-disc pl-5">
                                  <li>
                                    <a
                                      href={bullet.paper}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline transition-colors hover:text-foreground"
                                    >
                                      research paper
                                    </a>
                                  </li>
                                </ul>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}

      <div className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-sm" />
    </div>
  </>
);
