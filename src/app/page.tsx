import ArrayVisualization from "@/components/ui/array-visualization";
import GraphVisualization from "@/components/ui/graph-visualization";
import LinkedListVisualizer from "@/components/ui/LinkedListVisualizer";
import MapVisualization from "@/components/ui/map-visualization";
import QueueVisualization from "@/components/ui/queue-visualization";
import SetVisualization from "@/components/ui/set-visualization";
import StackVisualization from "@/components/ui/stack-visualizations";
import TreeVisualization from "@/components/ui/tree-visualization";


export default function Home() {
  return (
    < div className="w-full h-max flex flex-col gap-10 justify-center items-center">
      <h1 className="text-4xl font-bold my-10 underline">Estructuras de datos</h1>
      <ArrayVisualization />
      <StackVisualization />
      <QueueVisualization />
      <LinkedListVisualizer />
      <TreeVisualization />
      <GraphVisualization />
      <MapVisualization />
      <SetVisualization />

 
    </div>
  );
}
