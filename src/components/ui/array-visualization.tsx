"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ArrayVisualizationProps {
  initialArray?: number[];
}

export default function ArrayVisualization({
  initialArray = [5, 12, 8, 3, 17, 9],
}: ArrayVisualizationProps) {
  const [array, setArray] = useState<number[]>(initialArray);
  const [newValue, setNewValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddElement = () => {
    const value = Number.parseInt(newValue);
    if (isNaN(value)) {
      toast("Por favor ingresa un número válido");
      return;
    }

    setIsAnimating(true);
    setActiveIndices([array.length]);

    setTimeout(() => {
      setArray([...array, value]);
      setNewValue("");
      setIsAnimating(false);
      setActiveIndices([]);
    }, 500);
  };

  const handleRemoveElement = (index: number) => {
    setIsAnimating(true);
    setActiveIndices([index]);

    setTimeout(() => {
      const newArray = [...array];
      newArray.splice(index, 1);
      setArray(newArray);
      setIsAnimating(false);
      setActiveIndices([]);
    }, 500);
  };

  const handleSearch = () => {
    const value = Number.parseInt(searchValue);
    if (isNaN(value)) {
      toast("Por favor ingresa un número válido para buscar");
      return;
    }

    setIsAnimating(true);
    setActiveIndices([]);

    // Simulate search animation
    const foundIndices: number[] = [];
    let currentIndex = 0;

    const searchInterval = setInterval(() => {
      if (currentIndex >= array.length) {
        clearInterval(searchInterval);
        setSearchResults(foundIndices);
        setIsAnimating(false);
        return;
      }

      setActiveIndices([currentIndex]);

      if (array[currentIndex] === value) {
        foundIndices.push(currentIndex);
      }

      currentIndex++;
    }, 300);
  };

  const handleReset = () => {
    setArray(initialArray);
    setSearchResults([]);
    setActiveIndices([]);
    setNewValue("");
    setSearchValue("");
  };

  return (
    <div className="p-y-6 p-4 bg-card rounded-lg w-[70%] ">
      <div className="p-y-2">
        <h2 className="text-3xl underline font-bold ">Arreglo(Array)</h2>
        <p className="text-muted-foreground">
          Un arreglo es una estructura de datos que almacena elementos en
          ubicaciones de memoria contiguas.
        </p>
      </div>

      <div className="flex flex-wrap gap-5  items-center">
        {array.map((value, index) => (
          <div
            key={index}
            className={cn(
              "relative flex items-center justify-center w-14 h-14 border-2 rounded-md transition-all duration-300",
              activeIndices.includes(index)
                ? "bg-primary text-primary-foreground border-primary scale-110"
                : searchResults.includes(index)
                ? "bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-700"
                : "bg-background border-border"
            )}
          >
            <span className="font-mono text-lg">{value}</span>
            <span className="absolute -bottom-6 text-xs text-muted-foreground">
              {index}
            </span>
            <button
              onClick={() => handleRemoveElement(index)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
              disabled={isAnimating}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        {array.length === 0 && (
          <div className="text-muted-foreground italic">Arreglo vacío</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-medium">Agregar elemento</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Valor"
              className="w-full"
              disabled={isAnimating}
            />
            <Button
              onClick={handleAddElement}
              disabled={isAnimating || !newValue}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-medium">Buscar elemento</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Valor a buscar"
              className="w-full"
              disabled={isAnimating}
            />
            <Button
              onClick={handleSearch}
              disabled={isAnimating || !searchValue}
              variant="secondary"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Complejidad de tiempo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div className="p-2 bg-muted rounded-md">
            <span className="font-semibold">Acceso:</span> O(1)
          </div>
          <div className="p-2 bg-muted rounded-md">
            <span className="font-semibold">Búsqueda:</span> O(n)
          </div>
          <div className="p-2 bg-muted rounded-md">
            <span className="font-semibold">Inserción al final:</span> O(1)
          </div>
          <div className="p-2 bg-muted rounded-md">
            <span className="font-semibold">Inserción al inicio:</span> O(n)
          </div>
          <div className="p-2 bg-muted rounded-md">
            <span className="font-semibold">Eliminación al final:</span> O(1)
          </div>
          <div className="p-2 bg-muted rounded-md">
            <span className="font-semibold">Eliminación al inicio:</span> O(n)
          </div>
        </div>
      </div>

      <Button variant="outline" onClick={handleReset} className="w-full">
        <RefreshCw className="h-4 w-4 mr-2" />
        Reiniciar
      </Button>
    </div>
  );
}
