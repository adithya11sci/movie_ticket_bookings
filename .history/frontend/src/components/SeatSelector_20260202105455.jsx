import './SeatSelector.css';

const SeatSelector = ({ theater, bookedSeats, selectedSeats, onSeatSelect }) => {
    // generate seats based on theater layout
    const rows = theater?.seatLayout?.rows || 10;
    const cols = theater?.seatLayout?.columns || 12;
    
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const handleSeatClick = (seatId) => {
        // dont allow booking already booked seats
        if (bookedSeats.includes(seatId)) return;
        
        if (selectedSeats.includes(seatId)) {
            // remove seat if already selected
            onSeatSelect(selectedSeats.filter(s => s !== seatId));
        } else {
            // add seat to selection
            onSeatSelect([...selectedSeats, seatId]);
        }
    };

    const getSeatClass = (seatId) => {
        if (bookedSeats.includes(seatId)) return 'seat booked';
        if (selectedSeats.includes(seatId)) return 'seat selected';
        return 'seat available';
    };

    return (
        <div className="seat-selector">
            <div className="screen">
                <span>SCREEN</span>
            </div>
            
            <div className="seats-container">
                {[...Array(rows)].map((_, rowIndex) => (
                    <div key={rowIndex} className="seat-row">
                        <span className="row-label">{rowLabels[rowIndex]}</span>
                        {[...Array(cols)].map((_, colIndex) => {
                            const seatId = `${rowLabels[rowIndex]}${colIndex + 1}`;
                            return (
                                <div
                                    key={seatId}
                                    className={getSeatClass(seatId)}
                                    onClick={() => handleSeatClick(seatId)}
                                >
                                    {colIndex + 1}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="seat-legend">
                <div className="legend-item">
                    <div className="seat available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="seat selected"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="seat booked"></div>
                    <span>Booked</span>
                </div>
            </div>
        </div>
    );
};

export default SeatSelector;
