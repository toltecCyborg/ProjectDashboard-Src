import * as React from "react";
import styles from "./ProjectDashboard.module.scss";
import type { IProjectDashboardProps } from "./IProjectDashboardProps";
import { escape } from "@microsoft/sp-lodash-subset";
import ListProject from "./ListProject";
//import { useState } from "react";
import { Switch } from "@fluentui/react-components";
import StackGates from "./StackGates";
import ProgressTasks from "./ProgressTasks";
import ProgressGates from "./ProgressGates";
import TaskCard from "./TaskCard";
import ListTasks from "./ListTasks";
//import type { SwitchProps } from "@fluentui/react-components";

interface IProjectDashboardState {
  // showProjects: boolean;
  // showTasks: boolean;
  showDetails: boolean;
}

export default class ProjectDashboard extends React.Component<
  IProjectDashboardProps,
  IProjectDashboardState
> {
  private _showProjects: boolean = false;
  private _showTasks: boolean = false;
  //private _showDetails: boolean = false;
  constructor(props) {
    super(props);
    this.state = {
      // showProjects: false,
      // showTasks: false,
      showDetails: false,
    };
  }

  handleSwitchDetailsChange = (event) => {
    this.setState({ showDetails: event.target.checked });
  };

  public render(): React.ReactElement<IProjectDashboardProps> {
    const {
      spGateListItems,
      spTaskListItems,
      spProjectListItems,
      hasTeamsContext,
    } = this.props;

    const { showDetails } = this.state;

    return (
      <section
        className={`${styles.projectDashboard} ${
          hasTeamsContext ? styles.teams : ""
        }`}
      >
        {this.props.showButtons && (
          <div className={styles.buttons}>
            <Switch
              label="Show Tasks"
              checked={this._showTasks}
              onChange={(ev) => {
                this._showTasks = ev.currentTarget.checked;
                //this.handleSwitchTaskChange(ev.currentTarget.checked);
                this.onGetTaskListItemsChanged();
              }}
            />
            <Switch
              label="Show Projects"
              checked={this._showProjects}
              onChange={(ev) => {
                this._showProjects = ev.currentTarget.checked;
                //this.handleSwitchProjectChange(ev.currentTarget.checked);
                this.onGetProjectListItemsChanged();
              }}
              // onChange={(ev) => {
              //   this._showProjects = ev.currentTarget.checked;
              //   //this.handleSwitchProjectChange(ev.currentTarget.checked);
              //   //this.onGetProjectListItemsChanged();
              // }}
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
              label="Show Detail"
              checked={showDetails}
              onChange={this.handleSwitchDetailsChange}
            />
            {/* <p>showProjects: {showProjects ? "true" : "false"}</p>
            <p>showTasks: {showTasks ? "true" : "false"}</p>
            <p>ShowDetails: {showDetails ? "true" : "false"}</p> */}
          </div>
        )}
        <div className="columnContainer">
          {true && (
            <h2>
              {this.props.description + " "}
              <strong>{escape(this.props.projectName)}</strong>{" "}
            </h2>
          )}

          <div>
            {!this.props.showStack && spGateListItems && (
              <ProgressGates
                gates={spGateListItems}
                tasks={spTaskListItems}
                onSelectItem={(item, group) => {
                  this.props.onSelectItem(item, group);
                  //this._showDetails = true;
                }}
                showDetails={showDetails}
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
                showDetails={showDetails}
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
                showDetails={showDetails}
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
