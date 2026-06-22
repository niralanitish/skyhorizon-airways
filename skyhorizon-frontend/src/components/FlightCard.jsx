function FlightCard({
    flightNumber,
    source,
    destination,
    price
}) {

    return (
        <div>
            <h2>{flightNumber}</h2>

            <p>From : {source}</p>

            <p>To : {destination}</p>

            <p>Price : ₹{price}</p>
        </div>
    );

}

export default FlightCard;