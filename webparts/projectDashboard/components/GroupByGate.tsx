import { ITaskListItem, IGateListItem } from "../../../models";
import { GetDelay } from "./GetDelay";

// Función para agrupar
export function GroupByGate(tasks: ITaskListItem[]): IGateListItem[] {
  const sortedItems = [...tasks].sort((b, a) =>
    b.Title.substring(0, 1).localeCompare(a.Title.substring(0, 1))
  );
  const groups = sortedItems.reduce<Record<string, IGateListItem>>(
    (gate, item) => {
      const { Title, Complete, Start, Finish, ActualFinish } = item;

      const startDate = Start ? new Date(Start) : null;
      const finishDate = Finish ? new Date(Finish) : null;
      const actualFinishDate = ActualFinish ? new Date(ActualFinish) : null;

      // Si el grupo no existe, inicialízalo
      if (!gate[Title]) {
        gate[Title] = {
          Title,
          Complete: 0,
          Delay: 0,
          Count: 0,
          Effort: 0,
          Start: startDate || new Date(),
          Finish: finishDate || new Date(),
          ActualFinish: actualFinishDate || new Date(),
          Id: Title.substring(0, 1),
        };
      }

      // Actualizar métricas del grupo
      //const gateumComplete = Math.(gate[Title].Complete, Complete);
      gate[Title].Id = Title.substring(0, 1);
      gate[Title].Complete += Complete;
      gate[Title].Count += 1;
      gate[Title].Delay = Math.max(
        gate[Title].Delay,
        GetDelay(Finish, ActualFinish)
      );
      if (startDate && startDate.getTime() < gate[Title].Start.getTime()) {
        gate[Title].Start = startDate;
      }
      if (finishDate && finishDate.getTime() > gate[Title].Finish.getTime()) {
        gate[Title].Finish = finishDate;
      }
      if (
        actualFinishDate &&
        actualFinishDate.getTime() > gate[Title].ActualFinish.getTime()
      ) {
        gate[Title].ActualFinish = actualFinishDate;
      }

      //gate[item.title].push(item);
      return gate;
    },
    {}
  );

  //const sortedItems = [...groups].sort((a, b) => b.Id.localeCompare(a.Id));

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
