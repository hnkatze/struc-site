"use client"

import { useState, useRef, useEffect } from "react"
import { Eye, Plus, Trash2, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface StackVisualizationProps {
  initialStack?: string[]
  maxSize?: number
}

export default function StackVisualization({ 
  initialStack = ["Elemento 5", "Elemento 4", "Elemento 3", "Elemento 2", "Elemento 1"], 
  maxSize = 8 
}: StackVisualizationProps) {
  const [stack, setStack] = useState<string[]>(initialStack)
  const [newValue, setNewValue] = useState<string>("")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [peekActive, setPeekActive] = useState(false)
  const [operation, setOperation] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    setIsOverflowing(stack.length >= maxSize)
  }, [stack, maxSize])

  const handlePush = () => {
    if (!newValue.trim()) {
      toast( "Por favor ingresa un valor para añadir a la pila")
      return
    }

    if (stack.length >= maxSize) {
      toast("La pila ha alcanzado su capacidad máxima")
      return
    }

    setOperation("push")
    setIsAnimating(true)
    
    // Simular la animación de push
    setTimeout(() => {
      setStack([newValue, ...stack])
      setNewValue("")
      setIsAnimating(false)
      setOperation(null)
      
      toast( `Se añadió "${newValue}" al tope de la pila`)
    }, 800)
  }

  const handlePop = () => {
    if (stack.length === 0) {
      toast( "No se puede hacer pop en una pila vacía")
      return
    }

    setOperation("pop")
    setIsAnimating(true)
    setActiveIndex(0)
    
    // Simular la animación de pop
    setTimeout(() => {
      const poppedValue = stack[0]
      const newStack = [...stack]
      newStack.shift()
      setStack(newStack)
      setIsAnimating(false)
      setActiveIndex(null)
      setOperation(null)
      
      toast( `Se eliminó "${poppedValue}" del tope de la pila`)
    }, 800)
  }

  const handlePeek = () => {
    if (stack.length === 0) {
      toast( "No hay elementos para mostrar")
      return
    }

    setPeekActive(true)
    setActiveIndex(0)
    
    // Desactivar peek después de un tiempo
    setTimeout(() => {
      setPeekActive(false)
      setActiveIndex(null)
    }, 2000)
  }

  const handleReset = () => {
    setStack(initialStack)
    setNewValue("")
    setActiveIndex(null)
    setIsAnimating(false)
    setPeekActive(false)
    setOperation(null)
  }

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg w-[70%] ">
      <div className="space-y-2">
        <h2 className="text-3xl underline font-bold">Pila (Stack)</h2>
        <p className="text-muted-foreground">
          Una pila es una estructura de datos LIFO (Last In, First Out) donde el último elemento añadido es el primero en ser eliminado.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Visualización de la pila */}
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-2 text-sm font-medium">Tope de la pila</div>
          <div 
            ref={containerRef}
            className={cn(
              "relative w-full max-w-xs border-2 border-dashed rounded-md p-2 flex flex-col gap-2 min-h-[300px]",
              isOverflowing ? "border-yellow-500 dark:border-yellow-700" : "border-border"
            )}
          >
            {isOverflowing && (
              <div className="absolute -top-8 left-0 right-0 text-center text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                ¡Capacidad máxima alcanzada!
              </div>
            )}
            
            {/* Elemento animado para Push */}
            {operation === "push" && isAnimating && (
              <div 
                className="absolute -top-14 left-0 right-0 mx-auto w-full max-w-[calc(100%-1rem)] h-12 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-mono animate-slide-down"
              >
                {newValue}
              </div>
            )}
            
            {stack.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground italic">
                Pila vacía
              </div>
            ) : (
              <>
                {stack.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-full h-12 rounded-md flex items-center justify-center font-mono transition-all duration-300",
                      index === activeIndex && peekActive ? "bg-green-100 border-2 border-green-500 dark:bg-green-900 dark:border-green-700" :
                      index === activeIndex ? "bg-primary text-primary-foreground" :
                      "bg-secondary text-secondary-foreground",
                      operation === "pop" && index === 0 && isAnimating ? "animate-slide-up" : "",
                      operation === "push" && index === 0 && isAnimating ? "animate-fade-in" : ""
                    )}
                  >
                    {item}
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="mt-2 text-sm font-medium">Base de la pila</div>
        </div>

        {/* Controles y operaciones */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Operaciones</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Ingresa un valor"
                    disabled={isAnimating}
                  />
                  <Button onClick={handlePush} disabled={isAnimating}>
                    <Plus className="h-4 w-4 mr-2" />
                    Push
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Añade un elemento al tope de la pila</p>
              </div>
              
              <div className="space-y-2">
                <Button onClick={handlePop} disabled={isAnimating || stack.length === 0} variant="secondary" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Pop
                </Button>
                <p className="text-xs text-muted-foreground">Elimina el elemento del tope de la pila</p>
              </div>
              
              <div className="space-y-2">
                <Button onClick={handlePeek} disabled={isAnimating || stack.length === 0} variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Peek
                </Button>
                <p className="text-xs text-muted-foreground">Muestra el elemento del tope sin eliminarlo</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Complejidad de tiempo</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-muted rounded-md">
                <span className="font-semibold">Push:</span> O(1)
              </div>
              <div className="p-2 bg-muted rounded-md">
                <span className="font-semibold">Pop:</span> O(1)
              </div>
              <div className="p-2 bg-muted rounded-md">
                <span className="font-semibold">Peek:</span> O(1)
              </div>
              <div className="p-2 bg-muted rounded-md">
                <span className="font-semibold">Espacio:</span> O(n)
              </div>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleReset} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Aplicaciones de las pilas</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Gestión de llamadas a funciones (call stack)</li>
          <li>Evaluación de expresiones matemáticas</li>
          <li>Algoritmos de backtracking</li>
          <li>Historial de navegación (botón atrás)</li>
          <li>Deshacer/Rehacer en editores</li>
        </ul>
      </div>
    </div>
  )
}
