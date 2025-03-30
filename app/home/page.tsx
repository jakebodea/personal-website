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
            <p className="text-primary font-light text-5xl leading-tight mb-8">
              I&apos;m Jake, a mathematician and musician turned <span className="italic font-normal">ML Engineer</span> & <span className="italic font-normal">Full-Stack Developer</span>.
            </p>
          </div>
          <div className="flex flex-col justify-start mt-12 mb-12 text-2xl font-extralight leading-relaxed gap-6">
            <p>
              I specialize in building intelligent applications, leveraging a strong foundation in <strong className="font-normal">Python, SQL, and JavaScript</strong>. My experience spans the full stack, from crafting user-friendly web interfaces to developing robust backend systems and even native iOS applications. I thrive on bringing ideas to life through code, with a particular passion for the rapidly evolving field of <strong className="font-normal">Artificial Intelligence</strong>.
            </p>
            <p>
              I enjoy exploring new technologies and rapidly prototyping projects. You can see some of my work and consistent activity on my GitHub profile, linked in the sidebar. My interests also include the intersection of music and AI, leading to various side projects in that space.
            </p>
            <p>
              Outside of technology, I serve at Agape Christian Church of Orange County and am an avid soccer fan (Força Barça!). I&apos;m always open to collaborating on creative and challenging projects, so feel free to reach out!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
