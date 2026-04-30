import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { schemaNodes, schemaEdges } from '@/data/schemaData'
import CustomTableNode from '@/components/schema/CustomTableNode'
import { Key, Link2, Database, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const nodeTypes: NodeTypes = {
  table: CustomTableNode,
}

export default function SchemaDiagram() {
  const { theme, toggleTheme } = useTheme()
  const [nodes, setNodes, onNodesChange] = useNodesState(schemaNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(schemaEdges)

  const miniMapNodeColor = useCallback((node: any) => {
    const label = node.data?.label ?? ''
    if (label === 'User') return 'hsl(355 30% 58%)'
    if (label === 'Couple') return 'hsl(356 35% 74%)'
    if (label === 'Box') return 'hsl(356 35% 74%)'
    if (label === 'Item') return 'hsl(17 16% 72%)'
    if (label === 'CoupleRequest') return 'hsl(330 7% 55%)'
    return 'hsl(var(--muted))'
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl italic tracking-tight text-foreground">
                Schema Diagram
              </h1>
              <p className="text-xs text-muted-foreground">
                Prisma ORM · MySQL · 5 modelos
              </p>
            </div>
          </div>

          {/* Legend + theme toggle */}
          <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg border border-border/40 bg-card/60 flex items-center justify-center hover:bg-muted transition-colors"
          >
            {theme === 'dark'
              ? <Sun size={15} className="text-foreground" />
              : <Moon size={15} className="text-foreground" />}
          </button>
          <div className="hidden md:flex items-center gap-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Key size={11} className="text-amber-500" />
              <span>Primary Key</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Link2 size={11} className="text-primary" />
              <span>Foreign Key</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-primary/60" />
              <span>1:N Relación</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 border-t-2 border-dashed border-muted-foreground/50" />
              <span>Self-ref</span>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="h-[calc(100vh-73px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          className="bg-background"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="hsl(var(--border) / 0.5)"
          />
          <Controls
            position="bottom-left"
            className="!bg-card !border-border/40 !shadow-[0_2px_20px_rgba(180,117,122,0.08)] !rounded-xl overflow-hidden"
          />
          <MiniMap
            position="bottom-right"
            nodeColor={miniMapNodeColor}
            maskColor="hsl(var(--muted) / 0.4)"
            className="!bg-card !border-border/40 !shadow-[0_2px_20px_rgba(180,117,122,0.08)] !rounded-xl"
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </div>
  )
}