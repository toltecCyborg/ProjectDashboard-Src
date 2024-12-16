import { ITaskListItem, IGateListItem } from "../../../models";

// Función para agrupar
export function GroupByGate(data: ITaskListItem[]): IGateListItem[] {
  const group = data.reduce<Record<string, IGateListItem>>((acc, item) => {
    if (!acc[item.Title]) {
      acc[item.Title] = {
        Title: "",
        Complete: 0,
        Count: 0,
        Delay: 0,
        Id: "0",
        Status: "Completed",
      };
    }

    acc[item.Title].Complete = Math.max(
      acc[item.Title].Complete,
      item.Complete
    );
    acc[item.Title].Count += 1;
    acc[item.Title].Delay = Math.max(acc[item.Title].Delay, item.Delay);

    //acc[item.Title].push(item);
    return acc;
  }, {});

  //acc[item.title].push(item);
  return Object.values(group).map((group) => ({
    Title: group.Title,
    Complete: group.averageComplete,
    Delay: group.maxDelay,
    Id: group.Id,
    Status: group.Status,
    Count: group.Count,
  }));
}

// Calcular métricas por grupo
//   const metrics = Object.keys(groupedData).map((Title) => {
//     const tasks = groupedData[Title];

//     // Calcular promedio de 'complete'
//     const averageComplete =
//       tasks.reduce(
//         (sum: any, task: { complete: number }) => sum + task.complete,
//         0
//       ) / tasks.length;

//     // Calcular valor máximo de 'delay'
//     const maxDelay = tasks.reduce(
//       (max: any, task: { delay: number }) => Math.max(max, task.delay),
//       0
//     );

//     return {
//       Title,
//       averageComplete,
//       maxDelay,
//     };
//   });

//   // Convertir los grupos en un arreglo
//   return Object.values(metrics).map((group) => ({
//     Title: group.Title,
//     Complete: group.averageComplete,
//     Delay: group.maxDelay,
//     Id: "",
//     Status: "",
//     Count: 0,
//   }));
// }
