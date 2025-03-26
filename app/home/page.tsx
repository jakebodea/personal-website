// "use client";

import React from "react";
// import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: 'Home',
  description: 'Jake Bodea\'s home page'
}

export default function Home(): React.ReactNode {
  return (
    <div className="p-6 h-full">
      <Card className="w-full h-full flex flex-col">
        <CardContent className="flex-grow overflow-auto p-12">
          <div className="flex flex-col justify-start mt-12 mb-12">
            {/* <Image
              src="/images/jake.jpeg"
              alt="Jake Bodea"
              width={250}
              height={250}
              className="rounded-full shadow-lg"
            /> */}
            <p className="text-primary font-light text-6xl leading-tight">
              I&apos;m Jake, a mathematician and musician turned AI and Computer Science professional.
            </p>
          </div>
          <div className="flex flex-col justify-start mt-12 mb-12 text-3xl font-extralight leading-tight gap-6">
            <p>
              I enjoy exploring new ideas and experimenting with quick projects to assess their potential. My interests extend to music, where I'm intrigued by the intersection of music and AI, and I'm passionate about side projects in this area. 
              Outside of work, I serve at Agape Christian Church of Orange County and am a fan of soccer, supporting FC Barcelona. I'm always on the lookout for opportunities to collaborate on creative ventures, so feel free to reach out if you share similar interests!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
