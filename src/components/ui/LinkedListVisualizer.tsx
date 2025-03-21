"use client"

import React, { useState } from "react"
import { Plus, Trash2, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { toast } from "sonner"
import { LinkedList } from "@/lib/LinkedList"

const LinkedListVisualization: React.FC = () => {
  const [list] = useState(() => new LinkedList<number>())
  const [nodes, setNodes] = useState<number[]>([])
  const [inputValue, setInputValue] = useState("")
  const [targetValue, setTargetValue] = useState("")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [operation, setOperation] = useState<string | null>(null)

  const updateNodes = () => {
    setNodes(list.toArray())
  }

  const handleInsertAtBeginning = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      toast("Por favor ingresa un número válido")
      return
    }

    setOperation("insert-start")
    setIsAnimating(true)
    setActiveIndex(0)

    setTimeout(() => {
      list.insertAtBeginning(value)
      updateNodes()
      setInputValue("")
      setIsAnimating(false)
      setActiveIndex(null)
      setOperation(null)

      toast( `Se ha insertado el valor ${value} al inicio de la lista`)
    }, 800)
  }

  const handleInsertAtEnd = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      toast("Por favor ingresa un número válido")
      return
    }

    setOperation("insert-end")
    setIsAnimating(true)
    setActiveIndex(nodes.length)

    setTimeout(() => {
      list.insertAtEnd(value)
      updateNodes()
      setInputValue("")
      setIsAnimating(false)
      setActiveIndex(null)
      setOperation(null)

      toast( `Se ha insertado el valor ${value} al final de la lista`)
    }, 800)
  }

  const handleInsertAfter = () => {
    const value = Number.parseInt(inputValue)
    const target = Number.parseInt(targetValue)
    if (isNaN(value) || isNaN(target)) {
      toast("Por favor ingresa números válidos")
      return
    }

    const targetIndex = nodes.indexOf(target)
    if (targetIndex === -1) {
      toast( "El valor objetivo no existe en la lista")
      return
    }

    setOperation("insert-after")
    setIsAnimating(true)
    setActiveIndex(targetIndex)

    setTimeout(() => {
      list.insertAfter(target, value)
      updateNodes()
      setInputValue("")
      setTargetValue("")
      setIsAnimating(false)
      setActiveIndex(null)
      setOperation(null)

      toast(`Se ha insertado el valor ${value} después de ${target}`)
    }, 800)
  }

  const handleDelete = (value: number) => {
    const index = nodes.indexOf(value)
    setOperation("delete")
    setIsAnimating(true)
    setActiveIndex(index)

    setTimeout(() => {
      list.delete(value)
      updateNodes()
      setIsAnimating(false)
      setActiveIndex(null)
      setOperation(null)

      toast(
       `Se ha eliminado el valor ${value} de la lista`)
    }, 800)
  }

  const handleReset = () => {
    while (list.head) {
      list.delete(list.head.value)
    }
    updateNodes()
    setInputValue("")
    setTargetValue("")
    setActiveIndex(null)
    setIsAnimating(false)
    setOperation(null)
  }

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg w-[70%]">
      <div className="space-y-2">
        <h2 className="text-3xl underline font-bold">Lista Enlazada (Linked List)</h2>
        <p className="text-muted-foreground">
          Una lista enlazada es una estructura de datos lineal donde cada elemento (nodo) contiene un valor y una
          referencia al siguiente nodo en la secuencia.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Visualización de la lista */}
        <div className="relative w-full border-2 border-dashed rounded-md p-4 min-h-[100px]">
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground italic">Lista vacía</div>
          ) : (
            <div className="flex items-center space-x-4 flex-wrap gap-y-4">
              {nodes.map((node, index) => (
                <React.Fragment key={index}>
                  <div
                    className={cn(
                      "relative group flex items-center gap-2 min-w-[120px] h-16 rounded-md transition-all duration-300",
                      index === activeIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground",
                      operation === "delete" && index === activeIndex && isAnimating
                        ? "animate-slide-up opacity-0"
                        : "",
                      operation === "insert-start" && index === 0 && isAnimating ? "animate-slide-down" : "",
                      operation === "insert-end" && index === nodes.length - 1 && isAnimating
                        ? "animate-slide-down"
                        : "",
                      operation === "insert-after" && activeIndex !== null && index === activeIndex + 1 && isAnimating
                        ? "animate-slide-down"
                        : "",
                    )}
                  >
                    <div className="flex-1 flex items-center justify-center font-mono">
                      <button
                        onClick={() => setTargetValue(node.toString())}
                        className="font-bold"
                        disabled={isAnimating}
                      >
                        {node}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(node)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isAnimating}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  {index < nodes.length - 1 && <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="grid gap-4">
          <div className="flex gap-2">
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Valor a insertar"
              disabled={isAnimating}
            />
            <Button onClick={handleInsertAtBeginning} disabled={isAnimating || !inputValue}>
              <Plus className="h-4 w-4 mr-2" />
              Insertar al inicio
            </Button>
            <Button onClick={handleInsertAtEnd} disabled={isAnimating || !inputValue} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Insertar al final
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              value={targetValue}
              placeholder="Valor objetivo"
              disabled={true}
              className="bg-muted"
            />
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Valor a insertar"
              disabled={isAnimating}
            />
            <Button onClick={handleInsertAfter} disabled={isAnimating || !inputValue || !targetValue} variant="outline">
              Insertar después de
            </Button>
          </div>

          <Button variant="outline" onClick={handleReset} className="w-full" disabled={isAnimating}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        {/* Información educativa */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="complexity">
            <AccordionTrigger>Complejidad de tiempo</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Acceso:</span> O(n)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Búsqueda:</span> O(n)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Inserción al inicio:</span> O(1)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Inserción al final:</span> O(1)*
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Eliminación al inicio:</span> O(1)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Eliminación al final:</span> O(n)
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">* O(1) si se mantiene una referencia al último nodo</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="types">
            <AccordionTrigger>Tipos de listas enlazadas</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Lista enlazada simple</h4>
                  <p>Cada nodo tiene un valor y una referencia al siguiente nodo.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Lista doblemente enlazada</h4>
                  <p>Cada nodo tiene referencias tanto al siguiente como al anterior nodo.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Lista circular</h4>
                  <p>El último nodo apunta al primero, formando un ciclo.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Lista circular doblemente enlazada</h4>
                  <p>Combina las características de las listas doblemente enlazadas y circulares.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="applications">
            <AccordionTrigger>Aplicaciones</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Sistemas operativos</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Gestión de memoria</li>
                    <li>Planificación de procesos</li>
                    <li>Sistema de archivos</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Aplicaciones</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Historial de navegación</li>
                    <li>Reproductor de música</li>
                    <li>Editor de texto</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Estructuras de datos</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Implementación de pilas</li>
                    <li>Implementación de colas</li>
                    <li>Tablas hash encadenadas</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Algoritmos</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Manejo de polinomios</li>
                    <li>Algoritmos de grafos</li>
                    <li>Cache LRU</li>
                  </ul>
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
                    <li>Tamaño dinámico</li>
                    <li>Inserción/eliminación eficiente al inicio</li>
                    <li>Memoria flexible</li>
                    <li>Fácil implementación</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 dark:text-red-400">Desventajas</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>No hay acceso aleatorio</li>
                    <li>Más uso de memoria</li>
                    <li>Recorrido secuencial</li>
                    <li>No es cache-friendly</li>
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

export default LinkedListVisualization

