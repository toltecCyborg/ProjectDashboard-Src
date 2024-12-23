import * as React from "react";
import { ITaskListItem } from "../../../models";
import styles from "./ProjectDashboard.module.scss";
import { ProgressIndicator, IProgressIndicatorStyles } from "@fluentui/react";

interface GateCardProps {
  tasks: ITaskListItem[];
  showDetails: boolean;
  onSelectItem: (item: string, group: string) => void;
}
const ProgressTasks = ({ onSelectItem, showDetails, tasks }: GateCardProps) => {
  //let _showDetails: boolean = false;
  //Hook
  //const tasks: ITaskListItem[] = [];
  const progressStyles: IProgressIndicatorStyles = {
    itemProgress: {
      backgroundColor: "whitesmoke", // Color de la barra
    },
    root: {
      marginBottom: "1px", // Ejemplo: ajustando margen
    },
    itemName: "gates",
    itemDescription: "almost there...",
    progressBar: "bar",
    progressTrack: "track",
  };
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
              className={`${styles["pilaCard"]} ${getCardClass(
                item.Delay,
                item.Complete
              )}`}
            >
              <div
                className={`${styles["cardContent"]} ${getCardDelay(
                  item.Delay,
                  item.Complete
                )}`}
                onClick={() => {
                  onSelectItem(item.Task, "task");
                }}
              >
                <ProgressIndicator
                  percentComplete={item.Complete} // Progreso como fracción (0.5 = 50%)
                  styles={progressStyles}
                />
                <p>
                  <strong>{Math.floor(item.Complete * 100)}% </strong>
                </p>
                {item.Delay > 0 && (
                  <p>
                    <strong>(- {item.Delay} days) </strong>
                  </p>
                )}
                <p>{item.Task}</p>
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
                item.Delay,
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
