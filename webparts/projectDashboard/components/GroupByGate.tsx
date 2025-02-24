import { ITaskListItem, IGateListItem } from "../../../models";
import { GetDelay } from "./GetDelay";

// Función para agrupar
export function GroupByGate(data: ITaskListItem[]): IGateListItem[] {
  const groups = data.reduce<Record<string, IGateListItem>>((acc, item) => {
    const { Title, Complete, Start, Finish, ActualFinish } = item;

    const startDate = Start ? new Date(Start) : null;
    const finishDate = Finish ? new Date(Finish) : null;
    const actualFinishDate = ActualFinish ? new Date(ActualFinish) : null;

    // Si el grupo no existe, inicialízalo
    if (!acc[Title]) {
      acc[Title] = {
        Title,
        Complete: 0,
        Delay: 0,
        Count: 0,
        Effort: 0,
        Start: startDate || new Date(),
        Finish: finishDate || new Date(),
        ActualFinish: actualFinishDate || new Date(),
        Id: "0",
      };
    }

    // Actualizar métricas del grupo
    //const accumComplete = Math.(acc[Title].Complete, Complete);
    acc[Title].Complete += Complete;
    acc[Title].Count += 1;
    acc[Title].Delay = Math.max(
      acc[Title].Delay,
      GetDelay(Finish, ActualFinish)
    );
    if (startDate && startDate.getTime() < acc[Title].Start.getTime()) {
      acc[Title].Start = startDate;
    }
    if (finishDate && finishDate.getTime() > acc[Title].Finish.getTime()) {
      acc[Title].Finish = finishDate;
    }
    if (
      actualFinishDate &&
      actualFinishDate.getTime() > acc[Title].ActualFinish.getTime()
    ) {
      acc[Title].ActualFinish = actualFinishDate;
    }

    //acc[item.title].push(item);
    return acc;
  }, {});

  // Convertir los grupos en un arreglo
  return Object.values(groups).map((group) => ({
    Title: group.Title,
    Complete: group.Complete / group.Count,
    Count: group.Count,
    Delay: group.Delay,
    Id: group.Id,
    Effort: group.Effort,
    Start: group.Start,
    Finish: group.Finish,
    ActualFinish: group.ActualFinish,
  }));
}
