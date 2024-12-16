import { ITaskListItem } from "../../../models";

// Función para agrupar
export function FilterTasks(
  data: ITaskListItem[],
  grouper: string,
  filter: string
): ITaskListItem[] {
  const filteredArray = data.filter((row) => row.Title === filter);

  //console.log("Filtered: " + filteredArray.length + ", Grouper:" + grouper);

  return Object.values(filteredArray).map((group) => ({
    Title: group.Title,
    Complete: group.Complete,
    Delay: group.Delay,
    Id: group.Id,
    Status: group.Status,
    Deliverable: group.Deliverable,
    Tasks: group.Tasks,
  }));

  /*
  const groups = data.reduce<Record<string, ITaskListItem>>(
    (acumArray, item) => {
      if (grouper === "gate") {
        const { Title, Complete, Delay } = item;
        // Si el grupo no existe, inicialízalo
        if (!acumArray[Title]) {
          acumArray[Title] = {
            Title,
            Complete: 0,
            Delay: 0,
            Id: "0",
            Status: "Completed",
            Deliverable: "",
            Tasks: "",
          };
        }

        // Actualizar métricas del grupo
        acumArray[Title].Complete = Math.max(
          acumArray[Title].Complete,
          Complete
        );
        acumArray[Title].Delay = Math.max(acumArray[Title].Delay, Delay);
      } else if (grouper === "deliverable") {
        const { Title, Deliverable, Complete, Delay } = item;

        if (!acumArray[Deliverable]) {
          acumArray[Deliverable] = {
            Title,
            Complete: 0,
            Delay: 0,
            Id: "0",
            Status: "Completed",
            Deliverable: "",
            Tasks: "",
          };
        }

        // Actualizar métricas del grupo
        acumArray[Deliverable].Complete = Math.max(
          acumArray[Deliverable].Complete,
          Complete
        );
        acumArray[Deliverable].Delay = Math.max(
          acumArray[Deliverable].Delay,
          Delay
        );
      } else {
        const { Title, Deliverable, Tasks, Complete, Delay } = item;

        if (!acumArray[Tasks]) {
          acumArray[Tasks] = {
            Title: Title,
            Complete: 0,
            Delay: 0,
            Id: "0",
            Status: "Completed",
            Deliverable: Deliverable,
            Tasks: Tasks,
          };
        }

        // Actualizar métricas del grupo
        acumArray[Tasks].Complete = Math.max(
          acumArray[Tasks].Complete,
          Complete
        );
        acumArray[Tasks].Delay = Math.max(acumArray[Tasks].Delay, Delay);
      }

      console.log(
        " Grouper: " +
          grouper +
          " Filter: " +
          filter +
          " Filtered tasks: " +
          acumArray.length
      );

      return acumArray;
    },
    {}
  );

  // Convertir los grupos en un arreglo
  return Object.values(groups).map((group) => ({
    Title: group.Title,
    Complete: group.Complete,
    Delay: group.Delay,
    Id: group.Id,
    Status: group.Status,
    Deliverable: group.Deliverable,
    Tasks: group.Tasks,
  }));
*/
}
