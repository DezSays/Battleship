/**
 * This function saves a game in a database using Axios and a POST request.
 * @param email - The email parameter is a string that represents the email address of the user who
 * wants to save their game.
 * @param savedGame - The savedGame parameter is an object that represents the game data that needs to
 * be saved in the database. It could contain information such as the player's progress, score, items
 * collected, etc.
 */
import axios from "axios";

const saveGameInDatabase = (email, savedGame) => {
  axios.post(`https://battleship-server.vercel.app/api/saveGame/${email}`, { game: savedGame });
};

export default saveGameInDatabase;
