import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Server, Wrench } from "lucide-react"
import Link from "next/link"
import { ModelSettings } from "@/components/model-settings"
import { ToolsSettings } from "@/components/tools-settings"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="model">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="model" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Model & Servers</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            <span>Tools</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="model">
          <ModelSettings />
        </TabsContent>
        <TabsContent value="tools">
          <ToolsSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
