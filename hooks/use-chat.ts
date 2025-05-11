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

      const userInput = input; // Capture input before clearing
      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content: userInput,
      }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      // Add a placeholder for the assistant's message
      // We'll update this message instance as stream data comes in
      const assistantMessagePlaceholder: ChatMessage = {
        role: "assistant",
        content: "",
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessagePlaceholder])

      logToTerminal(`User message: ${userInput}`)
      logToTerminal("Sending request to LLM server (streaming)...")

      try {
        logToTerminal("POST http://127.0.0.1:11434/api/generate")

        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          logToTerminal("Request timed out.")
          controller.abort()
        }, 50000) // 50 second timeout

        const response = await fetch("http://127.0.0.1:11434/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistral:latest",
            prompt: userInput,
            stream: true, // ENABLE STREAMING
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          logToTerminal(`Error: Server returned ${response.status}`)
          // Remove the placeholder if the request fails early
          setMessages((prev) => prev.slice(0, -1))
          throw new Error(`Server returned ${response.status}`)
        }

        if (!response.body) {
          logToTerminal("Error: Response body is null.")
           // Remove the placeholder
          setMessages((prev) => prev.slice(0, -1))
          throw new Error("Response body is null")
        }

        logToTerminal("Response received, processing stream...")
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let streamEnded = false

        while (!streamEnded) {
          const { value, done } = await reader.read()
          if (done) {
            streamEnded = true
            logToTerminal("Stream ended by reader.")
            break
          }

          const chunk = decoder.decode(value, { stream: true }) // Important: {stream: true} for multi-byte chars
          const lines = chunk.split("\n").filter((line) => line.trim() !== "")

          for (const line of lines) {
            try {
              const parsedChunk = JSON.parse(line)
              if (parsedChunk.response) {
                setMessages((prevMessages) =>
                  prevMessages.map((msg, index) => {
                    if (index === prevMessages.length - 1 && msg.role === "assistant") {
                      return { ...msg, content: msg.content + parsedChunk.response }
                    }
                    return msg
                  })
                )
              }
              if (parsedChunk.done) {
                streamEnded = true
                logToTerminal("Stream complete (parsedChunk.done is true).")
                break // Break from for-loop, while loop condition will handle exit
              }
            } catch (error) {
              logToTerminal(`Error parsing streamed JSON line: "${line}" - ${error}`)
              // Continue to next line, or handle error more gracefully if needed
            }
          }
        }
        // No explicit return here, flow continues to finally
      } catch (fetchError) {
        clearTimeout(timeoutId) // Ensure timeout is cleared on any fetch-related error
        logToTerminal(`Fetch error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)

        // If an assistant placeholder was added, attempt to remove or update it with an error.
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length -1];
          if(lastMessage && lastMessage.role === 'assistant' && lastMessage.content === "") {
            // If it's the empty placeholder, remove it.
            // Or update it with an error message. For now, let's try updating then removing if it's truly an API error.
          }
          return prevMessages;
        });


        if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
          logToTerminal("Using mock response mode (not on localhost)")
          const mockResponses = [
            "I'm running in mock mode since I can't access your local LLM server. In a real setup, I would connect to your server at 127.0.0.1:11434.",
            "This is a simulated response. When running locally, I'll connect to your LLM server. In this preview environment, I'm using mock data instead.",
          ]
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
          setMessages((prevMessages) =>
            prevMessages.map((msg, index) => {
              if (index === prevMessages.length - 1 && msg.role === "assistant") {
                return { ...msg, content: mockResponse }; // Update the placeholder
              }
              return msg;
            })
          );
          logToTerminal("Generated mock response")
        } else {
            // If on localhost and fetchError occurred, show connection error toast and update placeholder
            console.error("Error:", fetchError)
            toast({
              title: "Connection Error",
              description: "Failed to connect to the LLM server. Make sure your server is running.",
              variant: "destructive",
            })
            const errorMessageContent = "I'm having trouble connecting to the LLM server. Please check that your local server is running at 127.0.0.1:11434."
            setMessages((prevMessages) =>
              prevMessages.map((msg, index) => {
                if (index === prevMessages.length - 1 && msg.role === "assistant") {
                  return { ...msg, content: errorMessageContent };
                }
                return msg;
              })
            );
        }
      } finally {
        setIsLoading(false)
        logToTerminal("Request processing completed")
      }
    },
    // Ensure `messages` is not in dependencies if you are always updating the last one based on length.
    // If you pass `prevMessages` to `setMessages`, `messages` itself isn't strictly needed here
    // unless some other logic within `handleSubmit` directly reads from the `messages` state variable
    // *before* `setMessages` is called. Given the current flow, it should be fine.
    [input, isLoading, toast, logToTerminal]
  )

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  }
}