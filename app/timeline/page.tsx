import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Timeline from "@/components/Timeline";

export const metadata = {
  title: 'Timeline',
  description: 'Jake Bodea\'s timeline of experiences'
}

const timelineItems = [
  {
    startDate: "November 2024",
    endDate: "Present",
    image: "/images/taxrise.jpeg",
    title: "Machine Learning Engineer",
    location: "TaxRise",
    description: "As a Machine Learning Engineer in the engineering team at TaxRise, I'm responsible for pushing full stack AI/ML solutions to automate and improve company processes."
  },
  {
    startDate: "October 2024",
    endDate: "Present",
    image: "/images/stanford_scpd.jpeg",
    title: "Course Facilitator",
    location: "Stanford University",
    description: "Course Facilitator for XCS221: Principles and Techniques in Artificial Intelligence and XCS229: Machine Learning at Stanford University Center for Global & Online Education (CGOE).",
  },
  {
    startDate: "August 2024",
    endDate: "November 2024",
    image: "/images/ventris.png",
    title: "Lead AI Engineer",
    location: "Ventris Medical",
    description: "Ventris Medical is a small medical device company that makes bone grafts for spinal fusion surgeries. As the Lead AI Engineer, I'm responsible for developing AI solutions for the company, from web apps to iOS apps to vendor negotiations.",
  },
  {
    startDate: "March 2024",
    endDate: "Present",
    image: "/images/stanford.png",
    title: "NDO Student",
    location: "Stanford University",
    description: "Pursuing Graduate Certificate in AI. GPA 4.0, with courses CS229: Machine Learning and CS221: Principles and Techniques in Artificial Intelligence.",
  },
  {
    startDate: "January 2023",
    endDate: "August 2024",
    image: "/images/beckman.png",
    title: "Data Scientist",
    location: "Beckman Coulter",
    description: "Led the AI Operations team as Scrum Master, delivering internal AI solutions including automated vision inspection models, an LLM chatbot with RAG capabilities, and an ML-powered ticket agent that reduced manual ticket creation by 20%.",
  },
  {
    startDate: "June 2022",
    endDate: "January 2023",
    image: "/images/beckman.png",
    title: "AI Intern",
    location: "Beckman Coulter",
    description: "Developed a predictive ML model to enhance employee retention, automated cloud cost forecasts, streamlined hardware documentation with PowerBI, and collaborated with IT to reduce technical debt, cutting supported applications by 10%.",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">
            Professional Timeline
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
            A chronological journey through my career experiences, from student to AI engineer.
          </p>
        </div>

        {/* Timeline Content */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="scrollbar-thin">
              <Timeline items={timelineItems} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
