import * as React from "react";
import { ITaskListItem } from "../../../models";
import styles from "./ProjectDashboard.module.scss";
import { GetDelay } from "./GetDelay";

interface GateCardProps {
  tasks: ITaskListItem[];
  showDetails: boolean;
  onSelectItem: (item: string, group: string) => void;
}
const ProgressTasks = ({ onSelectItem, showDetails, tasks }: GateCardProps) => {
  //let _showDetails: boolean = false;
  //Hook
  //const tasks: ITaskListItem[] = [];

  const getCardClass = (delay: number, complete: number) => {
    if (complete === 1) return styles.green;
    if (delay > 0 && delay <= 7) return styles.yellow;
    if (delay > 7) return styles.red;
    return styles.white; // Default Class
  };
  const getCardDelay = (delay: number, complete: number) => {
    if (complete === 1) return styles.whiteFont;
    if (delay === 0) return styles.greenFont;
    if (delay > 0 && delay <= 7) return styles.redFont;
    if (delay > 7) return styles.whiteFont;
    return styles.whiteFont; // Default Class
  };
  return (
    <>
      {showDetails ? (
        <div className={styles["cardContainer"]}>
          {tasks.map((item, index) => (
            <div
              key={item.Id}
              className={`${styles["ed2Card"]} ${getCardClass(
                GetDelay(item.Finish, item.ActualFinish),
                item.Complete
              )}`}
            >
              <div
                className={`${styles["cardContent"]} ${getCardDelay(
                  GetDelay(item.Finish, item.ActualFinish),
                  item.Complete
                )}`}
                onClick={() => {
                  onSelectItem(item.Task, "task");
                }}
              >
                <p>{item.WBS}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles["progressContainer"]}>
          {tasks.map((item, index) => (
            <div
              key={item.Id}
              className={`${styles["progressCard"]} ${getCardClass(
                GetDelay(item.Finish, item.ActualFinish),
                item.Complete
              )}`}
              onClick={() => {
                onSelectItem(item.Task, "task");
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProgressTasks;
