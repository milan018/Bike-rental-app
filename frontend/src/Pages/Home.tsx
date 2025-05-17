import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";

const Home = () => {
  const { data: bikes } = useQuery("fetchQuery", () => apiClient.fetchBikes());

  const topRowBikes = bikes?.slice(0, 2) || [];
  const bottomRowBikes = bikes?.slice(2) || [];

  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Latest Bikes</h2>
      <p>Most recent Bikes added by our hosts</p>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {topRowBikes.map((bike) => (
            <LatestDestinationCard bike={bike} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {bottomRowBikes.map((bike) => (
            <LatestDestinationCard bike={bike} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
