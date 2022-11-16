import mem from "mem";
import { axiosPublic } from "./axiosPublic";
import constants from "../constants";
const refreshToken = async () => {
  const sessionStorage = JSON.parse(localStorage.getItem("session"));
  try {
    const response = await axiosPublic.post(
      constants.apiConfig.ENDPOINT.refreshToken,
      {
        refreshToken: sessionStorage?.refreshToken
      }
    );
    const { session } = response.data?.data;
    if (!session) {
      localStorage.removeItem("session");
    }
    localStorage.setItem("session", JSON.stringify(session));
    return session;
  } catch (err) {
    localStorage.removeItem("session");
    return null;
  }
};
export const memorizedRefreshToken = mem(refreshToken, {
  maxAge: constants.apiConfig.refreshTokenMaxAge
});
