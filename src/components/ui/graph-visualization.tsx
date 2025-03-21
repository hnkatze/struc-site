"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, RefreshCw, Coffee } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from "react"
import { cafeDecisionGraph, GraphNode } from "@/lib/graphUtils"

// Definición de un nodo en el grafo




type GraphVisualizationProps = object

export default function GraphVisualization({}: GraphVisualizationProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start")
  const [path, setPath] = useState<string[]>(["start"])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Obtener el nodo actual
  const currentNode = cafeDecisionGraph.find(node => node.id === currentNodeId) || cafeDecisionGraph[0]
  
  // Manejar la selección de una opción
  const handleSelectOption = (nextId: string | null) => {
    if (!nextId || isAnimating) return
    
    setIsAnimating(true)
    
    setTimeout(() => {
      setCurrentNodeId(nextId)
      setPath([...path, nextId])
      setIsAnimating(false)
    }, 500)
  }
  
  // Reiniciar el recorrido
  const handleReset = () => {
    setCurrentNodeId("start")
    setPath(["start"])
  }

  // Dibujar el grafo en el canvas
  useEffect(() => {
    if (!showGraph || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Ajustar el tamaño del canvas
    canvas.width = canvas.clientWidth
    canvas.height = 600
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Crear un mapa de nodos para facilitar el acceso
    const nodeMap = new Map<string, GraphNode>()
    cafeDecisionGraph.forEach(node => {
      nodeMap.set(node.id, node)
    })
    
    // Calcular posiciones de los nodos (simplificado)
    const nodePositions = new Map<string, {x: number, y: number}>()
    
    // Niveles del grafo
    const levels: string[][] = [["start"]]
    const processed = new Set<string>(["start"])
    
    // Construir niveles
    for (let i = 0; i < levels.length; i++) {
      const nextLevel: string[] = []
      
      for (const nodeId of levels[i]) {
        const node = nodeMap.get(nodeId)
        if (!node) continue
        
        for (const option of node.options) {
          if (option.nextId && !processed.has(option.nextId)) {
            nextLevel.push(option.nextId)
            processed.add(option.nextId)
          }
        }
      }
      
      if (nextLevel.length > 0) {
        levels.push(nextLevel)
      }
    }
    
    // Asignar posiciones basadas en niveles
    for (let i = 0; i < levels.length; i++) {
      const y = 60 + i * 100
      const levelWidth = canvas.width - 40
      const nodeWidth = levelWidth / levels[i].length
      
      for (let j = 0; j < levels[i].length; j++) {
        const x = 20 + nodeWidth * j + nodeWidth / 2
        nodePositions.set(levels[i][j], {x, y})
      }
    }
    
    // Dibujar conexiones
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)'
    ctx.lineWidth = 1
    
    for (const [nodeId, node] of nodeMap.entries()) {
      const position = nodePositions.get(nodeId)
      if (!position) continue
      
      for (const option of node.options) {
        if (!option.nextId) continue
        
        const targetPosition = nodePositions.get(option.nextId)
        if (!targetPosition) continue
        
        ctx.beginPath()
        ctx.moveTo(position.x, position.y + 15)
        ctx.lineTo(targetPosition.x, targetPosition.y - 15)
        
        // Destacar el camino tomado
        if (path.includes(nodeId) && path.includes(option.nextId) && 
            path.indexOf(option.nextId) === path.indexOf(nodeId) + 1) {
          ctx.strokeStyle = 'hsl(var(--primary))'
          ctx.lineWidth = 2
        } else {
          ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)'
          ctx.lineWidth = 1
        }
        
        ctx.stroke()
      }
    }
    
    // Dibujar nodos
    for (const [nodeId, position] of nodePositions.entries()) {
      const node = nodeMap.get(nodeId)
      if (!node) continue
      
      // Dibujar círculo
      ctx.beginPath()
      ctx.arc(position.x, position.y, 15, 0, Math.PI * 2)
      
      if (path.includes(nodeId)) {
        if (nodeId === currentNodeId) {
          ctx.fillStyle = 'hsl(var(--primary))'
        } else {
          ctx.fillStyle = 'hsl(var(--primary) / 0.7)'
        }
      } else {
        ctx.fillStyle = 'hsl(var(--muted))'
      }
      
      ctx.fill()
      
      // Dibujar texto
      ctx.fillStyle = path.includes(nodeId) ? 'white' : 'black'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Mostrar un identificador corto
      const shortId = nodeId.split('-')[0].substring(0, 3)
      ctx.fillText(shortId, position.x, position.y)
      
      // Mostrar etiqueta debajo para nodos en el camino
      if (path.includes(nodeId)) {
        ctx.font = '8px sans-serif'
        ctx.fillStyle = 'hsl(var(--foreground))'
        
        // Obtener un nombre más descriptivo
        let label = node.options[0].text
        if (label.length > 15) {
          label = label.substring(0, 12) + '...'
        }
        
        ctx.fillText(label, position.x, position.y + 25)
      }
    }
    
  }, [showGraph, path, currentNodeId])

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg w-[70%]">
      <div className="space-y-2">
        <h2 className="text-3xl underline  font-bold">Grafo (Graph)</h2>
        <p className="text-muted-foreground">
          Un grafo es una estructura de datos no lineal que consiste en nodos (vértices) y aristas (conexiones).
          Este ejemplo muestra un grafo dirigido que representa un árbol de decisiones para pedir en una cafetería.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Visualización interactiva */}
        <Card className="border-2">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Pedido en la Cafetería
            </CardTitle>
            <CardDescription>
              Navega por el grafo de decisiones para hacer tu pedido
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-lg font-medium">{currentNode.question}</div>
              
              {currentNode.isResult ? (
                <div className="bg-muted p-4 rounded-md">
                  <div className="font-bold">{currentNode.options[0].text}</div>
                  <p className="text-muted-foreground mt-2">{currentNode.options[0].result}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentNode.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={path.includes(option.nextId || "") ? "default" : "outline"}
                      className={cn(
                        "justify-start h-auto py-3 px-4",
                        isAnimating && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleSelectOption(option.nextId)}
                      disabled={isAnimating}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Pasos: {path.length - 1}
            </div>
            <Button variant="outline" onClick={handleReset} disabled={isAnimating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </CardFooter>
        </Card>

        {/* Visualización del grafo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Visualización del grafo</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGraph(!showGraph)}
            >
              {showGraph ? "Ocultar grafo" : "Mostrar grafo"}
            </Button>
          </div>
          
          {showGraph && (
            <div className="border rounded-md p-2 overflow-auto">
              <canvas 
                ref={canvasRef} 
                className="w-full min-h-[600px]"
              />
              <div className="text-xs text-muted-foreground mt-2">
                * Los nodos destacados muestran el camino que has tomado
              </div>
            </div>
          )}
        </div>

        {/* Camino actual */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tu camino actual</h3>
          <div className="flex flex-wrap items-center gap-2 p-4 bg-muted rounded-md">
            {path.map((nodeId, index) => {
              const node = cafeDecisionGraph.find(n => n.id === nodeId)
              if (!node) return null
              
              // Para nodos de resultado, mostrar el nombre del resultado
              const displayText = node.isResult 
                ? node.options[0].text 
                : node.question.length > 30 
                  ? node.question.substring(0, 27) + '...' 
                  : node.question
              
              return (
                <React.Fragment key={nodeId}>
                  <div 
                    className={cn(
                      "px-3 py-1 rounded-md text-sm",
                      nodeId === currentNodeId 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {displayText}
                  </div>
                  {index < path.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Información educativa */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="about-graphs">
            <AccordionTrigger>¿Qué es un grafo?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <p>
                  Un grafo es una estructura de datos no lineal que consiste en un conjunto de nodos (vértices) 
                  conectados por aristas (edges). Los grafos son ideales para representar relaciones entre objetos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Componentes de un grafo</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Nodos o vértices: Representan entidades</li>
                      <li>Aristas: Conexiones entre nodos</li>
                      <li>Peso: Valor asociado a una arista</li>
                      <li>Dirección: Indica si la relación es unidireccional</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Tipos de grafos</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Dirigido: Las aristas tienen dirección</li>
                      <li>No dirigido: Las aristas no tienen dirección</li>
                      <li>Ponderado: Las aristas tienen pesos</li>
                      <li>Cíclico: Contiene al menos un ciclo</li>
                      <li>Acíclico: No contiene ciclos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="complexity">
            <AccordionTrigger>Complejidad de tiempo</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Búsqueda en anchura (BFS):</span> O(V + E)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Búsqueda en profundidad (DFS):</span> O(V + E)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Algoritmo de Dijkstra:</span> O(V² + E)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Algoritmo de Bellman-Ford:</span> O(V × E)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Algoritmo de Floyd-Warshall:</span> O(V³)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Árbol de expansión mínima:</span> O(E log V)
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                V = número de vértices, E = número de aristas
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="applications">
            <AccordionTrigger>Aplicaciones</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Redes sociales</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Modelado de conexiones entre personas</li>
                    <li>Recomendación de amigos</li>
                    <li>Análisis de influencia</li>
                    <li>Detección de comunidades</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Sistemas de navegación</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Cálculo de rutas óptimas</li>
                    <li>Sistemas GPS</li>
                    <li>Planificación de rutas de transporte</li>
                    <li>Optimización de tráfico</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Informática</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Redes de computadoras</li>
                    <li>Análisis de dependencias</li>
                    <li>Compiladores (árboles de sintaxis)</li>
                    <li>Sistemas de archivos</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Otros campos</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Biología (redes de proteínas)</li>
                    <li>Química (estructuras moleculares)</li>
                    <li>Lingüística (relaciones semánticas)</li>
                    <li>Sistemas de recomendación</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="algorithms">
            <AccordionTrigger>Algoritmos principales</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Búsqueda en anchura (BFS)</h4>
                  <p>Explora todos los nodos vecinos en el nivel actual antes de pasar al siguiente nivel. Útil para encontrar el camino más corto en grafos no ponderados.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Búsqueda en profundidad (DFS)</h4>
                  <p>Explora un camino hasta el final antes de retroceder. Útil para detectar ciclos, componentes conectados y ordenamiento topológico.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Algoritmo de Dijkstra</h4>
                  <p>Encuentra el camino más corto desde un nodo a todos los demás en grafos con pesos positivos.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Algoritmo de Bellman-Ford</h4>
                  <p>Similar a Dijkstra pero puede manejar pesos negativos y detectar ciclos negativos.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Algoritmo de Kruskal</h4>
                  <p>Encuentra el árbol de expansión mínima de un grafo conectado no dirigido y ponderado.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
