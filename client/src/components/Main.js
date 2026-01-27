/**
 * The Main component renders the game board, message box, and game buttons, and updates the user's
 * wins and losses in the database and Redux store based on the game outcome.
 * @returns The Main component is being returned.
 */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import PlayerBoard from "./grid/PlayerBoard";
import ComputerBoard from "./grid/ComputerBoard";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import MessageBox from "./message/MessageBox";
import GameBtns from "./GameBtns";
import { updateWins, updateLosses } from "../actions/userActions";
import { setMessage } from "../actions/gamePlayActions";
import {
  updateUserWinsInDatabase,
  updateUserLossesInDatabase,
} from "../utils/updateUserRecord";
import "./Main.css";

const Main = () => {
  const gridArray = new Array(10).fill(new Array(10).fill(0));

  const dispatch = useDispatch();
  const { gameOver, shipCoordinates, computerShipCoordinates } = useSelector(
    (state) => state.gamePlay
  );
  const { wins, losses, email } = useSelector((state) => state.user);

  useEffect(() => {
    if (gameOver && shipCoordinates.length && !computerShipCoordinates.length) {
      dispatch(setMessage("You win!"));
      updateUserWinsInDatabase(email, wins + 1);
      dispatch(updateWins(wins + 1));
    } else if (
      gameOver &&
      !shipCoordinates.length &&
      computerShipCoordinates.length
    ) {
      dispatch(setMessage("You lose!"));
      updateUserLossesInDatabase(email, losses + 1);
      dispatch(updateLosses(losses + 1));
    }
  }, [
    gameOver,
    shipCoordinates.length,
    computerShipCoordinates.length,
    dispatch,
    email,
    wins,
    losses,
  ]);

  return (
    <div className="background">
      <Header />
      <div className="gameplay">
        <PlayerBoard gridArray={gridArray} />
        <div className="right-column mt-3">
          <ComputerBoard gridArray={gridArray} />
          <MessageBox />
        </div>
      </div>
      <GameBtns />
      <Footer />
    </div>
  );
};

export default Main;
