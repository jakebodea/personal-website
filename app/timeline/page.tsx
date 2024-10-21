import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Timeline from "@/components/Timeline";

const timelineItems = [
  {
    startDate: "October 2024",
    endDate: "Present",
    image: "/images/stanford_scpd.jpeg",
    title: "Course Facilitator @ SCPD",
    description: "Started as a course facilitator for the XCS229: Machine Learning course at Stanford Center for Professional Development."
  },
  {
    startDate: "August 2024",
    endDate: "Present",
    image: "/images/ventris.png",
    title: "Director of AI @ Ventris Medical",
    description: "Leading the development of AI solutions for Ventris Medical.",
  },
  {
    startDate: "March 2024",
    endDate: "Present",
    image: "/images/stanford.png",
    title: "NDO Student @ Stanford University",
    description: "Pursuing Graduate Certificate in AI",
  },
  {
    startDate: "January 2023",
    endDate: "August 2024",
    image: "/images/beckman.png",
    title: "Data Scientist @ Beckman Coulter",
    description: "Data Scientist",
  },
  {
    startDate: "June 2022",
    endDate: "January 2023",
    image: "/images/beckman.png",
    title: "AI Intern @ Beckman Coulter",
    description: "AI Intern",
  },
  {
    startDate: "August 2019",
    endDate: "December 2022",
    image: "/images/concordia.png",
    title: "Student @ Concordia University",
    description: "Graduated with a Bachelor of Arts in Mathematics, with minors in Computer Science, Business Data Analytics, and Music. GPA 3.94",
  },
];

export default function TimelinePage(): React.ReactNode {
  return (
    <div className="p-6 h-full">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-primary font-normal">Timeline of Experiences</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <div className="h-full overflow-y-auto pr-4">
            <span className="text-secondary mb-4 block">An attempt to chronicle my experiences and projects over the years in an approximate linear timeline, with some overlaps.</span>
            <Timeline items={timelineItems} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
