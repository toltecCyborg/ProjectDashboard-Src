import React from "react";
import { ITaskListItem } from "../../../models";
import styles from "./ProjectDashboard.module.scss";

interface TaskCardProps {
  task: ITaskListItem;
  showDetails: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, showDetails }) => {
  const getCardDelay = (delay: number, complete: number) => {
    if (complete === 1) return styles.blackFont;
    if (delay === 0) return styles.greenFont;
    if (delay > 0 && delay <= 7) return styles.yellowFont;
    if (delay > 7) return styles.redFont;
    return styles.blackFont; // Default Class
  };
  return (
    <div className="task-card">
      <h1 className="task-title">{task.Task}</h1>

      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <td>
              <strong>Deliverable:</strong>
            </td>
            <td>{task.Deliverable}</td>
          </tr>
          <tr
            className={`${styles["task-card"]} ${getCardDelay(
              task.Delay,
              task.Complete
            )}`}
          >
            <td>
              <strong>Completion:</strong>
            </td>
            <td>{task.Complete * 100}%</td>
          </tr>
          <tr
            className={`${styles["task-card"]} ${getCardDelay(
              task.Delay,
              task.Complete
            )}`}
          >
            <td>
              <strong>Delay:</strong>
            </td>
            <td>{task.Delay} days</td>
          </tr>

          <tr>
            <td>
              <strong>Responsible:</strong>
            </td>
            <td>{task.Responsible}</td>
          </tr>
          <tr>
            <td>
              <strong>Start:</strong>
            </td>
            <td>{task.Start}</td>
          </tr>
          <tr>
            <td>
              <strong>Finish:</strong>
            </td>
            <td>{task.Finish}</td>
          </tr>
          <tr>
            <td>
              <strong>ActualFinish:</strong>
            </td>
            <td>{task.ActualFinish}</td>
          </tr>
          <tr>
            <td>
              <strong>Effort:</strong>
            </td>
            <td>{task.Effort}</td>
          </tr>
          {showDetails && (
            <>
              <tr>
                <td>
                  <strong>Barriers:</strong>
                </td>
                <td>{task.Barriers}</td>
              </tr>
              <tr>
                <td>
                  <strong>ActionableStatus:</strong>
                </td>
                <td>{task.ActionableStatus}</td>
              </tr>
              <tr>
                <td>
                  <strong>Status:</strong>
                </td>
                <td>{task.Status}</td>
              </tr>
              <tr>
                <td>
                  <strong>Gate:</strong>
                </td>
                <td>{task.Title}</td>
              </tr>
              <tr>
                <td>
                  <strong>Description:</strong>
                </td>
                <td>{task.Description}</td>
              </tr>
            </>
          )}
          {false && (
            <tr>
              <td>
                <strong>EvidenceOfCompletion:</strong>
              </td>
              <td>{task.EvidenceOfCompletion}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskCard;
