import { IGateListItem } from "../../../models";

// Función para agrupar
export function GroupByProject(data: IGateListItem[]) {

  const project = data.reduce( (acc, item) => {
      acc.Complete += item.Complete; // Acumular valores de "Complete"
      acc.Count += 1;                    // Contar los elementos
      acc.Delay = Math.max(acc.Delay, item.Delay); // Calcular el valor máximo de "Delay"
      return acc;
    },
    { Complete: 0, Count: 0, Delay: 0 } 
  );

  project.Complete = Math.round((project.Complete / project.Count) *100);
  return project;
}
