import {Outlet} from "react-router-dom";
import ChefHeader from "../screens/Chef/ChefHeader";

const ChefLayout = () => {
  return (
    <>
      <ChefHeader />
      <Outlet />
    </>
  );
};

export default ChefLayout;
