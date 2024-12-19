import React from "react";
import { ITaskListItem } from "../../../models";

interface TaskCardProps {
  task: ITaskListItem;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="task-card">
      <h2 className="task-title">{task.Tasks}</h2>
      <p>
        <strong>Status:</strong> {task.Status}
      </p>
      <p>
        <strong>Deliverable:</strong> {task.Deliverable}
      </p>
      <p>
        <strong>Gate:</strong> {task.Title}
      </p>
      <p>
        <strong>Completion:</strong> {task.Complete}%
      </p>
      <p>
        <strong>Delay:</strong> {task.Delay} days
      </p>
      <button className="task-button">Contact Summary</button>
    </div>
  );
};

export default TaskCard;
