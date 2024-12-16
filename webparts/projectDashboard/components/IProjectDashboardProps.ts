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
  spGateListItems: IGateListItem[];
  onGetGateListItems?: ButtonClickedCallback;
  onSelectItem: (item: string, group: string) => void;
  description: string;
  projectName: string;
  showProjects: boolean;
  showButtons: boolean;
  refreshInterval: number;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
