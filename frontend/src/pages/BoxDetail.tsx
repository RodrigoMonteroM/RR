import { ArrowLeft, Package, Calendar, Pencil, Trash2, Loader2 } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBox, useBoxes } from '@/hooks/useBoxes'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import EditBoxModal from '@/components/EditBoxModal'
import ConfirmDialog from '@/components/ConfirmDialog'
import { toast } from 'sonner'

export default function BoxDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: box, isLoading, error } = useBox(id!)
  const { deleteBox } = useBoxes()
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleDelete = async () => {
    try {
      if (!id) return
      await deleteBox(id)
      toast.success('Box eliminado')
      navigate('/')
    } catch {
      toast.error('Error al eliminar el box')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="text-muted-foreground animate-spin" />
      </div>
    )
  }

  if (error || !box) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Package size={48} className="text-muted-foreground opacity-30" />
        <p className="text-muted-foreground">Box no encontrado</p>
        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    )
  }

  const date = new Date(box.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-card/75 backdrop-blur-md border-b border-border/50 sticky top-0 z-10 shadow-[0_1px_12px_rgba(180,117,122,0.07)]">
        <div className="max-w-5xl mx-auto px-6 h-15 flex items-center gap-4" style={{ height: '3.75rem' }}>
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="font-display text-lg font-medium text-foreground truncate">
            {box.name}
          </span>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Box info card */}
        <div className="card-base px-6 py-6 animate-fade-up">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="font-display text-xl font-medium text-foreground">
                  {box.name}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Calendar size={12} />
                  <span>Creado el {date}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Editar"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {box.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {box.description}
            </p>
          )}
        </div>

        {/* Items placeholder */}
        <div className="card-base px-6 py-10 animate-fade-up-1">
          <div className="text-center">
            <Package size={32} className="mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-sm text-muted-foreground mb-1">Los items llegarán pronto</p>
            <p className="text-xs text-muted-foreground/60">
              Esta sección se habilitará en la próxima fase
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditBoxModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        box={box}
      />
      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar box"
        message={`¿Estás seguro de que querés eliminar "${box.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
      />
    </div>
  )
}
