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
import { IReadonlyTheme} from '@microsoft/sp-component-base';
//import {  DynamicProperty} from '@microsoft/sp-component-base';

import * as strings from 'ProjectDashboardWebPartStrings';

import ProjectDashboard from './components/ProjectDashboard';
import Dashboard from './components/Dashboard';
import ErrorPage from './components/ErrorPage';

import { GroupByGate, FilterTasks, IProjectDashboardProps } from './components';

import { SPHttpClient } from '@microsoft/sp-http';
import { IProjectListItem, ITaskListItem, IGateListItem,IProjectDashboardWebPartProps  } from '../../models';

import { IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';


export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}
interface DashboardProps {
  gates: IGateListItem[];
  project : IProjectListItem;
  baseURL : string;
}
interface ErrorPageProps {
  project : string;
  errorMsg: string;
}

export default class ProjectDashboardWebPart extends BaseClientSideWebPart<IProjectDashboardWebPartProps> {

  private _projects: IProjectListItem[] = [];
  private _tasks: ITaskListItem[] = [];
  private _selectedTask: ITaskListItem;
  private _gates: IGateListItem[] = [];
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _projectSelected: IProjectListItem ;
  private _sysError: boolean = false;
  private _siteUrl: string = "https://ed2corp.sharepoint.com/sites/ed2team";

  //public _selectedFilter: DynamicProperty<string>;

  public render(): void {
    const progressBar: React.ReactElement<IProjectDashboardProps> = React.createElement(
      ProjectDashboard,
      {
        spGateListItems: this._gates,
        onGetGateListItems: this._onGetGateListItems,
        spTaskListItems: this._tasks,
        onGetTaskListItems: this._onGetTaskListItems,
        selectedTask: this._selectedTask,
        spProjectListItems: this._projects,
        onGetProjectListItems: this._onGetProjectListItems,
        onSelectItem: this._onSelectedItem,

        description: this.properties.description,
        projectName: this.properties.projectName,
        showStack: this.properties.showStack,
        showButtons: this.properties.showButtons,
        refreshInterval: this.properties.refreshInterval,

        filterValue: this.properties.filterValue,

        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    const dashboard: React.ReactElement<DashboardProps> = React.createElement(
      Dashboard,
      {  
        gates: this._gates,
        project: this._projectSelected,
        baseURL: this.context.pageContext.web.absoluteUrl
      }
    );

    const errorPage: React.ReactElement<ErrorPageProps> = React.createElement(
      ErrorPage,
      {  
        project: this.properties.projectName,
        errorMsg: this._environmentMessage
      }
    );

    if(this.properties.showButtons) console.log("Log Message:" + this._getEnvironmentMessage() );

    if(this._sysError) {
      ReactDom.render(errorPage, this.domElement);
    }
    else {
      if(this.properties.isDashboard)
        ReactDom.render(dashboard, this.domElement);
      else
        ReactDom.render(progressBar, this.domElement);  
    }

  }

  protected async onInit(): Promise<void> {
    this.context.dynamicDataSourceManager.initializeSource(this);
    await this._onGetGateListItems(); 
    //await this._onGetProjectListItems();     
    return super.onInit();
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
    const dropdownOptions = this._projects.map((project, index) => ({
      key: project.Title,    
      text: project.Title
    }));
    if (!this.properties.projectName && dropdownOptions.length > 0) {
      this.properties.projectName = dropdownOptions[0].key; // Selecciona el primer key por defecto
    }

    return {
      pages: [
        {
          header: {
            description: "ED2 dashboard for internal projects..."
          },
          groups: [
            {
              groupName: "Setup Project",
              groupFields: [              
                PropertyPaneDropdown('projectName', {
                  label: 'Select Project',
                  options: dropdownOptions,
                  selectedKey: this.properties.projectName,
                }),
                PropertyPaneToggle('isDashboard', {
                    label: 'Is Dashboard',
                    onText: 'On',
                    offText: 'Off'
                  }),
                   PropertyPaneCheckbox('showStack', {
                    text: 'As Stack (default As Progress Bar)'
                  }),
                  PropertyPaneTextField('description', {
                  label: "Prefix Header:"
                }),
                PropertyPaneToggle('showButtons', {
                  label: 'Show Controls',
                  onText: 'On',
                  offText: 'Off'
                }),
                PropertyPaneTextField('refreshInterval', {
                  label: 'Refresh Interval'
                })
              ]
            }
          ]
        }
      ]
    };
  }

/** Dynamic data: to connect with external webpart */
  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [
      {
        id: 'filterValue',
        title: 'Filter Value'
      }
    ];
  }

  public getPropertyValue(propertyId: string): string {
    if (propertyId === 'filterValue') {
      return this.properties.filterValue || '';
    }
    return '';
  }

  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: string, newValue: string): Promise<void> {
    if (propertyPath === 'filterValue') {
      this.context.dynamicDataSourceManager.notifyPropertyChanged('filterValue');
    }
    if (propertyPath === 'projectName' && newValue !== oldValue) {
      console.log(`Selected Project Changed: ${newValue}`); // Maneja el evento
      this.properties.projectName = newValue; // Actualiza el valor
      await this._onProjectChange(newValue); // Dispara tu función personalizada
    }
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }
  


