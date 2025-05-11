"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { ChatMessage } from "@/types/chat"
import { useToast } from "@/hooks/use-toast"
import { useTerminal } from "@/hooks/use-terminal"

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { logToTerminal } = useTerminal()

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content: input,
      }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      logToTerminal(`User message: ${input}`)
      logToTerminal("Sending request to LLM server...")

      try {
        // Try to call the local LLM server
        logToTerminal("POST http://127.0.0.1:11434/api/generate")

        // Use a timeout to prevent hanging if the server is unreachable
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        try {
          const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama3",
              prompt: input,
              stream: false,
            }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            logToTerminal(`Error: Server returned ${response.status}`)
            throw new Error(`Server returned ${response.status}`)
          }

          logToTerminal("Response received from server")
          const data = await response.json()
          logToTerminal(`Generated ${data.response?.length || 0} characters of text`)

          // Add AI response
          const aiMessage: ChatMessage = {
            role: "assistant",
            content: data.response || "I couldn't generate a response. Please try again.",
          }

          setMessages((prev) => [...prev, aiMessage])
          return
        } catch (fetchError) {
          clearTimeout(timeoutId)
          logToTerminal(`Fetch error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)

          // If we're in a preview/production environment, use mock mode
          if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
            logToTerminal("Using mock response mode (not on localhost)")

            // Generate a mock response
            const mockResponses = [
              "I'm running in mock mode since I can't access your local LLM server. In a real setup, I would connect to your server at 127.0.0.1:11434.",
              "This is a simulated response. When running locally, I'll connect to your LLM server. In this preview environment, I'm using mock data instead.",
              "I notice we're in a preview environment where I can't access your local LLM. I'm providing this mock response instead. On your local machine, I'll connect properly to 127.0.0.1:11434.",
            ]

            // Simulate a delay to mimic processing time
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]

            const aiMessage: ChatMessage = {
              role: "assistant",
              content: mockResponse,
            }

            setMessages((prev) => [...prev, aiMessage])
            logToTerminal("Generated mock response")
            return
          }

          // If we're on localhost but still can't connect, rethrow the error
          throw fetchError
        }
      } catch (error) {
        console.error("Error:", error)
        logToTerminal(`Connection error: ${error instanceof Error ? error.message : String(error)}`)

        toast({
          title: "Connection Error",
          description: "Failed to connect to the LLM server at 127.0.0.1:11434. Make sure your server is running.",
          variant: "destructive",
        })

        // Add error message
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I'm having trouble connecting to the LLM server. Please check that your local server is running at 127.0.0.1:11434. If you're viewing this in a preview environment, you'll need to run the app locally to connect to your LLM server.",
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
        logToTerminal("Request completed")
      }
    },
    [input, isLoading, toast, logToTerminal],
  )

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  }
}
