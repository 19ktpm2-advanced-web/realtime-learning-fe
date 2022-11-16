import mem from "mem";

import instance from "./axiosPrivate";

const refreshTokenFn = async () => {
  const currentSession = JSON.parse(localStorage.getItem("session") || "");

  try {
    const response = await instance.post("/auth/refresh", {
      refreshToken: currentSession?.refreshToken
    });

    // Get new session token from backend
    const { session } = response.data;

    if (!session?.accessToken) {
      localStorage.removeItem("session");
      localStorage.removeItem("user");
    }

    localStorage.setItem("session", JSON.stringify(session));

    return session;
  } catch (error) {
    localStorage.removeItem("session");
    localStorage.removeItem("user");
  }
};

const maxAge = 10000;

export const memorizedRefreshToken = mem(refreshTokenFn, {
  maxAge
});
