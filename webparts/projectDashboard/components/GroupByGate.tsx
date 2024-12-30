import { ITaskListItem, IGateListItem } from "../../../models";

// Función para agrupar
export function GroupByGate(data: ITaskListItem[]): IGateListItem[] {
  const groups = data.reduce<Record<string, IGateListItem>>((acc, item) => {
    const { Title, Complete, Delay } = item;

    // Si el grupo no existe, inicialízalo
    if (!acc[Title]) {
      acc[Title] = {
        Title,
        Complete: 0,
        Count: 0,
        Delay: 0,
        Id: "0",
        Status: "Completed",
      };
    }

    // Actualizar métricas del grupo
    //const accumComplete = Math.(acc[Title].Complete, Complete);
    acc[Title].Complete += Complete;
    acc[Title].Count += 1;
    acc[Title].Delay = Math.max(acc[Title].Delay, Delay);

    //acc[item.title].push(item);
    return acc;
  }, {});

  // Convertir los grupos en un arreglo
  return Object.values(groups).map((group) => ({
    Title: group.Title,
    Complete: group.Complete/group.Count,
    Count: group.Count,
    Delay: group.Delay,
    Id: group.Id,
    Status: group.Status,
  }));
}
