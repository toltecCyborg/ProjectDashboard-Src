import { ITaskListItem } from "./ITaskListItem";

export interface IProjectDashboardWebPartProps {
    description: string;
    refreshInterval: number;
    projectName: string;
    showButtons: boolean;
    showStack: boolean;
    
    selectedTask: ITaskListItem;
    filterValue: string;
  }