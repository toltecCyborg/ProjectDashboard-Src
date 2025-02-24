import { IGateListItem } from "../../../models";

// Función para agrupar
export function GroupByProject(data: IGateListItem[]) {
  // const summary = data.reduce(
  //   (acc, item) => {
  //     acc.Complete += item.Complete ? item.Complete : 0; // Acumular "Complete"
  //     acc.Count += 1; // Contar los elementos
  //     acc.Delay = Math.max(acc.Delay, item.Delay ? item.Delay : 0); // Máximo de "Delay"
  //     return acc;
  //   },
  //   { Complete: 0, Count: 0, Delay: 0 } // Inicialización
  // );

  // // Calcular promedio de "Complete" si hay datos
  // summary.Complete = summary.Count > 0 ? Math.round(summary.Complete / summary.Count) : 0;

  let complete: number = 0;
  let delay: number = 0;
  let effort: number = 0;
  let count: number = 0;
  let start = new Date();
  let end = new Date();
  let actualEnd = new Date();

  if (data.length > 0) {
    for (count = 0; count < data.length; count++) {
      complete += data[count].Complete ? data[count].Complete : 0; // Acumular "Complete"
      effort += data[count].Effort ? data[count].Effort : 0; // Acumular "Complete"
      delay = data[count].Delay > delay ? data[count].Delay : delay; // Máximo de "Delay"
      start =
        data[count].Start.getTime() < start.getTime()
          ? data[count].Start
          : start;
      end =
        data[count].Finish.getTime() < end.getTime() ? data[count].Finish : end;
      actualEnd =
        data[count].ActualFinish.getTime() < actualEnd.getTime()
          ? data[count].ActualFinish
          : actualEnd;
    }
  }

  console.log(
    "[GetProjectSummary] Gates: " +
      count +
      " Complete: " +
      complete +
      " effort:" +
      effort +
      " delay:" +
      delay +
      " start:" +
      start +
      " end:" +
      end +
      " actualEnd:" +
      actualEnd
  );

  const summary: IGateListItem = {
    Id: "0",
    Title: "Project",
    Complete: Math.trunc(complete / count),
    Delay: Math.trunc(delay),
    Count: count,
    Effort: Math.trunc(effort),
    Start: start,
    Finish: end,
    ActualFinish: actualEnd,
  };
  //console.log("[GetProjectSummary] Complete:", data.length+"-"+summary.Complete, "Count:", summary.Count, "Delay:", summary.Delay);
  return summary;
}
