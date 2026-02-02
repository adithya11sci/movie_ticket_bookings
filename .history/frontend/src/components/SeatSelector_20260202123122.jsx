import { FaInfoCircle } from 'react-icons/fa';
import './SeatSelector.css';

const SeatSelector = ({ theater, bookedSeats = [], selectedSeats = [], onSeatSelect, prices }) => {
    
    // Define seat sections - BookMyShow style
    const sections = [
        { 
            id: 'recliner',
            name: 'Rs. 480 RECLINER',
            price: prices?.vip || 480,
            rows: [
                { label: 'N', seats: 12 },
                { label: 'M', seats: 12 }
            ]
        },
        { 
            id: 'prime',
            name: 'Rs. 280 PRIME',
            price: prices?.premium || 280,
            rows: [
                { label: 'L', seats: 16 },
                { label: 'K', seats: 16 },
                { label: 'J', seats: 16 },
                { label: 'I', seats: 16 },
                { label: 'H', seats: 16 },
                { label: 'G', seats: 16 }
            ]
        },
        { 
            id: 'classic',
            name: 'Rs. 180 CLASSIC',
            price: prices?.regular || 180,
            rows: [
                { label: 'F', seats: 18 },
                { label: 'E', seats: 18 },
                { label: 'D', seats: 18 },
                { label: 'C', seats: 18 },
                { label: 'B', seats: 18 },
                { label: 'A', seats: 18 }
            ]
        }
    ];

    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        
        if (selectedSeats.includes(seatId)) {
            onSeatSelect(selectedSeats.filter(s => s !== seatId));
        } else {
            onSeatSelect([...selectedSeats, seatId]);
        }
    };

    const isBestseller = (seatId) => {
        const row = seatId[0];
        const num = parseInt(seatId.slice(1));
        // Center seats in middle rows are bestsellers
        return ['J', 'K', 'I', 'H'].includes(row) && num >= 6 && num <= 11;
    };

    const getSeatStatus = (seatId) => {
        if (bookedSeats.includes(seatId)) return 'sold';
        if (selectedSeats.includes(seatId)) return 'selected';
        if (isBestseller(seatId)) return 'bestseller';
        return 'available';
    };

    const renderSeats = (rowLabel, seatCount) => {
        const seats = [];
        const leftSection = Math.floor(seatCount / 4);
        const centerSection = Math.ceil(seatCount / 2);
        const rightSection = seatCount - leftSection - centerSection;
        
        // Left section
        for (let i = 1; i <= leftSection; i++) {
            const seatId = `${rowLabel}${i}`;
            const status = getSeatStatus(seatId);
            seats.push(
                <div
                    key={seatId}
                    className={`bms-seat ${status}`}
                    onClick={() => status !== 'sold' && handleSeatClick(seatId)}
                    data-seat={i}
                >
                    {i}
                </div>
            );
        }
        
        // Left gap
        seats.push(<div key={`${rowLabel}-gap1`} className="bms-seat-gap" />);
        
        // Center section
        for (let i = leftSection + 1; i <= leftSection + centerSection; i++) {
            const seatId = `${rowLabel}${i}`;
            const status = getSeatStatus(seatId);
            seats.push(
                <div
                    key={seatId}
                    className={`bms-seat ${status}`}
                    onClick={() => status !== 'sold' && handleSeatClick(seatId)}
                    data-seat={i}
                >
                    {i}
                </div>
            );
        }
        
        // Right gap
        seats.push(<div key={`${rowLabel}-gap2`} className="bms-seat-gap" />);
        
        // Right section
        for (let i = leftSection + centerSection + 1; i <= seatCount; i++) {
            const seatId = `${rowLabel}${i}`;
            const status = getSeatStatus(seatId);
            seats.push(
                <div
                    key={seatId}
                    className={`bms-seat ${status}`}
                    onClick={() => status !== 'sold' && handleSeatClick(seatId)}
                    data-seat={i}
                >
                    {i}
                </div>
            );
        }
        
        return seats;
    };

    return (
        <div className="bms-seat-layout">
            {/* Screen */}
            <div className="bms-screen-area">
                <div className="bms-screen"></div>
                <p className="bms-screen-label">All eyes this way please!</p>
            </div>

            {/* Seat Sections */}
            <div className="bms-sections">
                {sections.map((section) => (
                    <div key={section.id} className="bms-section">
                        <div className="bms-section-header">
                            <span className="bms-section-name">{section.name}</span>
                        </div>
                        <div className="bms-rows">
                            {section.rows.map((row) => (
                                <div key={row.label} className="bms-row">
                                    <span className="bms-row-label">{row.label}</span>
                                    <div className="bms-seats">
                                        {renderSeats(row.label, row.seats)}
                                    </div>
                                    <span className="bms-row-label">{row.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="bms-legend">
                <div className="bms-legend-item">
                    <span className="bms-legend-box sold"></span>
                    <span>Sold</span>
                </div>
                <div className="bms-legend-item">
                    <span className="bms-legend-box available"></span>
                    <span>Available</span>
                </div>
                <div className="bms-legend-item">
                    <span className="bms-legend-box selected"></span>
                    <span>Selected</span>
                </div>
                <div className="bms-legend-item">
                    <span className="bms-legend-box bestseller"></span>
                    <span>Bestseller <FaInfoCircle size={10} /></span>
                </div>
            </div>
        </div>
    );
};

export default SeatSelector;
