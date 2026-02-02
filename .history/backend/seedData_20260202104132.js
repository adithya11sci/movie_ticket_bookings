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

// Sample movies data
const movies = [
    {
        title: 'Avengers: Secret Wars',
        description: 'The ultimate battle begins as heroes from across the multiverse unite to face their greatest threat yet. When a mysterious force threatens to destroy all of reality, the Avengers must assemble like never before.',
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        duration: 180,
        releaseDate: new Date('2026-05-01'),
        posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 9.2,
        cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson', 'Tom Holland'],
        director: 'Russo Brothers',
        language: 'English',
        status: 'now_showing'
    },
    {
        title: 'The Dark Knight Returns',
        description: 'An aging Bruce Wayne comes out of retirement to fight crime in a Gotham City that has descended into chaos. With new allies and old enemies, Batman faces his most personal battle yet.',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 165,
        releaseDate: new Date('2026-03-15'),
        posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 8.9,
        cast: ['Ben Affleck', 'Michael Keaton', 'Jenna Ortega'],
        director: 'Matt Reeves',
        language: 'English',
        status: 'now_showing'
    },
    {
        title: 'Inception 2: Dreamscape',
        description: 'Dom Cobb returns for one final job that will take him deeper into the dream world than ever before. Reality and dreams blur as he faces the consequences of his past.',
        genre: ['Sci-Fi', 'Thriller', 'Action'],
        duration: 175,
        releaseDate: new Date('2026-04-10'),
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 8.7,
        cast: ['Leonardo DiCaprio', 'Tom Hardy', 'Elliot Page'],
        director: 'Christopher Nolan',
        language: 'English',
        status: 'now_showing'
    },
    {
        title: 'Spider-Man: Beyond the Spider-Verse',
        description: 'Miles Morales continues his journey across the multiverse, meeting new spider-heroes and facing a villain that threatens every dimension.',
        genre: ['Animation', 'Action', 'Adventure'],
        duration: 140,
        releaseDate: new Date('2026-06-20'),
        posterUrl: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 9.0,
        cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
        director: 'Joaquim Dos Santos',
        language: 'English',
        status: 'coming_soon'
    },
    {
        title: 'Interstellar 2',
        description: 'A new generation of explorers ventures beyond our galaxy to find a new home for humanity. The journey will test the limits of human endurance and love.',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        duration: 195,
        releaseDate: new Date('2026-07-04'),
        posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 8.5,
        cast: ['Timothée Chalamet', 'Zendaya', 'Matthew McConaughey'],
        director: 'Christopher Nolan',
        language: 'English',
        status: 'coming_soon'
    },
    {
        title: 'John Wick: Chapter 5',
        description: 'John Wick faces his deadliest challenge yet as assassins from around the world hunt him. With nowhere to run, he must fight his way to freedom.',
        genre: ['Action', 'Thriller', 'Crime'],
        duration: 150,
        releaseDate: new Date('2026-02-14'),
        posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        rating: 8.3,
        cast: ['Keanu Reeves', 'Donnie Yen', 'Laurence Fishburne'],
        director: 'Chad Stahelski',
        language: 'English',
        status: 'now_showing'
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
        const times = ['10:00', '13:30', '17:00', '20:30', '23:00'];
        const prices = [150, 200, 250, 300, 350];

        // Generate showtimes for the next 7 days
        for (let day = 0; day < 7; day++) {
            const showDate = new Date();
            showDate.setDate(showDate.getDate() + day);

            for (const movie of insertedMovies) {
                // Only create showtimes for now_showing movies
                if (movie.status !== 'now_showing') continue;

                for (const theater of insertedTheaters) {
                    // Random 2-3 shows per movie per theater per day
                    const numShows = Math.floor(Math.random() * 2) + 2;
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

        const insertedShowtimes = await ShowTime.insertMany(showtimes);
        console.log(`Added ${insertedShowtimes.length} showtimes`);

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
