const ShowTime = require('../models/ShowTime');

/**
 * Cleanup expired seat locks
 * This runs periodically to release seats that were locked but never booked
 */
const cleanupExpiredLocks = async () => {
    try {
        const now = new Date();
        
        // Find all showtimes with expired locks
        const showtimes = await ShowTime.find({
            'seatStatus': {
                $elemMatch: {
                    status: 'locked',
                    lockExpiry: { $lt: now }
                }
            }
        });
        
        let cleanedCount = 0;
        
        for (const showtime of showtimes) {
            // Remove expired locks
            const originalLength = showtime.seatStatus.length;
            showtime.seatStatus = showtime.seatStatus.filter(seat => {
                if (seat.status === 'locked' && seat.lockExpiry && seat.lockExpiry < now) {
                    return false;
                }
                return true;
            });
            
            cleanedCount += originalLength - showtime.seatStatus.length;
            await showtime.save();
        }
        
        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned up ${cleanedCount} expired seat locks`);
        }
        
    } catch (error) {
        console.error('Error cleaning up expired locks:', error);
    }
};

/**
 * Start the cleanup scheduler
 * Runs every minute to check for expired locks
 */
const startCleanupScheduler = () => {
    // Run cleanup every minute
    setInterval(cleanupExpiredLocks, 60 * 1000);
    console.log('🕐 Seat lock cleanup scheduler started (runs every minute)');
    
    // Also run once on startup
    cleanupExpiredLocks();
};

module.exports = {
    cleanupExpiredLocks,
    startCleanupScheduler
};
