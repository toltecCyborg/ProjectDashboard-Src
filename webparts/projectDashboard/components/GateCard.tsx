import * as React from "react";
import { IGateListItem } from "../../../models";
import styles from "./ProjectDashboard.module.scss";

interface GateCardProps {
  gates: IGateListItem[];
  onSelectItem: (item: string, group: string) => void;
}
const GateCard = ({ gates, onSelectItem }: GateCardProps) => {
  //Hook
  const getCardClass = (delay: number, complete: number) => {
    if (complete === 1) return styles.green;
    return styles.white; // Default Class
  };
  const getCardDelay = (delay: number, complete: number) => {
    if (complete === 1) return styles.whiteFont;
    if (delay === 0) return styles.greenFont;
    if (delay > 0 && delay <= 7) return styles.yellowFont;
    if (delay > 7) return styles.redFont;
    return styles.whiteFont; // Default Class
  };
  return (
    <>
      <div className={styles["cardContainer"]}>
        {gates.map((gate, index) => (
          <div
            key={gate.Id}
            className={`${styles["pilaCard"]} ${getCardClass(
              gate.Delay,
              gate.Complete
            )}`}
          >
            <div
              className={`${styles["cardContent"]} ${getCardDelay(
                gate.Delay,
                gate.Complete
              )}`}
              onClick={() => {
                onSelectItem(gate.Title, "task");
              }}
            >
              <h5>
                <strong>{gate.Title} </strong>
              </h5>
              <p>
                <strong>{Math.floor(gate.Complete * 100)}% </strong>
              </p>
              {gate.Delay > 0 && (
                <p>
                  <strong>(- {gate.Delay} days) </strong>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GateCard;
