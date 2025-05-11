import { Chat } from "@/components/chat"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Settings, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { TerminalBall } from "@/components/terminal-ball"


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Add warning banner for non-localhost environments */}
      
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">LocalLLM Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Chat />
      </main>

      {/* Add the magical terminal ball */}
      <TerminalBall />
    </div>
  )
}
