import { FaInfoCircle } from 'react-icons/fa';
import './SeatSelector.css';

const SeatSelector = ({ theater, bookedSeats, selectedSeats, onSeatSelect, prices }) => {
    const rowLabels = 'NMLKJIHGFEDCBA'.split(''); // Reversed for theater layout (back to front)
    
    // Define seat sections
    const sections = {
        vip: { rows: ['N'], price: prices?.vip || 480, label: 'VIP', seatsPerSide: [4, 4], centerGap: 6 },
        premium: { rows: ['M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E'], price: prices?.premium || 280, label: 'PREMIUM', seatsPerSide: [6, 10, 3], centerGap: 0 },
        regular: { rows: ['D', 'C', 'B', 'A'], price: prices?.regular || 260, label: 'EXECUTIVE', seatsPerSide: [6, 10], centerGap: 0 }
    };

    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        
        if (selectedSeats.includes(seatId)) {
            onSeatSelect(selectedSeats.filter(s => s !== seatId));
        } else {
            onSeatSelect([...selectedSeats, seatId]);
        }
    };

    const getSeatClass = (seatId) => {
        if (bookedSeats.includes(seatId)) return 'seat sold';
        if (selectedSeats.includes(seatId)) return 'seat selected';
        // Simulate some bestseller seats
        const seatNum = parseInt(seatId.slice(1));
        if (seatNum >= 8 && seatNum <= 12 && ['J', 'K', 'L'].includes(seatId[0])) {
            return 'seat bestseller';
        }
        return 'seat available';
    };

    const renderSeatRow = (rowLabel, config) => {
        const totalSeats = 20; // Total seats per row
        const seats = [];
        
        for (let i = totalSeats; i >= 1; i--) {
            const seatId = `${rowLabel}${i}`;
            
            // Add gaps for aisle effect
            if (i === 14 || i === 7) {
                seats.push(<div key={`gap-${rowLabel}-${i}`} className="seat-gap"></div>);
            }
            
            seats.push(
                <div
                    key={seatId}
                    className={getSeatClass(seatId)}
                    onClick={() => handleSeatClick(seatId)}
                    title={`Seat ${seatId}`}
                >
                    {i}
                </div>
            );
        }
        
        return seats;
    };

    const renderSection = (sectionKey, section) => {
        return (
            <div key={sectionKey} className="seat-section">
                <div className="section-header">
                    <span className="section-price">₹{section.price} {section.label}</span>
                </div>
                {section.rows.map(rowLabel => (
                    <div key={rowLabel} className="seat-row">
                        <span className="row-label">{rowLabel}</span>
                        <div className="seats-in-row">
                            {renderSeatRow(rowLabel, section)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="seat-selector-bms">
            {/* Screen */}
            <div className="screen-container">
                <div className="screen-curve"></div>
                <span className="screen-text">All eyes this way please!</span>
            </div>

            {/* Seat Sections */}
            <div className="seats-wrapper">
                {renderSection('vip', sections.vip)}
                {renderSection('premium', sections.premium)}
                {renderSection('regular', sections.regular)}
            </div>

            {/* Legend */}
            <div className="seat-legend-bms">
                <div className="legend-item">
                    <div className="legend-seat bestseller"></div>
                    <span>Bestseller <FaInfoCircle /></span>
                </div>
                <div className="legend-item">
                    <div className="legend-seat available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="legend-seat selected"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="legend-seat sold"></div>
                    <span>Sold</span>
                </div>
            </div>
        </div>
    );
};

export default SeatSelector;
