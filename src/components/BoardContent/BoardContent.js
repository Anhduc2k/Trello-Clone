import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import "./BoardContent.scss";
import Column from "../Column/Column";
import { mapOrder } from "../../ultilities/sorts";
import { initialData } from "../../actions/initialData";

export default function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);

      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columOrder, "id"));
    }
  }, []);
  if (isEmpty(board)) {
    return <div className="not-found">Board not Found</div>;
  }
  return (
    <div className="board-content">
      {columns.map((column, index) => (
        <Column key={index} column={column} />
      ))}
    </div>
  );
}
