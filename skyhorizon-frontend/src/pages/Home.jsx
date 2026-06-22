import Navbar from "../components/Navbar";
import FlightCard from "../components/FlightCard";

function Home() {

    return (

        <>

            <Navbar />

            <FlightCard
                flightNumber="SH101"
                source="Hyderabad"
                destination="Delhi"
                price={4500}
            />

            <FlightCard
    flightNumber="SH205"
    source="Mumbai"
    destination="Chennai"
    price={6500}
/>

        </>

    );

}

export default Home;