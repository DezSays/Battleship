/**
 * This function checks if there is a valid token in local storage and dispatches actions accordingly.
 */
import axios from "axios";
import store from "../store";
import { addToken, addError } from "../actions/authActions";
import { loadUserInfo } from "../actions/userActions";

const checkToken = async () => {
  if (localStorage.token) {
    try {
      const response = await axios.get("https://battleship-8nff.vercel.app/protected", {
        headers: {
          authorization: localStorage.token,
        },
      });
      if (response.data.isValid) {
        store.dispatch(addToken(localStorage.token));
        store.dispatch(loadUserInfo(response.data));
      }
    } catch (error) {
      store.dispatch(addError(error));
    }
  }
};

export default checkToken;
