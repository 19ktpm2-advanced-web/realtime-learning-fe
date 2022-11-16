import { Button } from "antd";
import * as React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import constants from "../../constants";
import { axiosPrivate } from "../../common/axiosPrivate";

function Home() {
  const navigate = useNavigate();

  const queries = useQuery({
    queryKey: "users",
    queryFn: async () => {
      const response = await axiosPrivate.get(
        `${constants.apiConfig.ENDPOINT.profile}`
      );
      return response?.data || {};
    },
    onSuccess: (data) => {
      if (data?.code !== 200) {
        navigate("/login");
      }
    },
    onError: () => {
      navigate("/login");
    }
  });

  return (
    <div>
      <h1>Home</h1>
      {queries.isLoading && <p>Loading...</p>}
      {queries.isError && <p>Error</p>}
      {queries?.data?.data && (
        <div>
          <p>Full name: {queries.data?.data?.fullName}</p>
          <p>Email: {queries.data?.data?.email}</p>
          <Button
            onClick={() => {
              localStorage.removeItem("session");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
export default Home;
