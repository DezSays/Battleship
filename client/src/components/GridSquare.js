import React, { useState, useEffect } from "react";
import "./GridSquare.css";
import { useSelector, useDispatch } from "react-redux";
import { modifySelectedSquares, updateLastActiveSquare, updateShipLocations, deleteShipLength } from "../actions/gameStartActions";
import { updateShipCoordinates, updateShipIndex, deleteUserShipCoordinate, setMessage, updateLastHit } from "../actions/gamePlayActions";

const GridSquare = ({ id, row, col }) => {

    const dispatch = useDispatch();
    const { shipLength, selectedSquares, shipOrientation, shipLocations, lastActiveSquare } = useSelector(state => state.gameStart);
    const { gameStarted, coordinatesPicked } = useSelector(state => state.gamePlay);
    const [highlighted, setHighlighted] = useState("");
    const [selected, setSelected] = useState("");
    const [pickedPreviously, setPickedPreviously] = useState(false);

    const handleHover = () => {
        dispatch(updateLastActiveSquare(id))
        if (shipOrientation === "horizontal" && (col + shipLength - 1) <= 9) {
            let [anotherShip, squareList] = [false, []];
            for (let count = 0; count < shipLength; count++) {
                if (`${row}${col + count}` in shipLocations) {
                    anotherShip = true;
                    break;
                }
                squareList.push(`${row}${col + count}`)
            }
            anotherShip ? dispatch(modifySelectedSquares([""])) : dispatch(modifySelectedSquares(squareList))
        } else if (shipOrientation === "vertical" && (row + shipLength - 1) <= 9) {
            let [anotherShip, squareList] = [false, []];
            for (let count = 0; count < shipLength; count++) {
                if (`${row + count}${col}` in shipLocations) {
                    anotherShip = true;
                    break;
                }
                squareList.push(`${row + count}${col}`)
            }
            anotherShip ? dispatch(modifySelectedSquares([""])) : dispatch(modifySelectedSquares(squareList))
        } else {
            dispatch(modifySelectedSquares([""]));
        }
    }

    const handleClick = () => {
        if (highlighted) {
            setHighlighted("");
            const newShipLocations = {};
            const newShipCoordinates = [];
            if (shipOrientation === "vertical") {
                for (let count = 0; count < shipLength; count++) {
                    newShipLocations[`${row + count}${col}`] = true
                    newShipCoordinates.push(`${row + count}${col}`)
                }
            } else if (shipOrientation === "horizontal") {
                for (let count = 0; count < shipLength; count++) {
                    newShipLocations[`${row}${col + count}`] = true
                    newShipCoordinates.push(`${row}${col + count}`)
                }
            }
            dispatch(updateShipLocations(newShipLocations));
            dispatch(updateShipCoordinates(newShipCoordinates));
            dispatch(deleteShipLength(shipLength));
        } 
    }

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
    }, [selectedSquares]) 

    useEffect(() => {
        id in shipLocations ? setSelected(" selected") : setSelected("");
    }, [shipLocations])

    useEffect(() => {
        if (!pickedPreviously && id in coordinatesPicked) {
            setPickedPreviously(true);
            if (selected) {
                dispatch(setMessage("Computer hit your ship!"))
                dispatch(updateShipIndex(id));
                dispatch(deleteUserShipCoordinate(id));
            } else {
                dispatch(setMessage("Computer missed!"))
                dispatch(updateLastHit());
            } 
        } 
    }, [coordinatesPicked])

    useEffect(() => {
        if (id === lastActiveSquare) handleHover();
    }, [shipOrientation])

    return (
        <div 
            className={`grid-square${highlighted}${selected}`} 
            onMouseEnter={handleHover} 
            onClick={handleClick}
            style={gameStarted ? { cursor: "default" } : { cursor: "pointer" }}
        >
            {(gameStarted && id in coordinatesPicked) ? (selected ? "💥" : "●") : ""}
        </div>
    )
}

export default GridSquare;