  /** */
  
  // Método personalizado para manejar el cambio
  private async _onProjectChange(projectName: string): Promise<void> {
    // Aquí puedes agregar la lógica personalizada que necesites ejecutar.
    console.log(`Handling project change: ${projectName}`);
    // Ejemplo: Recargar datos específicos según el proyecto
    await this._onGetGateListItems();
  }

  private _getProjectInfo (planName: string): IProjectListItem { 
    const result  =  this._projects.find((item) => item.Title === planName) ;
    if(result !== undefined){
      this._projectSelected = result;
      console.log("_getProjectInfo: "+ this.properties.projectName +" - result: "+result?.ListName+ " Final: "+this._projectSelected.ListName+ " Link: "+ this._projectSelected.Link.Url);
      return result;
    } else{
      console.log("_getProjectInfo - planName not found: "+ this.properties.projectName );
      const nullProj : IProjectListItem = {
        Id: "",
        Title: "", 
        Status: "", 
        ListName: "", 
        Link: {Url:"", Description:""}
      };
      return nullProj ;
    }   
  }

  private _onGetProjectListItems = async (): Promise<void> => {
    const response: IProjectListItem[] = await this._getProjectListItems();
    this._projects = response;
    this.render();
   }

  private async _getProjectListItems(): Promise<IProjectListItem[]> {
    console.log("ProjectName: "+ this.properties.projectName+" ->"+this._siteUrl + `/_api/web/lists/getbytitle('Projects')/items?$select=Id,Title, ListName, Link `);
    const response = await this.context.spHttpClient.get(
      //this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Projects')/items?$select=Id,Title, ListName, Link `,
      this._siteUrl + `/_api/web/lists/getbytitle('Projects')/items?$select=Id,Title, ListName, Link `,
      SPHttpClient.configurations.v1);
  
    if (!response.ok) {
      this._sysError = true;
      const responseText = await response.text();
      throw new Error(responseText);
    }
  
    const responseJson = await response.json();
    return responseJson.value as IProjectListItem[];
  }

  private _onSelectedItem = async (item: string, group: string): Promise<void> => {
    
    const response: ITaskListItem[] = await this._getTaskListItems();   

    //this._tasks = response;
    console.log("_onSelectedItem: lenght: "+ response.length + " item: "+ item + " group: " + group);

    if(group === "task"){
      this._selectedTask = this.findTaskByName(
        response,
        item
      );  
    }else{
      this._tasks = FilterTasks(response, group, item);
    }
    //console.log("Received: Value: " + item + " Group: " + group+ " Total: "+ response.length + " Filtered: " + this._tasks.length );
    this.render();
    
  }

  private _onGetTaskListItems = async (): Promise<void> => {
    const response: ITaskListItem[] = await this._getTaskListItems();
    this._tasks = response;
    this.render();
   }

