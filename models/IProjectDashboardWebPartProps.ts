import { ITaskListItem } from "./ITaskListItem";

export interface IProjectDashboardWebPartProps {
    description: string;
    refreshInterval: number;
    projectName: string;
    isDashboard: boolean;
    showButtons: boolean;
    showStack: boolean;
    
    selectedTask: ITaskListItem;
    filterValue: string;
  }