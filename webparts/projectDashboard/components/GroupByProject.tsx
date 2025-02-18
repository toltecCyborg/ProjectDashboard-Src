import { IGateListItem } from "../../../models";

// Función para agrupar
export function GroupByProject(data: IGateListItem[]) {
  const summary = data.reduce(
    (acc, item) => {
      acc.Complete += item.Complete ? item.Complete : 0; // Acumular "Complete"
      acc.Count += 1; // Contar los elementos
      acc.Delay = Math.max(acc.Delay, item.Delay ? item.Delay : 0); // Máximo de "Delay"
      return acc;
    },
    { Complete: 0, Count: 0, Delay: 0 } // Inicialización
  );

  // Calcular promedio de "Complete" si hay datos
  summary.Complete = summary.Count > 0 ? Math.round(summary.Complete / summary.Count) : 0;

  //console.log("[GetProjectSummary] Complete:", data.length+"-"+summary.Complete, "Count:", summary.Count, "Delay:", summary.Delay);
  return summary;
}