  private async _getTaskListItems(): Promise<ITaskListItem[]> {

      console.log("ProjectName : "+ this.properties.projectName);
      this._projectSelected = this._getProjectInfo(this.properties.projectName);
      if(this._projectSelected.ListName.length > 0){
        try {
          const response = await this.context.spHttpClient.get(
            //this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('PlanCascade')/items?$select=Id,Title,Complete,Status,Delay,Deliverable,Tasks,WBS`,
            //this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('`+this._projectSelected.ListName+`')/items?$select=Id,Title,Complete,Delay,Deliverable,Task,WBS,Description,Responsible,Start,Finish,Barriers, ActualFinish, Effort, ActionableStatus, EvidenceOfCompletion`,
            this._siteUrl + `/_api/web/lists/getbytitle('`+this._projectSelected.ListName+`')/items?$select=Id,Title,Complete,Delay,Deliverable,Task,WBS,Description,Responsible,Start,Finish,Barriers, ActualFinish, Effort, ActionableStatus, EvidenceOfCompletion`,
            SPHttpClient.configurations.v1);
        
            const responseJson = await response.json();
            //console.log("Project: " + project + " Grouper: "+grouper+" Filter: "+filter);
        
            return responseJson.value as ITaskListItem[];
              //console.log(groupedArray);  
        } catch (error) {
          console.error("Error fetching gate list items:", error);
          this._sysError = true;
          this._environmentMessage = error;
          this.render();  
          return [];
        }
      }else{
        console.error("List not found for:", this.properties.projectName);
        this._sysError = true;
        this.render();  
        return [];
      }
  }

  private _onGetGateListItems = async (): Promise<void> => {
    this._sysError = false;
    this._projects = await this._getProjectListItems();
    this._tasks = await this._getTaskListItems();
    this._gates = await this._getGateListItems();
    this._selectedTask = this.newTask();

    this.render();
  }

  private async _getGateListItems(): Promise<IGateListItem[]> {
    //const baseUrl = this.getBaseUrl();
    this._projectSelected = this._getProjectInfo(this.properties.projectName);
    if(this._projectSelected.ListName.length > 0){
      try {
        const response = await this.context.spHttpClient.get(
          //this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('PlanCascade')/items?$select=Id,Title,Complete,Status,Delay,Deliverable,Tasks,WBS`,
          //this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('`+this._projectSelected.ListName+`')/items?$select=Id,Title,Complete,Delay,Deliverable,Task,WBS`,
          this._siteUrl + `/_api/web/lists/getbytitle('`+this._projectSelected.ListName+`')/items?$select=Id,Title,Complete,Delay,Deliverable,Task,WBS`,
          SPHttpClient.configurations.v1);
      
        if (!response.ok) {
          this._sysError = true;
          const responseText = await response.text();
          throw new Error(responseText);
        }
          const responseJson = await response.json();
      
          const groupedArray = GroupByGate(responseJson.value as ITaskListItem[]);
          return groupedArray;     
        //console.log(groupedArray);  
      } catch (error) {
        console.error("Error fetching gate list items:", error);
        this._sysError = true;
        this._environmentMessage = error;
        this.render();  
        return [];
      }
    }else{
      console.error("Gate- List not found for: ", this.properties.projectName);
      this._sysError = true;
      this.render();  
      return [];
    }

  }

  private findTaskByName(
    taskList: ITaskListItem[],
    taskName: string
  ): ITaskListItem  {

    const task =  taskList.find((task) => task.Task === taskName);
    console.log("findTaskByName  taskName: " + taskName+ " lenght: "+ taskList.length + " filter: "+  task?.Task);

    if(task !== undefined)
      return task;
    
   return this.newTask();
  }

  private newTask( ): ITaskListItem  {
    
   return {
      Id: "", 
      Title: "", 
      Complete:0 , 
      Delay:0 , 
      Deliverable: "", 
      Task: "No Task Found..."
      };
  }
}
