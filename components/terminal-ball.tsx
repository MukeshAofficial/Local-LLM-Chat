"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Terminal, X, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTerminalStore } from "@/hooks/use-terminal"

interface TerminalBallProps {
  className?: string
}

export function TerminalBall({ className }: TerminalBallProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const { output, clearOutput, logToTerminal } = useTerminalStore()
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const ballRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    const terminalElement = document.getElementById("terminal-output")
    if (terminalElement) {
      terminalElement.scrollTop = terminalElement.scrollHeight
    }
  }, [output])

  // Handle mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return

      const newX = e.clientX - dragOffset.current.x
      const newY = e.clientY - dragOffset.current.y

      // Keep the ball within the viewport
      const maxX = window.innerWidth - (ballRef.current?.offsetWidth || 60)
      const maxY = window.innerHeight - (ballRef.current?.offsetHeight || 60)

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (ballRef.current) {
      isDragging.current = true
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    }
  }

  const handleBallClick = () => {
    if (!hasPermission) {
      if (window.confirm("Allow terminal output to be displayed?")) {
        setHasPermission(true)
        setIsOpen(true)
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const clearTerminal = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearOutput()
  }

  useEffect(() => {
    // Add initial terminal messages
    if (output.length === 0) {
      const hostname = window.location.hostname
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        clearOutput()
        setTimeout(() => {
          logToTerminal("Running in preview/production environment")
          logToTerminal("Local LLM server at 127.0.0.1:11434 won't be accessible")
          logToTerminal("Using mock response mode for demonstration")
          logToTerminal("To use with a real LLM server, run this app locally")
        }, 500)
      } else {
        clearOutput()
        setTimeout(() => {
          logToTerminal("Running on localhost")
          logToTerminal("Will attempt to connect to LLM server at 127.0.0.1:11434")
          logToTerminal("Make sure your local LLM server is running")
        }, 500)
      }
    }
  }, [clearOutput, logToTerminal, output.length])

  return (
    <div
      ref={ballRef}
      className={cn("fixed z-50 select-none", isOpen ? "cursor-move" : "cursor-pointer", className)}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging.current ? "none" : "all 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* The magical ball */}
      <div
        onClick={handleBallClick}
        className={cn(
          "flex items-center justify-center rounded-full shadow-lg",
          "bg-gradient-to-br from-purple-500 to-indigo-600",
          "border-2 border-purple-300 dark:border-purple-700",
          isOpen ? "opacity-100" : "opacity-80 hover:opacity-100",
          isOpen && isExpanded
            ? "w-[400px] h-[300px] rounded-xl"
            : isOpen
              ? "w-[250px] h-[200px] rounded-xl"
              : "w-12 h-12",
          "transition-all duration-300 ease-in-out",
        )}
      >
        {!isOpen && <Terminal className="h-6 w-6 text-white animate-pulse" />}

        {isOpen && (
          <div className="w-full h-full flex flex-col p-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <div className="text-xs font-mono text-white/80">Terminal Output</div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={clearTerminal}
                >
                  <X className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={toggleExpand}
                >
                  {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 rounded bg-black/50 p-2">
              <div id="terminal-output" className="font-mono text-xs text-green-400 whitespace-pre-wrap">
                {hasPermission && output.length === 0 && (
                  <div className="text-gray-500 italic">No terminal output yet</div>
                )}
                {hasPermission &&
                  output.map((line, i) => (
                    <div key={i} className="mb-1">
                      {line}
                    </div>
                  ))}
                <div className="h-4 w-2 inline-block bg-green-400 animate-pulse ml-1"></div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
