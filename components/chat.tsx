"use client"

import type React from "react"

import { useChat } from "@/hooks/use-chat"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Mic, Send, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { ChatMessage } from "@/types/chat"
import { MessageContent } from "./message-content"


// Declare SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()

    // Initialize speech recognition if supported
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        if (inputRef.current) {
          inputRef.current.value = transcript
          handleInputChange({ target: { value: transcript } } as React.ChangeEvent<HTMLInputElement>)
        }
        setIsRecording(false)
      }

      recognitionInstance.onerror = () => {
        setIsRecording(false)
      }

      recognitionInstance.onend = () => {
        setIsRecording(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [handleInputChange])

  const toggleRecording = () => {
    if (!recognition) return

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
    } else {
      recognition.start()
      setIsRecording(true)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="flex flex-col gap-4 pb-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
              <Bot className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Start a conversation</h3>
              <p className="text-sm text-muted-foreground">
                This chatbot is connected to your local LLM server at 127.0.0.1:11434
              </p>
            </div>
          ) : (
            messages.map((message, index) => <ChatMessageItem key={index} message={message} />)
          )}
         
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
          />
          {recognition && (
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              onClick={toggleRecording}
            >
              <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
              <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
            </Button>
          )}
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <Card
      className={cn(
        "flex gap-3 rounded-lg p-4",
        isUser
          ? "ml-auto max-w-[80%] w-fit" // User messages: align right, fit content width
          : "max-w-[80%] w-full"      // Bot messages: align left, full width within max
      )}
    >
      <Avatar className="h-8 w-8">
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 space-y-2">
        <MessageContent content={message.content} />
      </div>
    </Card>
  );
}