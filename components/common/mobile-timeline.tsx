"use client";

import Image from "@/components/common/site-image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

type Bullet = string | { text: string; paper?: string };

interface TimelineItem {
  startDate: string;
  endDate?: string;
  image: string;
  title: string;
  location: string;
  bullets: Bullet[];
}

interface MobileTimelineProps {
  items: TimelineItem[];
}

const isObjectBullet = (
  bullet: Bullet
): bullet is { text: string; paper?: string } =>
  Object.getPrototypeOf(bullet) !== String.prototype;

const timelineItemKey = (item: TimelineItem) =>
  `${item.startDate}-${item.title}-${item.location}`;

const bulletKey = (bullet: Bullet, index: number) =>
  isObjectBullet(bullet) ? `${bullet.text}-${index}` : `${bullet}-${index}`;

export const MobileTimeline = ({ items }: MobileTimelineProps) => (
  <div className="relative w-full">
    <div className="absolute bottom-0 left-3 top-8 w-0.5 bg-border" />

    {items.map((item) => (
      <div key={timelineItemKey(item)} className="relative pb-6 last:pb-0">
        <div className="absolute left-3 top-8 z-20 -translate-x-1/2">
          {item.endDate === "Present" ? (
            <div className="relative">
              <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-accent/30" />
              <div className="relative h-3 w-3 rounded-full border-2 border-accent bg-white shadow-lg">
                <div className="h-full w-full rounded-full bg-accent" />
              </div>
            </div>
          ) : (
            <div className="relative h-3 w-3 rounded-full shadow-lg">
              <div className="absolute inset-0 rounded-full bg-accent" />
              <div className="absolute inset-1 rounded-full bg-card" />
            </div>
          )}
        </div>

        <div className="ml-7 w-full max-w-full overflow-hidden">
          <Card>
            <CardHeader>
              <div className="px-1 pb-3 pt-1">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.startDate} -
                  </span>
                  {item.endDate === "Present" ? (
                    <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-white shadow-sm">
                      Present
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.endDate}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg border border-border bg-white shadow-sm">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="h-full w-full rounded-md object-contain p-1"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 break-words font-serif text-xl italic leading-tight text-foreground">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground">
                      <span className="break-words font-serif text-sm leading-tight">
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="px-1 pb-1 pt-0">
                <div className="border-t border-border/30 pt-3">
                  <ul className="list-disc space-y-1 pl-4 leading-relaxed text-muted-foreground">
                    {item.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletKey(bullet, bulletIndex)}
                        className="break-words text-sm leading-relaxed"
                      >
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
            </CardContent>
          </Card>
        </div>
      </div>
    ))}

    <div className="absolute -bottom-2 left-3 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-sm" />
  </div>
);
