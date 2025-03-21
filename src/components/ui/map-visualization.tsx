"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Search, RefreshCw, Edit, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Función simple de hash para demostración
const simpleHash = (key: string, size: number): number => {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i)) % size
  }
  return hash
}

interface MapEntry {
  key: string
  value: string
  hash?: number
}

interface MapVisualizationProps {
  initialEntries?: MapEntry[]
  hashTableSize?: number
}

export default function MapVisualization({
  initialEntries = [
    { key: "nombre", value: "Juan" },
    { key: "edad", value: "25" },
    { key: "ciudad", value: "Madrid" },
    { key: "profesión", value: "Ingeniero" },
    { key: "email", value: "juan@ejemplo.com" },
  ],
  hashTableSize = 10,
}: MapVisualizationProps) {
  const [entries, setEntries] = useState<MapEntry[]>([])
  const [hashTable, setHashTable] = useState<MapEntry[][]>(
    Array(hashTableSize)
      .fill([])
      .map(() => []),
  )
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [searchResult, setSearchResult] = useState<MapEntry | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [activeHashIndex, setActiveHashIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [operation, setOperation] = useState<string | null>(null)
  const [implementationType, setImplementationType] = useState<"object" | "hashTable">("object")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")

  // Inicializar el mapa con valores predeterminados
  useEffect(() => {
    if (entries.length === 0) {
      setEntries(initialEntries)

      // Inicializar la tabla hash
      const newHashTable: MapEntry[][] = Array(hashTableSize)
        .fill([])
        .map(() => [])
      initialEntries.forEach((entry) => {
        const hash = simpleHash(entry.key, hashTableSize)
        const entryWithHash = { ...entry, hash }
        newHashTable[hash] = [...newHashTable[hash], entryWithHash]
      })
      setHashTable(newHashTable)
    }
  }, [initialEntries, hashTableSize, entries.length])

  // Manejar la inserción de un nuevo par clave-valor
  const handleInsert = () => {
    if (!key.trim() || !value.trim()) {
      toast(
        "Por favor ingresa una clave y un valor"
      )
      return
    }

    // Verificar si la clave ya existe
    const existingIndex = entries.findIndex((entry) => entry.key === key)
    if (existingIndex !== -1) {
      toast(`La clave "${key}" ya existe. Usa la operación de actualización.`
)
      return
    }

    setOperation("insert")
    setIsAnimating(true)

    setTimeout(() => {
      const newEntry = { key, value }

      // Actualizar la lista de entradas
      setEntries([...entries, newEntry])

      // Actualizar la tabla hash
      const hash = simpleHash(key, hashTableSize)
      const entryWithHash = { ...newEntry, hash }
      const newHashTable = [...hashTable]
      newHashTable[hash] = [...newHashTable[hash], entryWithHash]
      setHashTable(newHashTable)

      // Animar la inserción
      if (implementationType === "object") {
        setActiveIndex(entries.length)
      } else {
        setActiveHashIndex(hash)
      }

      setTimeout(() => {
        setKey("")
        setValue("")
        setIsAnimating(false)
        setOperation(null)
        setActiveIndex(null)
        setActiveHashIndex(null)

        toast( `Se ha insertado la clave "${key}" con valor "${value}"`)
      }, 1000)
    }, 500)
  }

  // Manejar la búsqueda de un valor por clave
  const handleSearch = () => {
    if (!searchKey.trim()) {
      toast("Por favor ingresa una clave para buscar")
      return
    }

    setOperation("search")
    setIsAnimating(true)
    setSearchResult(null)

    // Simular la búsqueda con animación
    setTimeout(() => {
      if (implementationType === "object") {
        // Búsqueda en la lista de entradas
        const foundIndex = entries.findIndex((entry) => entry.key === searchKey)

        if (foundIndex !== -1) {
          setActiveIndex(foundIndex)
          setSearchResult(entries[foundIndex])

          toast( `Valor para la clave "${searchKey}": "${entries[foundIndex].value}"`)
        } else {
          toast(`No se encontró la clave "${searchKey}"`)
        }
      } else {
        // Búsqueda en la tabla hash
        const hash = simpleHash(searchKey, hashTableSize)
        setActiveHashIndex(hash)

        const bucket = hashTable[hash]
        const foundEntry = bucket.find((entry) => entry.key === searchKey)

        if (foundEntry) {
          setSearchResult(foundEntry)

          toast(`Valor para la clave "${searchKey}": "${foundEntry.value}"`)
        } else {
          toast(`No se encontró la clave "${searchKey}"`)
        }
      }

      setTimeout(() => {
        setIsAnimating(false)
        setOperation(null)
        setActiveIndex(null)
        setActiveHashIndex(null)
        setSearchKey("")
      }, 2000)
    }, 500)
  }

  // Manejar la eliminación de una entrada
  const handleDelete = (entryKey: string) => {
    setOperation("delete")
    setIsAnimating(true)

    setTimeout(() => {
      // Encontrar la entrada a eliminar
      const index = entries.findIndex((entry) => entry.key === entryKey)

      if (index !== -1) {
        setActiveIndex(index)

        // Actualizar la lista de entradas
        const newEntries = [...entries]
        newEntries.splice(index, 1)

        // Actualizar la tabla hash
        const hash = simpleHash(entryKey, hashTableSize)
        setActiveHashIndex(hash)

        const newHashTable = [...hashTable]
        newHashTable[hash] = newHashTable[hash].filter((entry) => entry.key !== entryKey)

        setTimeout(() => {
          setEntries(newEntries)
          setHashTable(newHashTable)
          setIsAnimating(false)
          setOperation(null)
          setActiveIndex(null)
          setActiveHashIndex(null)

          toast( `Se ha eliminado la clave "${entryKey}"`)
        }, 500)
      }
    }, 500)
  }

  // Manejar la edición de una entrada
  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(entries[index].value)
  }

  // Guardar la edición
  const handleSaveEdit = (index: number) => {
    const entryKey = entries[index].key

    setOperation("update")
    setIsAnimating(true)
    setActiveIndex(index)

    setTimeout(() => {
      // Actualizar la lista de entradas
      const newEntries = [...entries]
      newEntries[index] = { ...newEntries[index], value: editValue }

      // Actualizar la tabla hash
      const hash = simpleHash(entryKey, hashTableSize)
      setActiveHashIndex(hash)

      const newHashTable = [...hashTable]
      const bucketIndex = newHashTable[hash].findIndex((entry) => entry.key === entryKey)

      if (bucketIndex !== -1) {
        newHashTable[hash][bucketIndex] = { ...newHashTable[hash][bucketIndex], value: editValue }
      }

      setTimeout(() => {
        setEntries(newEntries)
        setHashTable(newHashTable)
        setIsAnimating(false)
        setOperation(null)
        setActiveIndex(null)
        setActiveHashIndex(null)
        setEditingIndex(null)
        setEditValue("")

        toast( `Se ha actualizado el valor de "${entryKey}" a "${editValue}"`)
      }, 500)
    }, 500)
  }

  // Cancelar la edición
  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditValue("")
  }

  // Reiniciar el mapa
  const handleReset = () => {
    setEntries(initialEntries)

    // Reiniciar la tabla hash
    const newHashTable: MapEntry[][] = Array(hashTableSize)
      .fill([])
      .map(() => [])
    initialEntries.forEach((entry) => {
      const hash = simpleHash(entry.key, hashTableSize)
      const entryWithHash = { ...entry, hash }
      newHashTable[hash] = [...newHashTable[hash], entryWithHash]
    })

    setHashTable(newHashTable)
    setKey("")
    setValue("")
    setSearchKey("")
    setSearchResult(null)
    setActiveIndex(null)
    setActiveHashIndex(null)
    setIsAnimating(false)
    setOperation(null)
    setEditingIndex(null)
    setEditValue("")
  }

  // Renderizar la visualización de la tabla hash
  const renderHashTable = () => {
    return (
      <div className="grid grid-cols-1 gap-2">
        {hashTable.map((bucket, index) => (
          <div
            key={index}
            className={cn(
              "border rounded-md p-2",
              activeHashIndex === index ? "border-primary" : "border-border",
              bucket.length > 1 ? "bg-yellow-50 dark:bg-yellow-950/20" : "",
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md">Índice {index}</div>
              {bucket.length > 1 && (
                <div className="text-yellow-600 dark:text-yellow-400 text-xs">Colisión ({bucket.length} elementos)</div>
              )}
            </div>

            {bucket.length === 0 ? (
              <div className="text-muted-foreground text-sm italic py-2 px-3">Vacío</div>
            ) : (
              <div className="space-y-2">
                {bucket.map((entry, entryIndex) => (
                  <div
                    key={entryIndex}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md",
                      searchResult?.key === entry.key ? "bg-green-100 dark:bg-green-900/30" : "bg-card",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{entry.key}:</span>
                      <span className="text-sm">{entry.value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleDelete(entry.key)}
                        disabled={isAnimating}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg w-[70%]">
      <div className="space-y-2">
        <h2 className="text-3xl underline  font-bold">Mapa (Map/Dictionary)</h2>
        <p className="text-muted-foreground">
          Un mapa (también conocido como diccionario o tabla hash) es una estructura de datos que almacena pares
          clave-valor, permitiendo acceso rápido a los valores mediante sus claves.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Implementación</h3>
            <Select
              value={implementationType}
              onValueChange={(value: string) => setImplementationType(value as "object" | "hashTable")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de implementación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="object">Objeto simple</SelectItem>
                <SelectItem value="hashTable">Tabla Hash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="operations" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="operations">Operaciones</TabsTrigger>
              <TabsTrigger value="visualization">Visualización</TabsTrigger>
            </TabsList>

            <TabsContent value="operations" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Insertar par clave-valor</Label>
                  <div className="flex gap-2">
                    <Input
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Clave"
                      disabled={isAnimating}
                    />
                    <Input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Valor"
                      disabled={isAnimating}
                    />
                    <Button onClick={handleInsert} disabled={isAnimating || !key || !value}>
                      <Plus className="h-4 w-4 mr-2" />
                      Insertar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Buscar por clave</Label>
                  <div className="flex gap-2">
                    <Input
                      value={searchKey}
                      onChange={(e) => setSearchKey(e.target.value)}
                      placeholder="Clave a buscar"
                      disabled={isAnimating}
                    />
                    <Button onClick={handleSearch} disabled={isAnimating || !searchKey} variant="secondary">
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>

                {searchResult && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                    <div className="font-medium">Resultado de la búsqueda:</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono">{searchResult.key}:</span>
                      <span>{searchResult.value}</span>
                    </div>
                  </div>
                )}

                <Button variant="outline" onClick={handleReset} className="w-full" disabled={isAnimating}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="visualization" className="space-y-4">
              {implementationType === "object" ? (
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-4">Visualización como objeto</h3>

                  {entries.length === 0 ? (
                    <div className="text-muted-foreground italic">Mapa vacío</div>
                  ) : (
                    <div className="space-y-2">
                      {entries.map((entry, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-md transition-all duration-300",
                            index === activeIndex
                              ? "bg-primary text-primary-foreground"
                              : searchResult?.key === entry.key
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-secondary text-secondary-foreground",
                            operation === "delete" && index === activeIndex && isAnimating ? "opacity-50" : "",
                            operation === "insert" && index === entries.length - 1 && isAnimating
                              ? "animate-fade-in"
                              : "",
                          )}
                        >
                          {editingIndex === index ? (
                            <div className="flex items-center gap-2 w-full">
                              <span className="font-mono font-medium">{entry.key}:</span>
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 flex-1"
                                autoFocus
                              />
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleSaveEdit(index)}
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-medium">{entry.key}:</span>
                                <span>{entry.value}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleEdit(index)}
                                  disabled={isAnimating}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleDelete(entry.key)}
                                  disabled={isAnimating}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>
                      En JavaScript, los objetos son una implementación común de mapas donde las claves son strings.
                    </p>
                    <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto">
                      {`const mapa = {
  ${entries.map((entry) => `"${entry.key}": "${entry.value}"`).join(",\n  ")}
};`}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-4">Visualización como tabla hash</h3>

                  <div className="space-y-2">{renderHashTable()}</div>

                  <div className="mt-4 text-xs text-muted-foreground">
                    <p>
                      Una tabla hash utiliza una función hash para calcular un índice donde almacenar cada valor. Las
                      colisiones ocurren cuando diferentes claves generan el mismo índice.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Información educativa */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="complexity">
            <AccordionTrigger>Complejidad de tiempo</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Inserción:</span> O(1) promedio, O(n) peor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Búsqueda:</span> O(1) promedio, O(n) peor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Eliminación:</span> O(1) promedio, O(n) peor caso
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <span className="font-semibold">Actualización:</span> O(1) promedio, O(n) peor caso
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                El peor caso O(n) ocurre cuando hay muchas colisiones y la tabla hash degenera en una lista enlazada.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="implementations">
            <AccordionTrigger>Implementaciones</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Tabla Hash con encadenamiento</h4>
                  <p>Cada posición de la tabla contiene una lista de elementos que colisionan en ese índice.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Tabla Hash con direccionamiento abierto</h4>
                  <p>
                    Cuando ocurre una colisión, se busca otra posición en la tabla según alguna estrategia (sondeo
                    lineal, cuadrático, etc.).
                  </p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Árbol de búsqueda</h4>
                  <p>Implementación basada en árboles (como árboles rojo-negro) que mantiene las claves ordenadas.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Objeto JavaScript</h4>
                  <p>En JavaScript, los objetos son mapas donde las claves son strings o símbolos.</p>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Map en JavaScript</h4>
                  <p>La clase Map permite usar cualquier valor como clave y mantiene el orden de inserción.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="applications">
            <AccordionTrigger>Aplicaciones</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Bases de datos</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Índices para búsqueda rápida</li>
                    <li>Almacenamiento clave-valor</li>
                    <li>Caché de consultas</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Programación</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Tablas de símbolos en compiladores</li>
                    <li>Memorización de funciones</li>
                    <li>Gestión de configuraciones</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Web</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Almacenamiento de sesiones</li>
                    <li>Gestión de cookies</li>
                    <li>Caché del navegador</li>
                    <li>Gestión de estado en aplicaciones</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Otros</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Detección de duplicados</li>
                    <li>Conteo de frecuencias</li>
                    <li>Implementación de conjuntos</li>
                    <li>Sistemas de archivos</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hash-functions">
            <AccordionTrigger>Funciones Hash</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <p>
                  Una función hash convierte datos de tamaño variable en valores de tamaño fijo. Una buena función hash
                  debe:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Ser rápida de calcular</li>
                  <li>Distribuir uniformemente los valores</li>
                  <li>Minimizar colisiones</li>
                  <li>Generar el mismo hash para la misma entrada</li>
                </ul>

                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Ejemplos de funciones hash</h4>
                  <div className="mt-2 space-y-2">
                    <div>
                      <div className="font-mono text-xs">Función hash simple (para strings):</div>
                      <pre className="mt-1 p-2 bg-secondary rounded-md overflow-x-auto text-xs">
                        {`function simpleHash(str, tableSize) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash + str.charCodeAt(i)) % tableSize;
  }
  return hash;
}`}
                      </pre>
                    </div>

                    <div>
                      <div className="font-mono text-xs">Función hash djb2 (más eficiente):</div>
                      <pre className="mt-1 p-2 bg-secondary rounded-md overflow-x-auto text-xs">
                        {`function djb2Hash(str, tableSize) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash) % tableSize;  {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash) % tableSize;
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-muted rounded-md">
                  <h4 className="font-semibold">Manejo de colisiones</h4>
                  <p className="mt-1">Estrategias para manejar cuando dos claves generan el mismo hash:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                    <li>
                      <span className="font-medium text-foreground">Encadenamiento:</span> Cada posición contiene una
                      lista de elementos
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Sondeo lineal:</span> Buscar la siguiente posición
                      disponible
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Sondeo cuadrático:</span> Buscar en posiciones que
                      crecen cuadráticamente
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Doble hash:</span> Usar una segunda función hash
                      para determinar el paso
                    </li>
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
                    <li>Acceso rápido O(1) en promedio</li>
                    <li>Búsqueda eficiente por clave</li>
                    <li>Inserción y eliminación rápidas</li>
                    <li>Flexibilidad en tipos de claves</li>
                    <li>Ideal para búsquedas y cachés</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600 dark:text-red-400">Desventajas</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>No mantiene orden (excepto Map en JS)</li>
                    <li>Colisiones pueden degradar rendimiento</li>
                    <li>Requiere buena función hash</li>
                    <li>Mayor uso de memoria que arrays</li>
                    <li>Peor caso O(n) si hay muchas colisiones</li>
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

