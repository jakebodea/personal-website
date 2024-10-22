import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function Home(): React.ReactNode {
  return (
    <div className="p-6 h-full">
      <Card className="w-full h-full flex flex-col">
        <CardContent className="flex-grow overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
              <Image
                src="/images/jake.jpeg"
                alt="Jake Bodea"
                width={150}
                height={150}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-4xl font-bold mb-2">Jake Bodea</h1>
                <p className="text-xl text-foreground">Director of AI | Data Scientist | Mathematics Graduate</p>
                <p className="text-foreground">Currently: Irvine, CA</p>
              </div>
            </div>
            <div className="space-y-6 text-lg">
              <p>
                Hi, I&apos;m Jake. an AI Director who loves to code, a data scientist passionate about machine learning, 
                and a mathematics graduate who enjoys solving complex problems.
              </p>
              <p>
                I specialize in developing AI solutions that streamline processes and drive innovation in the medical field. 
                My expertise spans machine learning, NLP, and computer vision.
              </p>
              <p>
                I enjoy creating intelligent software and implementing AI models for startups and established companies alike.
              </p>
              <p>
                Contact me for AI consulting, data science projects, or machine learning implementations on a contract basis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
