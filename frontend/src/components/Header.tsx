import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutbutton from "./SignOutButton";
const Header = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/" title="Go to Homepage">
            BikeRental.com
          </Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              {" "}
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-bikes"
              >
                My Bike
              </Link>
              <SignOutbutton />
            </>
          ) : (
            <Link
              to="/Sign-in"
              className="text-blue-600 bg-white px-3 py-2 rounded-md font-bold hover:bg-gray-100"
              title="Sign in to your account"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};
export default Header;
