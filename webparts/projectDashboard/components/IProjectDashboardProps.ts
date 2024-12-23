import {
  ButtonClickedCallback,
  IProjectListItem,
  ITaskListItem,
  IGateListItem
} from '../../../models';

export interface IProjectDashboardProps {
  spProjectListItems: IProjectListItem[];
  onGetProjectListItems?: ButtonClickedCallback;
  spTaskListItems: ITaskListItem[];
  onGetTaskListItems?: ButtonClickedCallback;
  selectedTask:ITaskListItem;
  spGateListItems: IGateListItem[];
  onGetGateListItems?: ButtonClickedCallback;
  onSelectItem: (item: string, group: string) => void;
  description: string;
  projectName: string;
  
  showStack: boolean;
  showButtons: boolean;
  //showProjects?: boolean;
  //showTasks?: boolean;
  //showDetails?: boolean;
    
  refreshInterval: number;
  filterValue: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
