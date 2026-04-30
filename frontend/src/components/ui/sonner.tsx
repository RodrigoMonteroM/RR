import { Toaster as Sonner } from "sonner"
import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      richColors
      position="top-center"
      duration={3000}
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border) / 0.4)',
          color: 'hsl(var(--foreground))',
          borderRadius: 'var(--radius)',
          boxShadow: '0 2px 20px rgba(180,117,122,0.08), 0 1px 3px rgba(180,117,122,0.05)',
        },
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border/40 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "!bg-primary/10 !text-primary !border-primary/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }