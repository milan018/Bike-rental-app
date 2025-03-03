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
import Booking from "./Pages/Booking";
import MyBookings from "./Pages/MyBookings";
import Home from "./Pages/Home";

const App = () => {
  const { isLoggedIn, user } = useAppContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
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
              path="/bike/:bikeId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />
            {user?.role === "admin" && (
              <>
                <Route
                  path="/add-bike"
                  element={
                    <Layout>
                      <AddBike />
                    </Layout>
                  }
                />
                <Route
                  path="/edit-bike/:bikeId"
                  element={
                    <Layout>
                      <EditBike />
                    </Layout>
                  }
                />
              </>
            )}

            <Route
              path="/my-bikes"
              element={
                <Layout>
                  {" "}
                  <MyBike />{" "}
                </Layout>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings />
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
