"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

interface MessageContentProps {
  content: string
}

export function MessageContent({ content }: MessageContentProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="whitespace-pre-wrap">{content}</div>
  }

  return (
    // Apply the className to this new wrapper div
    <div
      className={cn(
        "prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
        "max-w-none",
        "prose-code:before:hidden prose-code:after:hidden"
      )}
    >
      <ReactMarkdown
        // The className prop has been removed from here
        components={{
          pre({ node, className, children, ...props }) {
            // The className prop here is passed by react-markdown (e.g., for language classes)
            // and is fine. We are merging it with our custom styles.
            return (
              <pre
                className={cn(
                  "mb-2 mt-2 overflow-auto rounded-lg bg-black/10 p-2 dark:bg-white/10",
                  className // Include className from markdown if present
                )}
                {...props}
              >
                {children}
              </pre>
            )
          },
          code({ node, className, children, ...props }) {
            // Similar to pre, className here is from markdown.
            return (
              <code
                className={cn(
                  "rounded-sm bg-black/10 px-1 py-0.5 font-mono text-sm dark:bg-white/10",
                  className // Include className from markdown if present
                )}
                {...props}
              >
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}