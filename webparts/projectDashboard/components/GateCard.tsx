import * as React from "react";
import { IGateListItem } from "../../../models";
import styles from "./ProjectDashboard.module.scss";

interface GateCardProps {
  gate: IGateListItem;
  index: string;
  onSelectItem: (item: string, group: string) => void;
}
const GateCard = ({ gate, onSelectItem, index }: GateCardProps) => {
  //Hook
  const getCardClass = (delay: number, complete: number) => {
    if (complete === 1) return styles.white;
    if (delay === 0) return styles.green;
    if (delay > 0 && delay <= 7) return styles.yellow;
    if (delay > 7) return styles.red;
    return styles.white; // Default Class
  };

  return (
    <>
      <div
        key={gate.Id}
        className={`${styles["ed2Card"]} ${getCardClass(
          gate.Delay,
          gate.Complete
        )}`}
      >
        <div className={styles["cardContent"]}>
          <button
            onClick={() => {
              onSelectItem(gate.Title, "task");
            }}
          >
            {gate.Title}
          </button>
          <p>
            <strong>Complete:</strong> {Math.floor(gate.Complete * 100)}%
          </p>
          <p>
            <strong>Status:</strong> {gate.Status}
          </p>
          <p>
            <strong>Delay:</strong> {gate.Delay} days
          </p>
        </div>
      </div>
    </>
  );
};

export default GateCard;
