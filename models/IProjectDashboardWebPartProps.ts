import { ITaskListItem } from "./ITaskListItem";

export interface IProjectDashboardWebPartProps {
    description: string;
    refreshInterval: number;
    showStack: boolean;
    projectName: string;
    showButtons: boolean;
    selectedTask: ITaskListItem;
    filterValue: string;
  }