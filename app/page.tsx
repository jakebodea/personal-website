import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home(): React.ReactNode {
  return (
    <div className="p-6 h-full">
      <Card className="w-full h-full flex justify-center items-center">
        <CardHeader>
          <CardTitle>Hello World</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add your content here */}
        </CardContent>
      </Card>
    </div>
  )
}
