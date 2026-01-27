/**
 * The CompGridSquare component is a functional component that renders a square on the computer's game
 * board and handles user clicks to determine if a ship has been hit or missed.
 * @returns The `CompGridSquare` component is being returned.
 */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFromShipCoordinates,
  nextComputerMove,
  userMessage,
  setComputerTurn,
  addToSunkShips,
  addToUserSelections,
} from "../../actions/gamePlayActions";
import "./GridSquare.css";
import convertSquareId from "../../utils/convertSquareId";

const CompGridSquare = ({ id }) => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");
  const {
    computerShipLocations,
    gameOver,
    computerShipCoordinates,
    computerTurn,
    sunkShips,
    userSelections,
  } = useSelector((state) => state.gamePlay);

  const handleClick = () => {
    if (!status && !gameOver && !computerTurn) {
      dispatch(setComputerTurn());
      dispatch(addToUserSelections(id));
      if (id in computerShipLocations) {
        setStatus("hit");
        let shipSunk = false;
        for (const ship of computerShipCoordinates) {
          if (ship.length === 1 && ship[0] === id) {
            shipSunk = true;
            dispatch(userMessage(`${convertSquareId(id)} SHIP SUNK!`));
            dispatch(addToSunkShips(id));
          }
        }
        if (!shipSunk)
          dispatch(userMessage(`${convertSquareId(id)} DIRECT HIT!`));
        dispatch(deleteFromShipCoordinates(id));
      } else {
        setStatus("miss");
        dispatch(userMessage(`${convertSquareId(id)} TORPEDO MISSED!`));
      }
      setTimeout(() => {
        dispatch(nextComputerMove());
      }, 1 * 1000);
    }
  };

  useEffect(() => {
    if (id in userSelections) {
      if (id in computerShipLocations) setStatus("hit");
      else setStatus("miss");
    }
  }, [computerShipLocations, id, userSelections]);

  return (
    <div
      className={`comp-square${id in sunkShips ? " selected" : ""}`}
      onClick={handleClick}
      style={
        status || computerTurn ? { cursor: "default" } : { cursor: "pointer" }
      }
    >
      {status ? (status === "hit" ? "💥" : "●") : ""}
    </div>
  );
};

export default CompGridSquare;
