import { ITaskListItem } from "../../../models";
import { GetDelay } from "./GetDelay";

// Función para agrupar
export function FilterTasks(
  data: ITaskListItem[],
  grouper: string,
  filter: string
): ITaskListItem[] {
  //default
  let filteredArray = data.filter((row) => row.Title === filter);

  //case initial conditions

  if (grouper === "gate" && filter === "actual" && data.length > 0) {
    //const gate = data[0].Title;
    filteredArray = data.filter(
      (row) => row.Complete < 1 && GetDelay(row.Finish, row.ActualFinish) > 0
    );
  }

  return filteredArray;
}
