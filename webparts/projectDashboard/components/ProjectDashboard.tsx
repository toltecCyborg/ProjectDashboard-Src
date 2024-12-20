import * as React from "react";
import styles from "./ProjectDashboard.module.scss";
import type { IProjectDashboardProps } from "./IProjectDashboardProps";
import { escape } from "@microsoft/sp-lodash-subset";
import ListProject from "./ListProject";

import { Switch } from "@fluentui/react-components";
import StackGates from "./StackGates";
import ProgressTasks from "./ProgressTasks";
import ProgressGates from "./ProgressGates";
import TaskCard from "./TaskCard";
import ListTasks from "./ListTasks";
//import type { SwitchProps } from "@fluentui/react-components";

export default class ProjectDashboard extends React.Component<IProjectDashboardProps> {
  private _showProjects: boolean = false;
  private _showTasks: boolean = false;
  private _showDetails: boolean;

  public render(): React.ReactElement<IProjectDashboardProps> {
    const {
      spGateListItems,
      spTaskListItems,
      spProjectListItems,
      hasTeamsContext,
    } = this.props;

    return (
      <section
        className={`${styles.projectDashboard} ${
          hasTeamsContext ? styles.teams : ""
        }`}
      >
        {this.props.showButtons && (
          <div className={styles.buttons}>
            {/* <button type="button" onClick={this.onGetTaskListItemsClicked}>
              Show Tasks
            </button>
            <button type="button" onClick={this.onGetProjectListItemsClicked}>
              Show Projects
            </button> */}

            <Switch
              label="Show Tasks"
              onChange={(ev) => {
                this._showTasks = ev.currentTarget.checked;
                this.onGetTaskListItemsChanged();
              }}
            />
            <Switch
              label="Show Projects"
              onChange={(ev) => {
                this._showProjects = ev.currentTarget.checked;
                this.onGetProjectListItemsChanged();
              }}
            />
            <button
              type="button"
              onClick={() => {
                this.onReset();
              }}
            >
              Reset
            </button>
            <Switch
              label="Detailed"
              onChange={(ev) => {
                this._showDetails = ev.currentTarget.checked;
              }}
            />
          </div>
        )}
        <div className="columnContainer">
          <h2>
            {this.props.description + " "}
            <strong>{escape(this.props.projectName)}</strong>{" "}
          </h2>
          <div>
            {!this.props.showStack && spGateListItems && (
              <ProgressGates
                gates={spGateListItems}
                onSelectItem={(item, group) => {
                  this.props.onSelectItem(item, group);
                  this._showDetails = true;
                }}
              />
            )}
            {this.props.showStack && spGateListItems && (
              <>
                <StackGates
                  gates={spGateListItems}
                  onSelectItem={(item, group) => {
                    this.props.onSelectItem(item, group);
                  }}
                />
              </>
            )}
            {spTaskListItems.length > 0 && (
              <ProgressTasks
                tasks={spTaskListItems}
                showDetails={this._showDetails}
                onSelectItem={(item, group) => {
                  this.props.onSelectItem(item, group);
                }}
              />
            )}
          </div>
        </div>

        {this.props.selectedTask &&
          this.props.selectedTask.Title.length > 0 && (
            <>
              <TaskCard
                task={this.props.selectedTask}
                showDetails={this._showDetails}
              />
            </>
          )}
        {this._showTasks && spTaskListItems.length > 0 && (
          <>
            <ListTasks
              items={spTaskListItems}
              heading={
                spTaskListItems.length > 0
                  ? "Tasks: " + spTaskListItems[0].Title
                  : ""
              }
              onSelectItem={(item, group) => {
                this.props.onSelectItem(item, group);
              }}
            />
          </>
        )}
        {this._showProjects && (
          <>
            <ListProject
              items={spProjectListItems}
              heading={
                spProjectListItems.length > 0
                  ? "Tasks: " + spProjectListItems[0].Title
                  : ""
              }
              grouper={"gate"}
              selection={
                spProjectListItems.length > 0 ? spProjectListItems[0].Title : ""
              }
              onSelectItem={(item, group) => {
                this.props.onSelectItem(item, group);
              }}
            />
          </>
        )}
      </section>
    );
  }

  private onReset(): void {
    //this._showDetails = false;
    if (this.props.onGetGateListItems) this.props.onGetGateListItems();

    console.log("ProjectDashboar-onReset...");

    //this._taskNameToFind = Message;
    //console.log("ProjectDashboar-onSelectItemsClicked: " + Message);
  }

  private onGetProjectListItemsChanged = (): void => {
    if (this.props.onGetProjectListItems) this.props.onGetProjectListItems();
  };

  private onGetTaskListItemsChanged = (): void => {
    if (this.props.onGetTaskListItems) this.props.onGetTaskListItems();
  };

  // private onGetProjectListItemsClicked = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ): void => {
  //   event.preventDefault();
  //   this._showProjects = !this._showProjects;
  //   if (this.props.onGetProjectListItems) this.props.onGetProjectListItems();
  // };

  // private onGetTaskListItemsClicked = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ): void => {
  //   event.preventDefault();

  //   this._showTasks = !this._showTasks;
  //   if (this.props.onGetTaskListItems) this.props.onGetTaskListItems();
  // };

  componentDidMount(): void {
    // Cargar datos al iniciar
    if (this.props.onGetGateListItems) this.props.onGetGateListItems();

    // Configurar temporizador para actualizar cada 5 minutos (300,000 ms)
    // this.context.refreshInterval = setInterval(() => {
    //   if (this.props.onGetGateListItems) this.props.onGetGateListItems();
    // }, this.props.refreshInterval);
  }

  componentWillUnmount(): void {
    // Limpiar el temporizador cuando el componente se desmonte
    if (this.context.refreshInterval) {
      clearInterval(this.context.refreshInterval);
    }
  }
}
