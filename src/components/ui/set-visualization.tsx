"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface SetVisualizationProps {
  initialSetA?: string[]
  initialSetB?: string[]
}

export default function SetVisualization({
  initialSetA = ["manzana", "naranja", "plátano", "fresa", "kiwi"],
  initialSetB = ["naranja", "kiwi", "uva", "sandía", "melón"],
}: SetVisualizationProps) {
  // Estado para los conjuntos
  const [setA, setSetA] = useState<string[]>([])
  const [setB, setSetB] = useState<string[]>([])
  const [resultSet, setResultSet] = useState<string[]>([])
  const [operation, setOperation] = useState<string>("union")

  // Estado para la interfaz
  const [newElement, setNewElement] = useState("")
  const [searchElement, setSearchElement] = useState("")
  const [activeSet, setActiveSet] = useState<"A" | "B">("A")
  const [highlightedElements, setHighlightedElements] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [searchResult, setSearchResult] = useState<boolean | null>(null)

  // Inicializar los conjuntos
  useEffect(() => {
    setSetA(initialSetA)
    setSetB(initialSetB)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Realizar operación entre conjuntos cuando cambian los conjuntos o la operación
  useEffect(() => {
    // Solo calculamos el resultado, sin llamar a setOperation dentro de performSetOperation
    let result: string[] = []

    switch (operation) {
      case "union":
        // A ∪ B: Elementos que están en A, en B, o en ambos
        result = [...new Set([...setA, ...setB])]
        break
      case "intersection":
        // A ∩ B: Elementos que están tanto en A como en B
        result = setA.filter((x) => setB.includes(x))
        break
      case "difference":
        // A - B: Elementos que están en A pero no en B
        result = setA.filter((x) => !setB.includes(x))
        break
      case "symmetricDifference":
        // A △ B: Elementos que están en A o en B, pero no en ambos
        result = [...setA.filter((x) => !setB.includes(x)), ...setB.filter((x) => !setA.includes(x))]
        break
      case "subset":
        // Verificar si A ⊆ B (todos los elementos de A están en B)
        const isSubset = setA.every((x) => setB.includes(x))
        toast( isSubset? "Todos los elementos de A están en B" : "Hay elementos en A que no están en B" )
        break
      case "superset":
        // Verificar si A ⊇ B (todos los elementos de B están en A)
        const isSuperset = setB.every((x) => setA.includes(x))
        toast( isSuperset ? "Todos los elementos de B están en A" : "Hay elementos en B que no están en A")
        break
    }

    setResultSet(result)
  }, [operation, setA, setB])

  // Añadir un elemento al conjunto activo
  const handleAddElement = () => {
    if (!newElement.trim()) {
      toast( "Por favor ingresa un elemento para añadir")
      return
    }

    const currentSet = activeSet === "A" ? setA : setB

    if (currentSet.includes(newElement)) {
      toast(`El elemento "${newElement}" ya existe en el conjunto ${activeSet}`)
      return
    }

    setIsAnimating(true)
    setHighlightedElements([newElement])

    setTimeout(() => {
      if (activeSet === "A") {
        setSetA([...setA, newElement])
      } else {
        setSetB([...setB, newElement])
      }

      setNewElement("")
      setIsAnimating(false)
      setHighlightedElements([])

      toast(`Se ha añadido "${newElement}" al conjunto ${activeSet}`)
    }, 800)
  }

  // Eliminar un elemento del conjunto
  const handleRemoveElement = (element: string, fromSet: "A" | "B") => {
    setIsAnimating(true)
    setHighlightedElements([element])

    setTimeout(() => {
      if (fromSet === "A") {
        setSetA(setA.filter((item) => item !== element))
      } else {
        setSetB(setB.filter((item) => item !== element))
      }

      setIsAnimating(false)
      setHighlightedElements([])

      toast(`Se ha eliminado "${element}" del conjunto ${fromSet}`)
    }, 800)
  }

  // Buscar un elemento en los conjuntos
  const handleSearch = () => {
    if (!searchElement.trim()) {
      toast( "Por favor ingresa un elemento para buscar")
      return
    }

    setIsAnimating(true)
    setHighlightedElements([searchElement])

    setTimeout(() => {
      const inSetA = setA.includes(searchElement)
      const inSetB = setB.includes(searchElement)

      setSearchResult(inSetA || inSetB)

      if (inSetA || inSetB) {
        toast( `"${searchElement}" está presente en ${
            inSetA && inSetB ? "ambos conjuntos" : inSetA ? "el conjunto A" : "el conjunto B"
          }`)
      } else {
        toast( `"${searchElement}" no está presente en ningún conjunto`)
      }

      setTimeout(() => {
        setIsAnimating(false)
        setHighlightedElements([])
        setSearchElement("")
      }, 1500)
    }, 800)
  }

  // Realizar operaciones entre conjuntos
  const performSetOperation = (op: string) => {
    // Esta función ahora solo cambia la operación, no calcula el resultado
    setOperation(op)
  }

  // Reiniciar los conjuntos
  const handleReset = () => {
    setSetA(initialSetA)
    setSetB(initialSetB)
    setNewElement("")
    setSearchElement("")
    setSearchResult(null)
    setHighlightedElements([])
    setIsAnimating(false)
    setOperation("union")
  }

  // Renderizar un conjunto
  const renderSet = (set: string[], setName: "A" | "B") => {
    return (
      <div className="border rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Conjunto {setName}</h3>
          <Badge variant="outline">{set.length} elementos</Badge>
        </div>

        {set.length === 0 ? (
          <div className="text-muted-foreground italic p-4 text-center">Conjunto vacío</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {set.map((element, index) => (
              <div
                key={index}
                className={cn(
                  "group relative px-3 py-1.5 rounded-md text-sm transition-all duration-300",
                  highlightedElements.includes(element)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {element}
                <button
                  onClick={() => handleRemoveElement(element, setName)}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isAnimating}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Renderizar el conjunto resultado
  const renderResultSet = () => {
    return (
      <div className="border rounded-md p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Resultado: {getOperationName(operation)}</h3>
          <Badge variant="outline">{resultSet.length} elementos</Badge>
        </div>

        {resultSet.length === 0 ? (
          <div className="text-muted-foreground italic p-4 text-center">Conjunto vacío</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {resultSet.map((element, index) => (
              <div
                key={index}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm",
                  setA.includes(element) && setB.includes(element)
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : setA.includes(element)
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
                )}
              >
                {element}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900"></div>
            <span>Elementos en ambos conjuntos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900"></div>
            <span>Elementos solo en conjunto A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-100 dark:bg-purple-900"></div>
            <span>Elementos solo en conjunto B</span>
          </div>
        </div>
      </div>
    )
  }

  // Obtener el nombre de la operación
  const getOperationName = (op: string): string => {
    switch (op) {
      case "union":
        return "Unión (A ∪ B)"
      case "intersection":
        return "Intersección (A ∩ B)"
      case "difference":
        return "Diferencia (A - B)"
      case "symmetricDifference":
        return "Diferencia simétrica (A △ B)"
      default:
        return op
    }
  }

  // Renderizar el diagrama de Venn
  const renderVennDiagram = () => {
    // Contar elementos para cada región
    const onlyInA = setA.filter((x) => !setB.includes(x)).length
    const onlyInB = setB.filter((x) => !setA.includes(x)).length
    const inBoth = setA.filter((x) => setB.includes(x)).length

    return (
      <div className="border rounded-md p-4 flex flex-col items-center">
        <h3 className="text-lg font-medium mb-4">Diagrama de Venn</h3>

        <div className="relative w-64 h-48">
          {/* Círculo A */}
          <div
            className={cn(
              "absolute w-32 h-32 rounded-full left-4 top-8",
              "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800",
              operation === "difference" ? "opacity-100" : "opacity-70",
            )}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">A</div>
            {onlyInA > 0 && (
              <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm">
                {onlyInA}
              </div>
            )}
          </div>

          {/* Círculo B */}
          <div
            className={cn(
              "absolute w-32 h-32 rounded-full right-4 top-8",
              "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800",
              "opacity-70",
            )}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">B</div>
            {onlyInB > 0 && (
              <div className="absolute right-1/4 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-sm">
                {onlyInB}
              </div>
            )}
          </div>

          {/* Intersección */}
          <div
            className={cn(
              "absolute w-12 h-12 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
              "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800",
              operation === "intersection" ? "opacity-100" : "opacity-70",
            )}
          >
            {inBoth > 0 && (
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm">
                {inBoth}
              </div>
            )}
          </div>

          {/* Resaltar la operación actual */}
          {operation === "union" && <div className="absolute inset-0 border-2 border-primary rounded-md"></div>}
          {operation === "symmetricDifference" && (
            <>
              <div
                className={cn(
                  "absolute w-32 h-32 rounded-full left-4 top-8",
                  "border-2 border-primary",
                  "opacity-70 z-10",
                )}
              ></div>
              <div
                className={cn(
                  "absolute w-32 h-32 rounded-full right-4 top-8",
                  "border-2 border-primary",
                  "opacity-70 z-10",
                )}
              ></div>
              <div
                className={cn(
                  "absolute w-12 h-12 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
                  "border-2 border-destructive",
                  "opacity-70 z-20",
                )}
              ></div>
            </>
          )}
        </div>

        <div className="mt-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <div>|A| = {setA.length}</div>
            <div>|B| = {setB.length}</div>
            <div>|A ∩ B| = {inBoth}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg w-[70%]">
      <div className="space-y-2">
        <h2 className="text-3xl underline font-bold">Conjuntos (Sets)</h2>
        <p className="text-muted-foreground">
          Un conjunto es una colección de elementos únicos sin orden específico. Los conjuntos son útiles para
          operaciones como unión, intersección y diferencia, así como para verificar la pertenencia de elementos.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="operations">Operaciones</TabsTrigger>
            <TabsTrigger value="sets">Conjuntos</TabsTrigger>
            <TabsTrigger value="visualization">Visualización</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Añadir elemento</Label>
                <div className="flex gap-2">
                  <Select value={activeSet} onValueChange={(value) => setActiveSet(value as "A" | "B")}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Conjunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Conjunto A</SelectItem>
                      <SelectItem value="B">Conjunto B</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={newElement}
                    onChange={(e) => setNewElement(e.target.value)}
                    placeholder="Elemento"
                    disabled={isAnimating}
                  />
                  <Button onClick={handleAddElement} disabled={isAnimating || !newElement}>
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Buscar elemento</Label>
                <div className="flex gap-2">
                  <Input
                    value={searchElement}
                    onChange={(e) => setSearchElement(e.target.value)}
                    placeholder="Elemento a buscar"
                    disabled={isAnimating}
                  />
                  <Button onClick={handleSearch} disabled={isAnimating || !searchElement} variant="secondary">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>

              {searchResult !== null && (
                <div
                  className={cn(
                    "p-4 rounded-md border",
                    searchResult
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                  )}
                >
                  <div className="font-medium">
                    {searchResult
                      ? `"${searchElement}" está presente en los conjuntos`
                      : `"${searchElement}" no está presente en ningún conjunto`}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Operaciones entre conjuntos</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={operation === "union" ? "default" : "outline"}
                    onClick={() => performSetOperation("union")}
                  >
                    Unión (A ∪ B)
                  </Button>
                  <Button
                    variant={operation === "intersection" ? "default" : "outline"}
                    onClick={() => performSetOperation("intersection")}
                  >
                    Intersección (A ∩ B)
                  </Button>
                  <Button
                    variant={operation === "difference" ? "default" : "outline"}
                    onClick={() => performSetOperation("difference")}
                  >
                    Diferencia (A - B)
                  </Button>
                  <Button
                    variant={operation === "symmetricDifference" ? "default" : "outline"}
                    onClick={() => performSetOperation("symmetricDifference")}
                  >
                    Diferencia simétrica
                  </Button>
                  <Button
                    variant={operation === "subset" ? "default" : "outline"}
                    onClick={() => performSetOperation("subset")}
                  >
                    ¿A ⊆ B?
                  </Button>
                  <Button
                    variant={operation === "superset" ? "default" : "outline"}
                    onClick={() => performSetOperation("superset")}
                  >
                    ¿A ⊇ B?
                  </Button>
                </div>
              </div>

              <Button variant="outline" onClick={handleReset} className="w-full" disabled={isAnimating}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSet(setA, "A")}
              {renderSet(setB, "B")}
            </div>

            {["union", "intersection", "difference", "symmetricDifference"].includes(operation) && renderResultSet()}
          </TabsContent>

          <TabsContent value="visualization" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderVennDiagram()}

              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Notación matemática</h3>

                <div className="space-y-3 text-sm">
                  <div className="p-2 bg-muted rounded-md">
                    <div className="font-medium">Unión (A ∪ B)</div>
                    <div className="mt-1">{`{x | x ∈ A o x ∈ B}`}</div>
                    <div className="mt-1 text-muted-foreground">Elementos que están en A, en B, o en ambos</div>
                  </div>

                  <div className="p-2 bg-muted rounded-md">
                    <div className="font-medium">Intersección (A ∩ B)</div>
                    <div className="mt-1">{`{x | x ∈ A y x ∈ B}`}</div>
                    <div className="mt-1 text-muted-foreground">Elementos que están tanto en A como en B</div>
                  </div>

                  <div className="p-2 bg-muted rounded-md">
                    <div className="font-medium">Diferencia (A - B)</div>
                    <div className="mt-1">{`{x | x ∈ A y x ∉ B}`}</div>
                    <div className="mt-1 text-muted-foreground">Elementos que están en A pero no en B</div>
                  </div>

                  <div className="p-2 bg-muted rounded-md">
                    <div className="font-medium">Diferencia simétrica (A △ B)</div>
                    <div className="mt-1">{`{x | (x ∈ A y x ∉ B) o (x ∈ B y x ∉ A)}`}</div>
                    <div className="mt-1 text-muted-foreground">Elementos que están en A o en B, pero no en ambos</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Representación en código</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-sm mb-2">JavaScript (Set)</div>
                  <pre className="p-2 bg-muted rounded-md overflow-x-auto text-xs">
                    {`// Crear conjuntos
const setA = ['${setA.join("', '")}'];
const setB = ['${setB.join("', '")}'];

// Unión
const union = [...new Set([...setA, ...setB])];

// Intersección
const intersection = setA.filter(x => setB.includes(x));

// Diferencia (A - B)
const difference = setA.filter(x => !setB.includes(x));

// Diferencia simétrica
const symmetricDifference = [
  ...setA.filter(x => !setB.includes(x)),
  ...setB.filter(x => !setA.includes(x))
];`}
                  </pre>
                </div>

                <div>
                  <div className="font-medium text-sm mb-2">Python (set)</div>
                  <pre className="p-2 bg-muted rounded-md overflow-x-auto text-xs">
                    {`# Crear conjuntos
set_a = {'${setA.join("', '")}'}
set_b = {'${setB.join("', '")}'}

# Unión
union = set_a | set_b  # o set_a.union(set_b)

# Intersección
intersection = set_a & set_b  # o set_a.intersection(set_b)

# Diferencia (A - B)
difference = set_a - set_b  # o set_a.difference(set_b)

# Diferencia simétrica
symmetric_difference = set_a ^ set_b  # o set_a.symmetric_difference(set_b)

# Verificar subconjunto
is_subset = set_a <= set_b  # o set_a.issubset(set_b)

# Verificar superconjunto
is_superset = set_a >= set_b  # o set_a.issuperset(set_b)`}
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Información educativa */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="complexity">
            <AccordionTrigger>Complejidad de tiempo</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Añadir elemento:</span> O(n) peor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Eliminar elemento:</span> O(n) peor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Buscar elemento:</span> O(n) peor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Unión:</span> O(n + m)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Intersección:</span> O(n * m) peor caso, O(n) mejor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Diferencia:</span> O(n * m) peor caso, O(n) mejor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Diferencia simétrica:</span> O(n + m)
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Verificar subconjunto/superconjunto:</span> O(n * m) peor caso, O(n)
                  mejor caso
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

