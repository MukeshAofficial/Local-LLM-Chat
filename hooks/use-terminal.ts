"use client"
import { create } from "zustand"

interface TerminalState {
  output: string[]
  isBallVisible: boolean; // New state: true to show, false to hide
  addOutput: (line: string) => void
  clearOutput: () => void
  logToTerminal: (message: string) => void
  toggleBallVisibility: () => void; // New action
}

export const useTerminalStore = create<TerminalState>((set) => ({
  output: [],
  isBallVisible: false, // Default to false (hidden) as requested
  addOutput: (line) => set((state) => ({ output: [...state.output, line] })),
  clearOutput: () => set({ output: [] }),
  logToTerminal: (message) => {
    const timestamp = new Date().toLocaleTimeString()
    set((state) => ({ output: [...state.output, `[${timestamp}] ${message}`] }))
  },
  toggleBallVisibility: () => set((state) => ({ isBallVisible: !state.isBallVisible })), // Action to toggle
}))

export function useTerminal() {
  // Ensure all new state and actions are destructured and returned
  const { output, isBallVisible, addOutput, clearOutput, logToTerminal, toggleBallVisibility } = useTerminalStore()

  return {
    output,
    isBallVisible,         // Expose new state
    toggleBallVisibility,  // Expose new action
    logToTerminal,
    clearTerminal: clearOutput,
  }
}