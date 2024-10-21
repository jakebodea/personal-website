import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EventsPage(): React.ReactNode {
  return (
    <div className="p-6 h-full">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-primary font-normal">Events</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">Hello World</CardContent>
      </Card>
    </div>
  )
}
