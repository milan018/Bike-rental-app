import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layouts/Layout";
import Register from "./Pages/Register";
import SignIn from "./Pages/SignIn";
import AddBike from "./Pages/AddBike";
import { useAppContext } from "./contexts/AppContext";
import MyBike from "./Pages/MyBike";
import EditBike from "./Pages/EditBike";
import Search from "./Pages/Search";
import Detail from "./Pages/Detail";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home Page</p>{" "}
            </Layout>
          }
        />
        <Route
          path="/Search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:bikeId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        {isLoggedIn && (
          <>
            <Route
              path="/add-bike"
              element={
                <Layout>
                  {" "}
                  <AddBike />{" "}
                </Layout>
              }
            />
            <Route
              path="/edit-bike/:bikeId"
              element={
                <Layout>
                  {" "}
                  <EditBike />{" "}
                </Layout>
              }
            />
            <Route
              path="/my-bikes"
              element={
                <Layout>
                  {" "}
                  <MyBike />{" "}
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
