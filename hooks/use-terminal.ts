"use client"
import { create } from "zustand"

interface TerminalState {
  output: string[]
  addOutput: (line: string) => void
  clearOutput: () => void
  logToTerminal: (message: string) => void
}

export const useTerminalStore = create<TerminalState>((set) => ({
  output: [],
  addOutput: (line) => set((state) => ({ output: [...state.output, line] })),
  clearOutput: () => set({ output: [] }),
  logToTerminal: (message) => {
    const timestamp = new Date().toLocaleTimeString()
    set((state) => ({ output: [...state.output, `[${timestamp}] ${message}`] }))
  },
}))

export function useTerminal() {
  const { output, addOutput, clearOutput, logToTerminal } = useTerminalStore()

  return {
    output,
    logToTerminal,
    clearTerminal: clearOutput,
  }
}
