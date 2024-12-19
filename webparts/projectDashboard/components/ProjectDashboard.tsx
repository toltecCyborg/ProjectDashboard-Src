import * as React from "react";
import styles from "./ProjectDashboard.module.scss";
import type { IProjectDashboardProps } from "./IProjectDashboardProps";
import { escape } from "@microsoft/sp-lodash-subset";
import ListGroup from "./ListGroup";
import GateCard from "./GateCard";
import ProjectTemp from "./ProjectTemp";
import ListProject from "./ListProject";

export default class ProjectDashboard extends React.Component<IProjectDashboardProps> {
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
            <button type="button" onClick={this.onGetTaskListItemsClicked}>
              Show Tasks
            </button>
            <button type="button" onClick={this.onGetProjectListItemsClicked}>
              Show Projects
            </button>
          </div>
        )}
        <div>
          <h2>
            {this.props.description + " "}
            <strong>{escape(this.props.projectName)}</strong>{" "}
          </h2>
          <div>
            {!this.props.showCards && (
              <div className={styles["cardContainer"]}>
                {spGateListItems &&
                  spGateListItems.map((list) => (
                    <>
                      <GateCard
                        gate={list}
                        index={list.Id}
                        onSelectItem={(item, group) => {
                          this.props.onSelectItem(item, group);
                        }}
                      />
                    </>
                  ))}
              </div>
            )}
            {this.props.showCards && spGateListItems && (
              <ProjectTemp
                gates={spGateListItems}
                onSelectItem={(item, group) => {
                  this.props.onSelectItem(item, group);
                }}
              />
            )}
          </div>
        </div>
        {this.props.showProjects && (
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
              onSelectItem={this.onSelectItemsClicked}
            />
          </>
        )}
        {this.props.showTasks && spTaskListItems.length > 0 && (
          <>
            <ListGroup
              items={spTaskListItems}
              heading={
                spTaskListItems.length > 0
                  ? "Tasks: " + spTaskListItems[0].Title
                  : ""
              }
              grouper={"gate"}
              selection={
                spTaskListItems.length > 0 ? spTaskListItems[0].Title : ""
              }
              onSelectItem={this.onSelectItemsClicked}
            />
          </>
        )}
      </section>
    );
  }

  private onSelectItemsClicked(Message: string): void {
    console.log(Message);
  }

  private onGetProjectListItemsClicked = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
    if (this.props.onGetProjectListItems) this.props.onGetProjectListItems();
  };

  private onGetTaskListItemsClicked = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();

    if (this.props.onGetTaskListItems) this.props.onGetTaskListItems();
    this.onSelectItemsClicked("Testing 2...:" + event.button.toString());
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
