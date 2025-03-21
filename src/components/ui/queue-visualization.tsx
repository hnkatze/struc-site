"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Trash2, Eye, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"

interface QueueVisualizationProps {
  initialQueue?: string[]
  maxSize?: number
}

export default function QueueVisualization({
  initialQueue = ["Elemento 1", "Elemento 2", "Elemento 3", "Elemento 4", "Elemento 5"],
  maxSize = 8,
}: QueueVisualizationProps) {
  const [queue, setQueue] = useState<string[]>(initialQueue)
  const [newValue, setNewValue] = useState<string>("")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [peekActive, setPeekActive] = useState(false)
  const [operation, setOperation] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    setIsOverflowing(queue.length >= maxSize)
  }, [queue, maxSize])

  const handleEnqueue = () => {
    if (!newValue.trim()) {
      toast("Por favor ingresa un valor para añadir a la fila")
      return
    }

    if (queue.length >= maxSize) {
      toast("La fila ha alcanzado su capacidad máxima")
      return
    }

    setOperation("enqueue")
    setIsAnimating(true)
    setActiveIndex(queue.length)

    setTimeout(() => {
      setQueue([...queue, newValue])
      setNewValue("")
      setIsAnimating(false)
      setActiveIndex(null)
      setOperation(null)

      toast(`Se añadió "${newValue}" al final de la fila`)
    }, 800)
  }

  const handleDequeue = () => {
    if (queue.length === 0) {
      toast("No se puede hacer dequeue en una fila vacía")
      return
    }

    setOperation("dequeue")
    setIsAnimating(true)
    setActiveIndex(0)

    setTimeout(() => {
      const dequeuedValue = queue[0]
      setQueue(queue.slice(1))
      setIsAnimating(false)
      setActiveIndex(null)
      setOperation(null)

      toast( `Se removió "${dequeuedValue}" del frente de la fila`)
    }, 800)
  }

  const handlePeek = () => {
    if (queue.length === 0) {
      toast("No hay elementos para mostrar")
      return
    }

    setPeekActive(true)
    setActiveIndex(0)

    setTimeout(() => {
      setPeekActive(false)
      setActiveIndex(null)
    }, 2000)
  }

  const handleClear = () => {
    setQueue([])
    setNewValue("")
    setActiveIndex(null)
    setIsAnimating(false)
    setPeekActive(false)
    setOperation(null)

    toast("Se han removido todos los elementos de la fila")
  }

  const handleReset = () => {
    setQueue(initialQueue)
    setNewValue("")
    setActiveIndex(null)
    setIsAnimating(false)
    setPeekActive(false)
    setOperation(null)
  }

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg w-[70%]">
      <div className="space-y-2">
        <h1 className="text-3xl underline font-bold">Fila (Queue)</h1>
        <p className="text-muted-foreground">
          Una fila es una estructura de datos FIFO (First In, First Out) donde el primer elemento añadido
          es el primero en ser removido, similar a una fila de personas esperando en una tienda.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Visualización de la fila */}
        <div className="relative">
          <div className="flex justify-between mb-2">
            <div className="text-sm font-medium">Frente (Front)</div>
            <div className="text-sm font-medium">Final (Rear)</div>
          </div>
          <div
            ref={containerRef}
            className={cn(
              "relative w-full border-2 border-dashed rounded-md p-4 min-h-[100px] flex items-center",
              isOverflowing ? "border-yellow-500 dark:border-yellow-700" : "border-border"
            )}
          >
            {isOverflowing && (
              <div className="absolute -top-8 left-0 right-0 text-center text-yellow-600 dark:text-yellow-400 text-sm font-medium flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Capacidad máxima alcanzada
              </div>
            )}

            <div className="w-full flex items-center gap-4 overflow-x-auto pb-2">
              {queue.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground italic py-4">
                  Fila vacía
                </div>
              ) : (
                <div className="flex gap-4 min-w-full">
                  {queue.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex-1 h-16 min-w-[120px] rounded-md flex items-center justify-center font-mono transition-all duration-300 relative",
                        index === activeIndex && peekActive
                          ? "bg-green-100 border-2 border-green-500 dark:bg-green-900 dark:border-green-700"
                          : index === activeIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                        operation === "dequeue" && index === 0 && isAnimating
                          ? "animate-slide-left opacity-0"
                          : "",
                        operation === "enqueue" && index === queue.length - 1 && isAnimating
                          ? "animate-slide-right"
                          : ""
                      )}
                    >
                      {item}
                      <div className="absolute -bottom-6 text-xs text-muted-foreground">
                        Posición {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="grid gap-4">
          <div className="flex gap-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Ingresa un valor"
              disabled={isAnimating}
            />
            <Button onClick={handleEnqueue} disabled={isAnimating || !newValue}>
              <Plus className="h-4 w-4 mr-2" />
              Enqueue
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleDequeue}
              disabled={isAnimating || queue.length === 0}
              variant="secondary"
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Dequeue
            </Button>
            <Button
              onClick={handlePeek}
              disabled={isAnimating || queue.length === 0}
              variant="outline"
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Peek
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleClear}
              disabled={isAnimating || queue.length === 0}
              variant="destructive"
              className="flex-1"
            >
              Limpiar fila
            </Button>
            <Button onClick={handleReset} disabled={isAnimating} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>

        {/* Información educativa */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="complexity">
            <AccordionTrigger>Complejidad de tiempo</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Enqueue:</span> O(1)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Dequeue:</span> O(1)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Peek:</span> O(1)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Espacio:</span> O(n)
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="types">
            <AccordionTrigger>Tipos de filas</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Fila Simple (Queue)</h4>
                  <p>Implementación básica FIFO donde los elementos se procesan en orden de llegada.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Fila Circular (Circular Queue)</h4>
                  <p>
                    Utiliza un arreglo circular para reutilizar espacios liberados, optimizando el uso
                    de memoria.
                  </p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Fila de Prioridad (Priority Queue)</h4>
                  <p>
                    Los elementos tienen prioridades asignadas y se procesan según su nivel de
                    importancia.
                  </p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Fila Doble (Deque)</h4>
                  <p>
                    Permite insertar y eliminar elementos tanto por el frente como por el final de la
                    fila.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="applications">
            <AccordionTrigger>Aplicaciones</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Sistemas operativos</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Gestión de procesos</li>
                      <li>Manejo de interrupciones</li>
                      <li>Scheduling de CPU</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Redes</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Buffer de paquetes</li>
                      <li>Gestión de solicitudes</li>
                      <li>Control de congestión</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Aplicaciones web</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Colas de tareas</li>
                      <li>Gestión de eventos</li>
                      <li>Procesamiento asíncrono</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Vida real</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Sistemas de tickets</li>
                      <li>Gestión de impresión</li>
                      <li>Control de tráfico</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pros-cons">
            <AccordionTrigger>Ventajas y desventajas</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">Ventajas</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Implementación simple</li>
                    <li>Operaciones eficientes O(1)</li>
                    <li>Orden predecible (FIFO)</li>
                    <li>Ideal para buffers</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 dark:text-red-400">Desventajas</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Tamaño fijo en arrays</li>
                    <li>No permite acceso aleatorio</li>
                    <li>Desperdicio de memoria en arrays</li>
                    <li>Limitado a operaciones FIFO</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
