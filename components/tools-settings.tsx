"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle } from "lucide-react"

interface Tool {
  id: string
  name: string
  description: string
  enabled: boolean
}

export function ToolsSettings() {
  const { toast } = useToast()
  const [tools, setTools] = useState<Tool[]>([
    { id: "1", name: "Web Search", description: "Search the web for information", enabled: true },
    { id: "2", name: "Calculator", description: "Perform mathematical calculations", enabled: true },
    { id: "3", name: "Code Interpreter", description: "Execute and explain code", enabled: false },
  ])
  const [newTool, setNewTool] = useState({ name: "", description: "" })

  const handleToggleTool = (id: string) => {
    setTools(tools.map((tool) => (tool.id === id ? { ...tool, enabled: !tool.enabled } : tool)))

    const tool = tools.find((t) => t.id === id)
    if (tool) {
      toast({
        title: tool.enabled ? "Tool disabled" : "Tool enabled",
        description: `${tool.name} has been ${tool.enabled ? "disabled" : "enabled"}`,
      })
    }
  }

  const handleAddTool = () => {
    if (!newTool.name) {
      toast({
        title: "Error",
        description: "Please provide a name for the tool",
        variant: "destructive",
      })
      return
    }

    const newId = Date.now().toString()
    setTools([...tools, { ...newTool, id: newId, enabled: true }])
    setNewTool({ name: "", description: "" })
    toast({
      title: "Tool added",
      description: `${newTool.name} has been added to your tools`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Tools</CardTitle>
          <CardDescription>Enable or disable tools for your chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-sm text-muted-foreground">{tool.description}</div>
                </div>
                <Switch
                  checked={tool.enabled}
                  onCheckedChange={() => handleToggleTool(tool.id)}
                  id={`tool-${tool.id}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Custom Tool</CardTitle>
          <CardDescription>Create your own custom tools for the chatbot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tool-name">Tool Name</Label>
              <Input
                id="tool-name"
                placeholder="File Browser"
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tool-description">Description</Label>
              <Input
                id="tool-description"
                placeholder="Browse and access local files"
                value={newTool.description}
                onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
              />
            </div>
            <Button onClick={handleAddTool} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Add Tool</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
