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
              I&apos;m Jake, a mathematician turned AI and Computer Science professional.
              I&apos;m also a musician.
            </p>
          </div>
          <div className="flex flex-col justify-start mt-12 mb-12 text-3xl font-extralight leading-tight gap-6">
            <p>
              I like to dream about the future, and how both <span className="italic font-light">I</span> and <span className="italic font-light">AI</span> can shape it.
              My interests are wide, and I&apos;m always looking for my next challenge. Thus far, I&apos;ve been focusing my work on AI&apos;s role in healthcare.
              My most recent position is as the <span className="font-light">Director of AI</span> at Ventris Medical, a small medical device company working
              focusing on innovation in the realm of spinal surgeries. I&apos;m excited to see what the future holds!
            </p>
            <p>
              I&apos;ve been spending my free time learning about web development (hence this website!) app development, and the intersection of music and ML.
              I&apos;m always looking for my next challenge, so if you&apos;re interested in collaborating, please reach out!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
