import * as React from "react";
import { useState } from "react";
import { ITaskListItem } from "../../../models";
//import "~@bootstrap/;

interface ListGroupProps {
  items: ITaskListItem[];
  heading: string;
  grouper: string;
  selection: string;
  onSelectItem: (item: string) => void;
}
const ListGroup = ({ items, heading, onSelectItem }: ListGroupProps) => {
  //Hook
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No items found</p>}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Task</th>
            <th>Completed</th>
            <th>Delay</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.Id}
              className={selectedIndex === index ? "table-active" : ""}
              onClick={() => {
                setSelectedIndex(index);
                onSelectItem(item.Tasks);
              }}
            >
              <td>{item.Tasks}</td>
              <td>{Math.floor(item.Complete * 100)}% </td>
              <td>{item.Delay}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <h3>Formated as List</h3>
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item.Id}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item.Title);
            }}
          >
            Task: {item.Title} / {item.Deliverable} / {item.Tasks} : Status:{" "}
            {item.Status} ; Completed: {item.Complete}; Delay: {item.Delay}
          </li>
        ))}
      </ul> */}
    </>
  );
};

export default ListGroup;
