import { JakeChat } from "@/components/jake-chat/jake-chat"

export const metadata = {
  title: "chat",
  robots: {
    index: false,
    follow: false,
  },
}

export default function ChatPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <JakeChat />
    </div>
  )
}
