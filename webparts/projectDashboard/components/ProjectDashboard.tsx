import * as React from "react";
import styles from "./ProjectDashboard.module.scss";
import type { IProjectDashboardProps } from "./IProjectDashboardProps";
import { escape } from "@microsoft/sp-lodash-subset";
import ListProject from "./ListProject";
//import { useState } from "react";
import { Switch } from "@fluentui/react-components";
import ProgressTasks from "./ProgressTasks";
import ProgressGates from "./ProgressGates";
import TaskCard from "./TaskCard";
import ListTasks from "./ListTasks";
import { MessageLog } from "./MessageLog";

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
  private _showTasks: boolean = true;
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
              label="Show Detail"
              checked={showDetails}
              onChange={this.handleSwitchDetailsChange}
            />
            <Switch
              label="List Tasks"
              checked={this._showTasks}
              onChange={(ev) => {
                this._showTasks = ev.currentTarget.checked;
                //this.handleSwitchTaskChange(ev.currentTarget.checked);
                this.onGetTaskListItemsChanged();
              }}
            />
          </div>
        )}
        <div className={styles["columnContainer"]}>
          <div className={styles["rowContainer"]}>
            <button
              type="button"
              className={styles["iconButton"]}
              onClick={() => {
                this.onReset();
              }}
            >
              <img
                alt=""
                src={require("../assets/Restart.jpg")}
                className={styles["iconImage"]}
              />
            </button>
            <div>
              <h2>
                {this.props.description + " "}
                <strong>{escape(this.props.projectName)}</strong>{" "}
              </h2>
            </div>
          </div>
          <div>
            {spGateListItems && (
              <ProgressGates
                gates={spGateListItems}
                onSelectItem={(item, group) => {
                  this.props.onSelectItem(item, group);
                  //this._showDetails = true;
                }}
                showDetails={showDetails}
              />
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
            <>{ (
              <TaskCard
                task={this.props.selectedTask}
                showDetails={showDetails}
              />
            )            
            }
            </>
          )}
        {this._showTasks && spTaskListItems.length > 0 && (
          <>
            <ListTasks
              items={spTaskListItems}
              heading={
                spTaskListItems.length > 0
                  ? "Pending Tasks: " + spTaskListItems[0].Title
                  : ""
              }
              showDetails={showDetails}
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
        {this.props.showLog && this.props.environmentMessage.length > 0 && (
          <>
            <p>
              <strong>System Log: </strong> {this.props.environmentMessage}
            </p>
          </>
        )}
      </section>
    );
  }

  private onReset(): void {
    //showDetails = false;
    if (this.props.onGetGateListItems) this.props.onGetGateListItems();

    MessageLog("ProjectDashboar/onReset...");
  }

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
