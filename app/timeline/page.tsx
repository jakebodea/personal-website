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
    title: "Course Facilitator",
    location: "SCPD",
    description: "Started as a course facilitator for the XCS229: Machine Learning course at Stanford Center for Professional Development."
  },
  {
    startDate: "August 2024",
    endDate: "Present",
    image: "/images/ventris.png",
    title: "Director of AI",
    location: "Ventris Medical",
    description: "Ventris Medical is a small medical device company that makes bone grafts for spinal fusion surgeries. As the Director of AI, I'm responsible for developing AI solutions for the company.",
  },
  {
    startDate: "March 2024",
    endDate: "Present",
    image: "/images/stanford.png",
    title: "NDO Student",
    location: "Stanford University",
    description: "Pursuing Graduate Certificate in AI",
    supportingMedia: "/images/stanford.png",
  },
  {
    startDate: "January 2023",
    endDate: "August 2024",
    image: "/images/beckman.png",
    title: "Data Scientist",
    location: "Beckman Coulter",
    description: "Data Scientist",
  },
  {
    startDate: "June 2022",
    endDate: "January 2023",
    image: "/images/beckman.png",
    title: "AI Intern",
    location: "Beckman Coulter",
    description: "AI Intern",
    connectedToPrevious: true,
  },
  {
    startDate: "August 2019",
    endDate: "December 2022",
    image: "/images/concordia.png",
    title: "Student",
    location: "Concordia University",
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
            <span className="text-secondary font-light mb-4 block">An attempt to document my experiences over the years in an approximate linear timeline, with some overlaps.</span>
            <Timeline items={timelineItems} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
