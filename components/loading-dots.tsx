export function LoadingDots() {
  return (
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></div>
      <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground animation-delay-200"></div>
      <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground animation-delay-400"></div>
    </div>
  )
}
