import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: 'Projects',
  description: 'Jake Bodea\'s projects'
}

export default function ProjectsPage(): React.ReactNode {
  return (
    <div className="p-6 h-full">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-primary font-normal text-3xl">Projects</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">This page is under construction...</CardContent>
      </Card>
    </div>
  )
}
