// seedData.js - Script to add sample movies, theaters, and showtimes
// Run this file once to populate the database with test data

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const ShowTime = require('./models/ShowTime');
const User = require('./models/User');

// Sample movies data with high-quality poster images
const movies = [
    {
        title: 'Avengers: Secret Wars',
        description: 'The ultimate battle begins as heroes from across the multiverse unite to face their greatest threat yet. When a mysterious force threatens to destroy all of reality, the Avengers must assemble like never before.',
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        duration: 180,
        releaseDate: new Date('2026-05-01'),
        posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 9.2,
        language: 'English',
        isNowShowing: true
    },
    {
        title: 'The Dark Knight Returns',
        description: 'An aging Bruce Wayne comes out of retirement to fight crime in a Gotham City that has descended into chaos. With new allies and old enemies, Batman faces his most personal battle yet.',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 165,
        releaseDate: new Date('2026-03-15'),
        posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 8.9,
        language: 'English',
        isNowShowing: true
    },
    {
        title: 'Inception 2: Dreamscape',
        description: 'Dom Cobb returns for one final job that will take him deeper into the dream world than ever before. Reality and dreams blur as he faces the consequences of his past.',
        genre: ['Sci-Fi', 'Thriller', 'Action'],
        duration: 175,
        releaseDate: new Date('2026-04-10'),
        posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 8.7,
        language: 'English',
        isNowShowing: true
    },
    {
        title: 'Spider-Man: Beyond the Spider-Verse',
        description: 'Miles Morales continues his journey across the multiverse, meeting new spider-heroes and facing a villain that threatens every dimension.',
        genre: ['Animation', 'Action', 'Adventure'],
        duration: 140,
        releaseDate: new Date('2026-06-20'),
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 9.0,
        language: 'English',
        isNowShowing: false
    },
    {
        title: 'Interstellar 2',
        description: 'A new generation of explorers ventures beyond our galaxy to find a new home for humanity. The journey will test the limits of human endurance and love.',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        duration: 195,
        releaseDate: new Date('2026-07-04'),
        posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 8.5,
        language: 'English',
        isNowShowing: false
    },
    {
        title: 'John Wick: Chapter 5',
        description: 'John Wick faces his deadliest challenge yet as assassins from around the world hunt him. With nowhere to run, he must fight his way to freedom.',
        genre: ['Action', 'Thriller', 'Crime'],
        duration: 150,
        releaseDate: new Date('2026-02-14'),
        posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 8.3,
        language: 'English',
        isNowShowing: true
    }
];

// Sample theaters data
const theaters = [
    {
        name: 'PVR Cinemas - Downtown',
        location: 'Downtown Mall, Main Street',
        city: 'Mumbai',
        totalSeats: 150,
        facilities: ['Dolby Atmos', 'IMAX', 'Recliner Seats', '4K Projection'],
        contactNumber: '+91 9876543210'
    },
    {
        name: 'INOX - City Center',
        location: 'City Center Mall, Park Avenue',
        city: 'Mumbai',
        totalSeats: 120,
        facilities: ['3D', 'Dolby Sound', 'Premium Seating'],
        contactNumber: '+91 9876543211'
    },
    {
        name: 'Cinepolis - Metro Mall',
        location: 'Metro Mall, Highway Road',
        city: 'Bangalore',
        totalSeats: 180,
        facilities: ['IMAX', '4DX', 'Luxury Loungers', 'Dolby Atmos'],
        contactNumber: '+91 9876543212'
    },
    {
        name: 'PVR Gold - Prestige',
        location: 'Prestige Tower, Business District',
        city: 'Bangalore',
        totalSeats: 80,
        facilities: ['Gold Class', 'Recliner Seats', 'In-seat Service', 'Dolby Atmos'],
        contactNumber: '+91 9876543213'
    }
];

// Function to seed data
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Movie.deleteMany({});
        await Theater.deleteMany({});
        await ShowTime.deleteMany({});
        console.log('Cleared existing data');

        // Insert movies
        const insertedMovies = await Movie.insertMany(movies);
        console.log(`Added ${insertedMovies.length} movies`);

        // Insert theaters
        const insertedTheaters = await Theater.insertMany(theaters);
        console.log(`Added ${insertedTheaters.length} theaters`);

        // Create showtimes for each movie in each theater
        const showtimes = [];
        const times = ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM', '11:00 PM'];
        const prices = [150, 200, 250, 300, 350];

        console.log(`Movies count: ${insertedMovies.length}`);
        console.log(`Theaters count: ${insertedTheaters.length}`);

        // Generate showtimes for the next 7 days
        for (let day = 0; day < 7; day++) {
            const showDate = new Date();
            showDate.setDate(showDate.getDate() + day);

            for (const movie of insertedMovies) {
                // Only create showtimes for now_showing movies
                if (!movie.isNowShowing) continue;

                for (const theater of insertedTheaters) {
                    // 2-3 shows per movie per theater per day
                    const numShows = 3;
                    const selectedTimes = times.slice(0, numShows);

                    for (let i = 0; i < selectedTimes.length; i++) {
                        showtimes.push({
                            movie: movie._id,
                            theater: theater._id,
                            showDate: showDate,
                            showTime: selectedTimes[i],
                            price: {
                                regular: prices[i],
                                premium: prices[i] + 100
                            },
                            availableSeats: theater.totalSeats,
                            bookedSeats: []
                        });
                    }
                }
            }
        }

        console.log(`Showtimes to insert: ${showtimes.length}`);
        
        if (showtimes.length > 0) {
            const insertedShowtimes = await ShowTime.insertMany(showtimes);
            console.log(`Added ${insertedShowtimes.length} showtimes`);
        } else {
            console.log('No showtimes to insert');
        }

        // Create admin user if not exists
        const adminExists = await User.findOne({ email: 'admin@moviebook.com' });
        if (!adminExists) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Admin User',
                email: 'admin@moviebook.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Created admin user: admin@moviebook.com / admin123');
        }

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📝 Admin Login:');
        console.log('   Email: admin@moviebook.com');
        console.log('   Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
