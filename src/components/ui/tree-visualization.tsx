"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Trash2, Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TreeVisualizationProps, TreeNode, insertNode, getTreeHeight, getTreeWidth, searchNode, removeNode, inOrderTraversal, preOrderTraversal, postOrderTraversal } from "@/lib/TreeUtils"
import { toast } from "sonner"

// Definición de la estructura del nodo


export default function TreeVisualization({ initialTree = [50, 30, 70, 20, 40, 60, 80] }: TreeVisualizationProps) {
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [newValue, setNewValue] = useState<string>("")
  const [searchValue, setSearchValue] = useState<string>("")
  const [traversalResult, setTraversalResult] = useState<number[]>([])
  const [traversalType, setTraversalType] = useState<string>("inorder")
  const [activeNodes, setActiveNodes] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [treeHeight, setTreeHeight] = useState<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [treeWidth, setTreeWidth] = useState<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Inicializar el árbol con valores predeterminados
  useEffect(() => {
    let newRoot: TreeNode | null = null
    initialTree.forEach((value) => {
      newRoot = insertNode(newRoot, value)
    })
    setRoot(newRoot)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Actualizar altura y ancho del árbol cuando cambia
  useEffect(() => {
    if (root) {
      setTreeHeight(getTreeHeight(root))
      setTreeWidth(getTreeWidth(root))
    } else {
      setTreeHeight(0)
      setTreeWidth(0)
    }
  }, [root])

  // Dibujar el árbol en el canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !root) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Ajustar el tamaño del canvas
    if (containerRef.current) {
      canvas.width = containerRef.current.clientWidth
      canvas.height = Math.max(300, treeHeight * 80)
    }

    // Dibujar el árbol
    const drawTree = (node: TreeNode | null, x: number, y: number, horizontalSpacing: number) => {
      if (!node) return

      const nodeRadius = 20
      const verticalSpacing = 60

      // Dibujar el nodo
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)

      // Colorear el nodo según si está activo
      if (activeNodes.includes(node.value)) {
        ctx.fillStyle = "hsl(var(--primary))"
      } else {
        ctx.fillStyle = "hsl(var(--secondary))"
      }

      ctx.fill()
      ctx.strokeStyle = "hsl(var(--border))"
      ctx.lineWidth = 2
      ctx.stroke()

      // Dibujar el valor del nodo
      ctx.fillStyle = activeNodes.includes(node.value)
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--secondary-foreground))"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.value.toString(), x, y)

      // Calcular las posiciones de los hijos
      const nextY = y + verticalSpacing
      const leftX = x - horizontalSpacing
      const rightX = x + horizontalSpacing

      // Dibujar las conexiones a los hijos
      if (node.left) {
        ctx.beginPath()
        ctx.moveTo(x - nodeRadius * Math.cos(Math.PI / 4), y + nodeRadius * Math.sin(Math.PI / 4))
        ctx.lineTo(leftX + nodeRadius * Math.cos(Math.PI / 4), nextY - nodeRadius * Math.sin(Math.PI / 4))
        ctx.strokeStyle = "hsl(var(--border))"
        ctx.lineWidth = 2
        ctx.stroke()
        drawTree(node.left, leftX, nextY, horizontalSpacing / 2)
      }

      if (node.right) {
        ctx.beginPath()
        ctx.moveTo(x + nodeRadius * Math.cos(Math.PI / 4), y + nodeRadius * Math.sin(Math.PI / 4))
        ctx.lineTo(rightX - nodeRadius * Math.cos(Math.PI / 4), nextY - nodeRadius * Math.sin(Math.PI / 4))
        ctx.strokeStyle = "hsl(var(--border))"
        ctx.lineWidth = 2
        ctx.stroke()
        drawTree(node.right, rightX, nextY, horizontalSpacing / 2)
      }
    }

    // Iniciar el dibujo desde la raíz
    const startX = canvas.width / 2
    const startY = 40
    const initialHorizontalSpacing = Math.min(canvas.width / 4, 120)

    drawTree(root, startX, startY, initialHorizontalSpacing)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, activeNodes])

  // Manejar la inserción de un nuevo nodo
  const handleInsert = () => {
    const value = Number.parseInt(newValue)
    if (isNaN(value)) {
      toast( "Por favor ingresa un número válido")
      return
    }

    // Verificar si el nodo ya existe
    if (root && searchNode(root, value)) {
      toast( `El valor ${value} ya existe en el árbol`)
      return
    }

    setIsAnimating(true)
    setActiveNodes([value])

    setTimeout(() => {
      const newRoot = insertNode(root, value)
      setRoot(newRoot)
      setNewValue("")
      setIsAnimating(false)
      setActiveNodes([])

      toast( `Se ha insertado el valor ${value} en el árbol`)
    }, 800)
  }

  // Manejar la eliminación de un nodo
  const handleRemove = () => {
    const value = Number.parseInt(newValue)
    if (isNaN(value)) {
      toast( "Por favor ingresa un número válido")
      return
    }

    // Verificar si el nodo existe
    if (!root || !searchNode(root, value)) {
      toast( `El valor ${value} no existe en el árbol`)
      return
    }

    setIsAnimating(true)
    setActiveNodes([value])

    setTimeout(() => {
      const newRoot = removeNode(root, value)
      setRoot(newRoot)
      setNewValue("")
      setIsAnimating(false)
      setActiveNodes([])

      toast( `Se ha eliminado el valor ${value} del árbol`)
    }, 800)
  }

  // Manejar la búsqueda de un nodo
  const handleSearch = () => {
    const value = Number.parseInt(searchValue)
    if (isNaN(value)) {
      toast( "Por favor ingresa un número válido para buscar")
      return
    }

    setIsAnimating(true)

    // Simular la búsqueda con animación
    const path: number[] = []
    const animateSearch = (node: TreeNode | null, target: number) => {
      if (!node) return false

      path.push(node.value)
      setActiveNodes([...path])

      if (node.value === target) return true

      if (target < node.value) {
        setTimeout(() => animateSearch(node.left, target), 500)
      } else {
        setTimeout(() => animateSearch(node.right, target), 500)
      }
    }

    const found = animateSearch(root, value)

    setTimeout(() => {
      if (found) {
        toast( `El valor ${value} existe en el árbol`)
      } else {
        toast(`El valor ${value} no existe en el árbol`)
      }

      setIsAnimating(false)
      setActiveNodes([])
      setSearchValue("")
    }, 1500)
  }

  // Manejar el recorrido del árbol
  const handleTraversal = (type: string) => {
    setTraversalType(type)

    if (!root) {
      setTraversalResult([])
      return
    }

    let result: number[] = []

    switch (type) {
      case "inorder":
        result = inOrderTraversal(root)
        break
      case "preorder":
        result = preOrderTraversal(root)
        break
      case "postorder":
        result = postOrderTraversal(root)
        break
    }

    setTraversalResult(result)

    // Animar el recorrido
    setIsAnimating(true)
    const animateTraversal = (index: number) => {
      if (index >= result.length) {
        setIsAnimating(false)
        setActiveNodes([])
        return
      }

      setActiveNodes([result[index]])
      setTimeout(() => animateTraversal(index + 1), 500)
    }

    animateTraversal(0)
  }

  // Reiniciar el árbol
  const handleReset = () => {
    let newRoot: TreeNode | null = null
    initialTree.forEach((value) => {
      newRoot = insertNode(newRoot, value)
    })
    setRoot(newRoot)
    setNewValue("")
    setSearchValue("")
    setTraversalResult([])
    setActiveNodes([])
    setIsAnimating(false)
  }

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg w-[70%]">
      <div className="space-y-2">
        <h2 className="text-3xl underline font-bold">Árbol Binario de Búsqueda (BST)</h2>
        <p className="text-muted-foreground">
          Un árbol binario de búsqueda es una estructura de datos jerárquica donde cada nodo tiene como máximo dos
          hijos. Para cada nodo, todos los elementos en el subárbol izquierdo son menores que el nodo, y todos los
          elementos en el subárbol derecho son mayores.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Visualización del árbol */}
        <div
          ref={containerRef}
          className="relative w-full border-2 border-dashed rounded-md p-2 min-h-[300px] overflow-auto"
        >
          {!root ? (
            <div className="flex items-center justify-center h-full text-muted-foreground italic">Árbol vacío</div>
          ) : (
            <canvas ref={canvasRef} className="w-full" />
          )}
        </div>

        {/* Controles y operaciones */}
        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="operations">Operaciones</TabsTrigger>
            <TabsTrigger value="traversal">Recorridos</TabsTrigger>
            <TabsTrigger value="info">Información</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ingresa un valor"
                type="number"
                disabled={isAnimating}
              />
              <Button onClick={handleInsert} disabled={isAnimating || !newValue}>
                <Plus className="h-4 w-4 mr-2" />
                Insertar
              </Button>
              <Button onClick={handleRemove} disabled={isAnimating || !newValue} variant="secondary">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar valor"
                type="number"
                disabled={isAnimating}
              />
              <Button onClick={handleSearch} disabled={isAnimating || !searchValue} variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>

            <Button variant="outline" onClick={handleReset} className="w-full" disabled={isAnimating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </TabsContent>

          <TabsContent value="traversal" className="space-y-4">
            <div className="space-y-4">
              <RadioGroup
                value={traversalType}
                onValueChange={(value) => handleTraversal(value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inorder" id="inorder" disabled={isAnimating} />
                  <Label htmlFor="inorder">Inorden (izquierda, raíz, derecha)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="preorder" id="preorder" disabled={isAnimating} />
                  <Label htmlFor="preorder">Preorden (raíz, izquierda, derecha)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="postorder" id="postorder" disabled={isAnimating} />
                  <Label htmlFor="postorder">Postorden (izquierda, derecha, raíz)</Label>
                </div>
              </RadioGroup>

              <div className="p-2 bg-muted rounded-md">
                <h4 className="text-sm font-medium mb-2">Resultado del recorrido:</h4>
                <div className="flex flex-wrap gap-2">
                  {traversalResult.length > 0 ? (
                    traversalResult.map((value, index) => (
                      <div key={index} className="px-2 py-1 bg-secondary rounded-md text-sm">
                        {value}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic">Selecciona un tipo de recorrido</span>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-muted rounded-md">
                <span className="font-semibold">Altura del árbol:</span> {treeHeight}
              </div>
              <div className="p-2 bg-muted rounded-md">
                <span className="font-semibold">Número de nodos:</span> {traversalResult.length}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Complejidad de tiempo</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Búsqueda:</span> O(log n) promedio, O(n) peor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Inserción:</span> O(log n) promedio, O(n) peor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Eliminación:</span> O(log n) promedio, O(n) peor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Espacio:</span> O(n)
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Aplicaciones de los árboles binarios de búsqueda</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Implementación de bases de datos indexadas</li>
                <li>Algoritmos de compresión</li>
                <li>Sistemas de archivos</li>
                <li>Expresiones aritméticas</li>
                <li>Algoritmos de enrutamiento en redes</li>
                <li>Implementación de conjuntos y mapas en lenguajes de programación</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tipos de árboles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Árbol binario:</span> Cada nodo tiene máximo dos hijos
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Árbol binario completo:</span> Todos los niveles están llenos, excepto
                  posiblemente el último
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Árbol AVL:</span> BST autobalanceado donde la diferencia de altura
                  entre subárboles es ≤ 1
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Árbol Rojo-Negro:</span> BST autobalanceado con propiedades de
                  coloración
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

