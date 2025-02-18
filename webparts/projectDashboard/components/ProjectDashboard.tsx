import * as React from "react";
import styles from "./ProjectDashboard.module.scss";
import type { IProjectDashboardProps } from "./IProjectDashboardProps";
import { escape } from "@microsoft/sp-lodash-subset";
//import { useState } from "react";
import { Switch } from "@fluentui/react-components";
import ProgressTasks from "./ProgressTasks";
import ProgressGates from "./ProgressGates";
import TaskCard from "./TaskCard";
import ListTasks from "./ListTasks";
import { MessageLog } from "./MessageLog";
import DoughnutChart from "./Doughnut";

//import type { SwitchProps } from "@fluentui/react-components";

interface IProjectDashboardState {
  // showProjects: boolean;
  allTasks: boolean;
  showDetails: boolean;
}
export default class ProjectDashboard extends React.Component<
  IProjectDashboardProps,
  IProjectDashboardState
> {
  private _showTasks: boolean = true;

  constructor(props) {
    super(props);
    this.state = {
      // showProjects: false,
      allTasks: false,
      showDetails: false,
    };
  }

  handleSwitchDetailsChange = (event) => {
    this.setState({ showDetails: event.target.checked });
  };
  handleAllTasksChange = (event) => {
    this.setState({ allTasks: event.target.checked });
  };

  public render(): React.ReactElement<IProjectDashboardProps> {
    const {
      spGateListItems,
      spTaskListItems,
      spFilteredTaskItems,
      hasTeamsContext,
      project,
    } = this.props;

    const { showDetails, allTasks } = this.state;

    return (
      <>
        {this.props.isDashboard && (
          <div className="task-card">
            <a
              //          href="https://ed2corp.sharepoint.com/sites/ED2Team/SitePages/SW_RFCascade.aspx"
              href={project.Link.Url}
              target="_blank"
            >
              <h3> {project.Title} </h3>
            </a>
            {spGateListItems && (
              <a
                onClick={() => {
                  this.setState({ showDetails: !showDetails });
                }}
              >
                <div>
                  <DoughnutChart gates={spGateListItems} />
                </div>
              </a>
            )}
            {!spGateListItems && (
              <h1>Without info defined for the project... </h1>
            )}
          </div>
        )}
        {(!this.props.isDashboard ||
          (this.props.isDashboard && showDetails)) && (
          <section
            className={`${styles.projectDashboard} ${
              hasTeamsContext ? styles.teams : ""
            }`}
          >
            {this.props.showButtons && (
              <div className={styles.buttons}>
                <Switch
                  label="List Tasks"
                  checked={this._showTasks}
                  onChange={(ev) => {
                    this._showTasks = ev.currentTarget.checked;
                    //this.handleSwitchTaskChange(ev.currentTarget.checked);
                    this.onGetTaskListItemsChanged();
                  }}
                />
                <Switch
                  label="All Tasks"
                  checked={allTasks}
                  onChange={(ev) => {
                    this.setState({ allTasks: ev.currentTarget.checked });
                  }}
                />
              </div>
            )}
            <div className={styles["columnContainer"]}>
              <div id="progress-header" className={styles["rowContainer"]}>
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
                    <strong>{escape(project.Title)}</strong>{" "}
                  </h2>
                </div>
              </div>
              <div id="progress-body">
                {spGateListItems && (
                  <>
                    <ProgressGates
                      gates={spGateListItems}
                      onSelectItem={(item, group) => {
                        this.props.onSelectItem(item, group);
                        //this._showDetails = true;
                      }}
                      showDetails={false}
                    />
                  </>
                )}
                {spTaskListItems.length > 0 && (
                  <ProgressTasks
                    tasks={allTasks ? spTaskListItems : spFilteredTaskItems}
                    showDetails={false}
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
                  {
                    <TaskCard
                      task={this.props.selectedTask}
                      showDetails={false}
                    />
                  }
                </>
              )}
            {this._showTasks && spTaskListItems.length > 0 && (
              <ListTasks
                items={allTasks ? spTaskListItems : spFilteredTaskItems}
                heading={
                  allTasks
                    ? "All Tasks: "
                    : spFilteredTaskItems.length > 0
                    ? "Pending Tasks: " + spFilteredTaskItems[0].Title
                    : "No tasks defined..."
                }
                showDetails={showDetails}
                onSelectItem={(item, group) => {
                  this.props.onSelectItem(item, group);
                }}
              />
            )}
            {this.props.showLog && this.props.environmentMessage.length > 0 && (
              <>
                <p>
                  <strong>System Log: </strong> {this.props.environmentMessage}
                </p>
              </>
            )}
          </section>
        )}
      </>
    );
  }

  private onReset(): void {
    //showDetails = false;
    if (this.props.onGetGateListItems) this.props.onGetGateListItems();
    this.setState({ allTasks: false });
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
