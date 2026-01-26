/**
 * These are two functions that use axios to update a user's wins or losses in a database by making PUT
 * requests to the appropriate API endpoints.
 * @param email - The email of the user whose wins or losses are being updated in the database.
 * @param wins - The number of wins to update in the database for a specific user identified by their
 * email.
 */
import axios from "axios";

export const updateUserWinsInDatabase = (email, wins) => {
  axios.put(`https://battleship-8nff.vercel.app/api/wins/${email}/${wins}`);
};

export const updateUserLossesInDatabase = (email, losses) => {
  axios.put(`https://battleship-8nff.vercel.app/api/losses/${email}/${losses}`);
};
