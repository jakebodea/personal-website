import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: 'Events',
  description: 'Jake Bodea\'s events'
}

export default function EventsPage(): React.ReactNode {
  return (
    <div className="p-6 h-full">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-primary font-normal">Events</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">This page is under construction...</CardContent>
      </Card>
    </div>
  )
}
