import { Chat } from "@/components/chat"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Settings, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { TerminalBall } from "@/components/terminal-ball"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Add warning banner for non-localhost environments */}
      <div className="bg-yellow-500/10 px-4 py-2 text-sm text-yellow-800 dark:text-yellow-300">
        <Alert variant="warning" className="border-yellow-500/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This app connects to a local LLM server at 127.0.0.1:11434. When running in a preview environment, it will
            use mock responses.
          </AlertDescription>
        </Alert>
      </div>

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
