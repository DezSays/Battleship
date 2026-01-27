/**
 * The GridSquare component is a functional component that renders a single square on the game board
 * and handles user interactions and updates to the game state.
 * @returns The component GridSquare is being returned.
 */
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  modifySelectedSquares,
  updateLastActiveSquare,
  updateShipLocations,
  deleteShipLength,
} from "../../actions/gameStartActions";
import {
  updateShipCoordinates,
  updateShipIndex,
  deleteUserShipCoordinate,
  computerMessage,
  updateLastHit,
  addToComputerSunkShips,
} from "../../actions/gamePlayActions";
import convertSquareId from "../../utils/convertSquareId";
import "./GridSquare.css";

const GridSquare = ({ id, row, col }) => {
  const dispatch = useDispatch();
  const {
    shipLength,
    selectedSquares,
    shipOrientation,
    shipLocations,
    lastActiveSquare,
  } = useSelector((state) => state.gameStart);
  const { gameStarted, coordinatesPicked, shipCoordinates, computerSunkShips } =
    useSelector((state) => state.gamePlay);
  const [highlighted, setHighlighted] = useState("");
  const [selected, setSelected] = useState("");
  const [pickedPreviously, setPickedPreviously] = useState(false);

  const handleHover = useCallback(() => {
    dispatch(updateLastActiveSquare(id));
    if (shipOrientation === "horizontal" && col + shipLength - 1 <= 9) {
      let [anotherShip, squareList] = [false, []];
      for (let count = 0; count < shipLength; count++) {
        if (`${row}${col + count}` in shipLocations) {
          anotherShip = true;
          break;
        }
        squareList.push(`${row}${col + count}`);
      }
      anotherShip
        ? dispatch(modifySelectedSquares([""]))
        : dispatch(modifySelectedSquares(squareList));
    } else if (shipOrientation === "vertical" && row + shipLength - 1 <= 9) {
      let [anotherShip, squareList] = [false, []];
      for (let count = 0; count < shipLength; count++) {
        if (`${row + count}${col}` in shipLocations) {
          anotherShip = true;
          break;
        }
        squareList.push(`${row + count}${col}`);
      }
      anotherShip
        ? dispatch(modifySelectedSquares([""]))
        : dispatch(modifySelectedSquares(squareList));
    } else {
      dispatch(modifySelectedSquares([""]));
    }
  }, [dispatch, id, shipOrientation, col, shipLength, row, shipLocations]);

  const handleClick = () => {
    if (highlighted) {
      setHighlighted("");
      const newShipLocations = {};
      const newShipCoordinates = [];
      if (shipOrientation === "vertical") {
        for (let count = 0; count < shipLength; count++) {
          newShipLocations[`${row + count}${col}`] = true;
          newShipCoordinates.push(`${row + count}${col}`);
        }
      } else if (shipOrientation === "horizontal") {
        for (let count = 0; count < shipLength; count++) {
          newShipLocations[`${row}${col + count}`] = true;
          newShipCoordinates.push(`${row}${col + count}`);
        }
      }
      dispatch(updateShipLocations(newShipLocations));
      dispatch(updateShipCoordinates(newShipCoordinates));
      dispatch(deleteShipLength(shipLength));
    }
  };

  useEffect(() => {
    for (const squareId of selectedSquares) {
      let squareHighlighted;
      if (squareId === id) {
        setHighlighted(" highlighted");
        squareHighlighted = true;
        break;
      }
      if (!squareHighlighted) setHighlighted("");
    }
  }, [selectedSquares, id]);

  useEffect(() => {
    id in shipLocations ? setSelected(" selected") : setSelected("");
  }, [shipLocations, id]);

  useEffect(() => {
    if (!pickedPreviously && id in coordinatesPicked) {
      setPickedPreviously(true);
      if (selected) {
        let shipSunk = false;
        for (const ship of shipCoordinates) {
          if (ship.length === 1 && ship[0] === id) {
            shipSunk = true;
            dispatch(computerMessage(`${convertSquareId(id)} SHIP SUNK!`));
            dispatch(addToComputerSunkShips(id));
          }
        }
        if (!shipSunk)
          dispatch(computerMessage(`${convertSquareId(id)} DIRECT HIT!`));
        dispatch(updateShipIndex(id));
        dispatch(deleteUserShipCoordinate(id));
      } else {
        dispatch(computerMessage(`${convertSquareId(id)} TORPEDO MISSED!`));
        dispatch(updateLastHit());
      }
    }
  }, [
    coordinatesPicked,
    dispatch,
    id,
    pickedPreviously,
    selected,
    shipCoordinates,
  ]);

  useEffect(() => {
    if (id === lastActiveSquare) handleHover();
  }, [handleHover, id, lastActiveSquare]);

  useEffect(() => {
    setPickedPreviously(false);
  }, [gameStarted]);

  return (
    <div
      className={`grid-square${!gameStarted ? highlighted : ""}${selected}${
        id in computerSunkShips ? " sunk" : ""
      }`}
      onMouseEnter={handleHover}
      onClick={handleClick}
      style={gameStarted ? { cursor: "default" } : { cursor: "pointer" }}
    >
      {gameStarted && id in coordinatesPicked ? (selected ? "💥" : "●") : ""}
    </div>
  );
};

export default GridSquare;