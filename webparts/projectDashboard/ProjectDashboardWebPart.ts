import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ProjectDashboardWebPartStrings';
import ProjectDashboard from './components/ProjectDashboard';
import { IProjectDashboardProps } from './components/IProjectDashboardProps';

import { SPHttpClient } from '@microsoft/sp-http';
import { IProjectListItem, ITaskListItem, IGateListItem  } from '../../models';
import { GroupByGate } from './components/GroupByGate';
import { FilterTasks } from './components/FilterTasks';


export interface IProjectDashboardWebPartProps {
  description: string;
  refreshInterval: number;
  showProjects: boolean;
  projectName: string;
  showButtons: boolean;
}

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}


export default class ProjectDashboardWebPart extends BaseClientSideWebPart<IProjectDashboardWebPartProps> {

  private _projects: IProjectListItem[] = [];
  private _tasks: ITaskListItem[] = [];
  private _gates: IGateListItem[] = [];
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';


  public render(): void {
    const element: React.ReactElement<IProjectDashboardProps> = React.createElement(
      ProjectDashboard,
      {
        spGateListItems: this._gates,
        onGetGateListItems: this._onGetGateListItems,
        spTaskListItems: this._tasks,
        onGetTaskListItems: this._onGetTaskListItems,
        spProjectListItems: this._projects,
        onGetProjectListItems: this._onGetProjectListItems,
        onSelectItem: this._onSelectedItem,
        description: this.properties.description,
        projectName: this.properties.projectName,
        showProjects: this.properties.showProjects,
        showButtons: this.properties.showButtons,
        refreshInterval: this.properties.refreshInterval,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneToggle('showButtons', {
                  label: 'Buttons',
                  onText: 'On',
                  offText: 'Off'
                }),
                PropertyPaneDropdown('projectName', {
                  label: 'Projects',
                  options: [
                    { key: 'RF Cascade', text: 'RF Cascade' },
                    { key: 'PAM', text: 'PAM' },
                    { key: 'Heatmap', text: 'Heatmap' },
                    { key: 'Freestar', text: 'Freestar' }
                  ]}),
                PropertyPaneTextField('refreshInterval', {
                  label: 'Refresh Interval'
                }),
                PropertyPaneCheckbox('showProjects', {
                  text: 'Show Projects List'
                })
              ]
            }
          ]
        }
      ]
    };
  }

  /** */

  
  private _onGetProjectListItems = async (): Promise<void> => {
    const response: IProjectListItem[] = await this._getProjectListItems();
    this._projects = response;
    this.render();
  }

  private async _getProjectListItems(): Promise<IProjectListItem[]> {
    const response = await this.context.spHttpClient.get(
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Projects')/items?$select=Id,Title, ListName, Link `,
      SPHttpClient.configurations.v1);
  
    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(responseText);
    }
  
    this._tasks = [];
    this.properties.showProjects = !this.properties.showProjects;
    const responseJson = await response.json();
  
    return responseJson.value as IProjectListItem[];
  }

  private _onSelectedItem = async (item: string, group: string): Promise<void> => {
    
    const response: ITaskListItem[] = await this._getTaskListItems();   

    //this._tasks = response;
    //console.log(this._tasks);
    this._tasks = FilterTasks(response, group, item);
    //console.log("Received: Value: " + item + " Group: " + group+ " Total: "+ response.length + " Filtered: " + this._tasks.length );
    this.render();
    
  }

  private _onGetTaskListItems = async (): Promise<void> => {
    const response: ITaskListItem[] = await this._getTaskListItems();
    
    this._tasks = response;
    this.render();
  }

//  private async _getTaskListItems(project: string, grouper: string, filter : string ): Promise<ITaskListItem[]> {
    private async _getTaskListItems(): Promise<ITaskListItem[]> {
      const response = await this.context.spHttpClient.get(
      //this.context.pageContext.web.absoluteUrl + `/_api/web/lists/RF_Cascade/items?$select=Id,Title,Complete,Status,Delay`,
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('PlanCascade')/items?$select=Id,Title,Complete,Status,Delay,Deliverable,Tasks,WBS`,
      SPHttpClient.configurations.v1);

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(responseText);
    }
  
    const responseJson = await response.json();
    //console.log("Project: " + project + " Grouper: "+grouper+" Filter: "+filter);

    return responseJson.value as ITaskListItem[];
  }

  private _onGetGateListItems = async (): Promise<void> => {
    const responseProj: IProjectListItem[] = await this._getProjectListItems();
    this._projects = responseProj;

    const response: IGateListItem[] = await this._getGateListItems();
    this._gates = response;
    this.render();
  }

  private async _getGateListItems(): Promise<IGateListItem[]> {
    const result  =  this._projects.find((item) => item.Title === this.properties.projectName) ;
    console.log("PlanName: "+ this.properties.projectName +" - result: "+result?.ListName);
    
    let findPlanByName =  "PlanCascade";
    if(result != undefined)
       findPlanByName = result.ListName;

    const response = await this.context.spHttpClient.get(
      //this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('PlanCascade')/items?$select=Id,Title,Complete,Status,Delay,Deliverable,Tasks,WBS`,
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('`+findPlanByName+`')/items?$select=Id,Title,Complete,Status,Delay,Deliverable,Tasks,WBS`,
      SPHttpClient.configurations.v1);
  
    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(responseText);
    }
  
    const responseJson = await response.json();
  
    const groupedArray = GroupByGate(responseJson.value as ITaskListItem[]);
    //console.log(groupedArray);

    return groupedArray;
  }

}
