"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Trash, Upload, Download } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface MCPServer {
  command: string
  args: string[]
  env: Record<string, string>
}

interface MCPConfig {
  servers: Record<string, MCPServer>
}

export function ModelSettings() {
  const { toast } = useToast()
  const [mcpConfig, setMcpConfig] = useState<MCPConfig>({
    servers: {
      browserbase: {
        command: "npx",
        args: ["@browserbasehq/mcp-server-browserbase"],
        env: {
          BROWSERBASE_API_KEY: "bb_live_9bzo4KqCejugcs0uhDBlazNESqs",
          BROWSERBASE_PROJECT_ID: "961175f7-115d-4094-9b91-74f52f2997f5",
        },
      },
    },
  })

  const [activeServer, setActiveServer] = useState<string>("browserbase")
  const [jsonInput, setJsonInput] = useState<string>("")
  const [newServerName, setNewServerName] = useState<string>("")
  const [newEnvKey, setNewEnvKey] = useState<string>("")
  const [newEnvValue, setNewEnvValue] = useState<string>("")

  const handleAddServer = () => {
    if (!newServerName) {
      toast({
        title: "Error",
        description: "Please provide a name for the server",
        variant: "destructive",
      })
      return
    }

    setMcpConfig((prev) => ({
      ...prev,
      servers: {
        ...prev.servers,
        [newServerName]: {
          command: "npx",
          args: [],
          env: {},
        },
      },
    }))

    setNewServerName("")
    toast({
      title: "Server added",
      description: `${newServerName} has been added to your MCP servers`,
    })
  }

  const handleRemoveServer = (serverName: string) => {
    const newServers = { ...mcpConfig.servers }
    delete newServers[serverName]

    setMcpConfig((prev) => ({
      ...prev,
      servers: newServers,
    }))

    if (activeServer === serverName) {
      setActiveServer(Object.keys(newServers)[0] || "")
    }

    toast({
      title: "Server removed",
      description: `${serverName} has been removed from your MCP servers`,
    })
  }

  const handleAddEnvVar = (serverName: string) => {
    if (!newEnvKey) {
      toast({
        title: "Error",
        description: "Please provide an environment variable name",
        variant: "destructive",
      })
      return
    }

    setMcpConfig((prev) => ({
      ...prev,
      servers: {
        ...prev.servers,
        [serverName]: {
          ...prev.servers[serverName],
          env: {
            ...prev.servers[serverName].env,
            [newEnvKey]: newEnvValue,
          },
        },
      },
    }))

    setNewEnvKey("")
    setNewEnvValue("")
    toast({
      title: "Environment variable added",
      description: `${newEnvKey} has been added to ${serverName}`,
    })
  }

  const handleRemoveEnvVar = (serverName: string, envKey: string) => {
    const newEnv = { ...mcpConfig.servers[serverName].env }
    delete newEnv[envKey]

    setMcpConfig((prev) => ({
      ...prev,
      servers: {
        ...prev.servers,
        [serverName]: {
          ...prev.servers[serverName],
          env: newEnv,
        },
      },
    }))

    toast({
      title: "Environment variable removed",
      description: `${envKey} has been removed from ${serverName}`,
    })
  }

  const handleUpdateCommand = (serverName: string, command: string) => {
    setMcpConfig((prev) => ({
      ...prev,
      servers: {
        ...prev.servers,
        [serverName]: {
          ...prev.servers[serverName],
          command,
        },
      },
    }))
  }

  const handleUpdateArgs = (serverName: string, argsString: string) => {
    const args = argsString.split(" ").filter((arg) => arg.trim() !== "")

    setMcpConfig((prev) => ({
      ...prev,
      servers: {
        ...prev.servers,
        [serverName]: {
          ...prev.servers[serverName],
          args,
        },
      },
    }))
  }

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      if (!parsed.servers) {
        throw new Error("Invalid MCP configuration: missing 'servers' property")
      }

      setMcpConfig(parsed)
      setActiveServer(Object.keys(parsed.servers)[0] || "")
      toast({
        title: "Import successful",
        description: "MCP configuration has been imported",
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Invalid JSON format",
        variant: "destructive",
      })
    }
  }

  const handleExportJson = () => {
    const jsonString = JSON.stringify({ mcp: mcpConfig }, null, 4)
    navigator.clipboard.writeText(jsonString)
    toast({
      title: "Export successful",
      description: "MCP configuration has been copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Context Protocol (MCP) Servers</CardTitle>
          <CardDescription>Configure your MCP servers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="server-name">New Server Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="server-name"
                    placeholder="my-server"
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddServer}>Add Server</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import/Export Configuration</CardTitle>
          <CardDescription>Import or export your MCP configuration as JSON</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder='{"servers": {"myserver": {"command": "npx", "args": ["..."], "env": {"KEY": "VALUE"}}}}'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="font-mono text-sm"
              rows={5}
            />
            <div className="flex gap-2">
              <Button onClick={handleImportJson} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Import</span>
              </Button>
              <Button onClick={handleExportJson} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(mcpConfig.servers).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configured Servers</CardTitle>
            <CardDescription>Select a server to configure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={activeServer} onValueChange={setActiveServer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a server" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(mcpConfig.servers).map((serverName) => (
                    <SelectItem key={serverName} value={serverName}>
                      {serverName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {activeServer && (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{activeServer}</h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveServer(activeServer)}
                      disabled={Object.keys(mcpConfig.servers).length <= 1}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="command">Command</Label>
                    <Input
                      id="command"
                      value={mcpConfig.servers[activeServer].command}
                      onChange={(e) => handleUpdateCommand(activeServer, e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="args">Arguments (space separated)</Label>
                    <Input
                      id="args"
                      value={mcpConfig.servers[activeServer].args.join(" ")}
                      onChange={(e) => handleUpdateArgs(activeServer, e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Environment Variables</Label>
                    <div className="mt-2 space-y-2">
                      {Object.entries(mcpConfig.servers[activeServer].env).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 rounded-md border p-2">
                          <div className="flex-1">
                            <div className="font-medium">{key}</div>
                            <div className="text-sm text-muted-foreground">{value}</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveEnvVar(activeServer, key)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="env-key">Environment Variable Key</Label>
                      <Input
                        id="env-key"
                        placeholder="API_KEY"
                        value={newEnvKey}
                        onChange={(e) => setNewEnvKey(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="env-value">Environment Variable Value</Label>
                      <Input
                        id="env-value"
                        placeholder="your-api-key"
                        value={newEnvValue}
                        onChange={(e) => setNewEnvValue(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleAddEnvVar(activeServer)}>Add Environment Variable</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Model Settings</CardTitle>
          <CardDescription>Configure the model parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="model">Model</Label>
              <Select defaultValue="llama3">
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3">Llama 3</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                  <SelectItem value="gemma">Gemma</SelectItem>
                  <SelectItem value="phi3">Phi-3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="temperature">Temperature</Label>
              <div className="flex items-center gap-2">
                <Input id="temperature" type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full" />
                <span className="w-8 text-center">0.7</span>
              </div>
            </div>
            <div>
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <Input id="max-tokens" type="number" defaultValue="2048" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
