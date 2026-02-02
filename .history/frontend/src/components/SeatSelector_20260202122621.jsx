import { FaInfoCircle } from 'react-icons/fa';
import './SeatSelector.css';

const SeatSelector = ({ theater, bookedSeats = [], selectedSeats = [], onSeatSelect, prices }) => {
    
    // Define seat sections with proper configuration
    const sections = {
        vip: { 
            rows: ['N', 'M'], 
            price: prices?.vip || 480, 
            label: 'VIP RECLINER' 
        },
        premium: { 
            rows: ['L', 'K', 'J', 'I', 'H', 'G', 'F', 'E'], 
            price: prices?.premium || 280, 
            label: 'PRIME' 
        },
        regular: { 
            rows: ['D', 'C', 'B', 'A'], 
            price: prices?.regular || 260, 
            label: 'CLASSIC' 
        }
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
        // Simulate bestseller seats (center seats in premium rows)
        const seatNum = parseInt(seatId.slice(1));
        if (seatNum >= 8 && seatNum <= 13 && ['J', 'K', 'L'].includes(seatId[0])) {
            return 'seat bestseller';
        }
        return 'seat available';
    };

    const renderSeatRow = (rowLabel) => {
        const totalSeats = 18;
        const seats = [];
        
        // Left section (1-5)
        for (let i = 1; i <= 5; i++) {
            const seatId = `${rowLabel}${i}`;
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
        
        // Left aisle gap
        seats.push(<div key={`gap-left-${rowLabel}`} className="seat-gap"></div>);
        
        // Center section (6-13)
        for (let i = 6; i <= 13; i++) {
            const seatId = `${rowLabel}${i}`;
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
        
        // Right aisle gap
        seats.push(<div key={`gap-right-${rowLabel}`} className="seat-gap"></div>);
        
        // Right section (14-18)
        for (let i = 14; i <= totalSeats; i++) {
            const seatId = `${rowLabel}${i}`;
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
                    <span className="section-price">₹ {section.price} {section.label}</span>
                    <span className="section-availability">Available</span>
                </div>
                <div className="seat-rows">
                    {section.rows.map(rowLabel => (
                        <div key={rowLabel} className="seat-row">
                            <span className="row-label">{rowLabel}</span>
                            <div className="seats-in-row">
                                {renderSeatRow(rowLabel)}
                            </div>
                            <span className="row-label">{rowLabel}</span>
                        </div>
                    ))}
                </div>
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
                    <span>Bestseller <FaInfoCircle size={12} /></span>
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
