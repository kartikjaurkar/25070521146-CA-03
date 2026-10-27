const sampleMovies = [
  {
    title: 'Inception',
    description:
      'A skilled thief who steals secrets from within dreams is offered a chance at redemption. To earn it, he must plant an idea in the mind of a target while navigating layers of dreams that blur the line between reality and illusion.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    duration: 148,
    language: 'English',
    rating: 8.8,
    releaseDate: '2010-07-16',
    cast: [
      'Leonardo DiCaprio',
      'Joseph Gordon-Levitt',
      'Elliot Page',
      'Tom Hardy',
      'Ken Watanabe',
    ],
    status: 'now_showing',
    featured: false,
  },
  {
    title: 'The Dark Knight',
    description:
      'When a ruthless criminal known as the Joker begins a campaign of chaos in Gotham City, Batman must confront one of his greatest psychological and moral challenges while deciding how far he is willing to go to protect the city.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 152,
    language: 'English',
    rating: 9.0,
    releaseDate: '2008-07-18',
    cast: [
      'Christian Bale',
      'Heath Ledger',
      'Aaron Eckhart',
      'Michael Caine',
      'Gary Oldman',
    ],
    status: 'now_showing',
    featured: false,
  },
  {
    title: 'Interstellar',
    description:
      'With Earth becoming increasingly uninhabitable, a former pilot leads a mission through a wormhole in search of a new home for humanity. The journey tests the limits of love, time, and sacrifice across the vastness of space.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    duration: 169,
    language: 'English',
    rating: 8.7,
    releaseDate: '2014-11-07',
    cast: [
      'Matthew McConaughey',
      'Anne Hathaway',
      'Jessica Chastain',
      'Michael Caine',
    ],
    status: 'now_showing',
    featured: true,
  },
  {
    title: 'Oppenheimer',
    description:
      'The story of J. Robert Oppenheimer, the brilliant physicist who led the Manhattan Project. As the world-changing implications of his work become clear, he faces the weight of history and the consequences of creation.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&q=80',
    genre: ['Drama', 'Thriller'],
    duration: 180,
    language: 'English',
    rating: 8.5,
    releaseDate: '2023-07-21',
    cast: [
      'Cillian Murphy',
      'Emily Blunt',
      'Robert Downey Jr.',
      'Matt Damon',
    ],
    status: 'now_showing',
    featured: false,
  },
  {
    title: 'Parasite',
    description:
      'A struggling family carefully works its way into the household of a wealthy family. What begins as a clever con spirals into a tense and unpredictable story about class, ambition, and survival.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1920&q=80',
    genre: ['Thriller', 'Drama', 'Comedy'],
    duration: 132,
    language: 'Korean',
    rating: 8.5,
    releaseDate: '2019-05-30',
    cast: [
      'Song Kang-ho',
      'Lee Sun-kyun',
      'Cho Yeo-jeong',
      'Choi Woo-shik',
    ],
    status: 'now_showing',
    featured: false,
  },
  {
    title: 'Spirited Away',
    description:
      'A young girl wanders into a mysterious world of spirits and magic. To save her parents and find her way home, she must work in a bathhouse for supernatural beings and discover her own courage.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genre: ['Animation', 'Fantasy', 'Family'],
    duration: 125,
    language: 'Japanese',
    rating: 8.6,
    releaseDate: '2001-07-20',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
    status: 'now_showing',
    featured: false,
  },
  {
    title: 'La La Land',
    description:
      'A jazz pianist and an aspiring actress fall in love while chasing their creative dreams in Los Angeles. Their romance is tested by ambition, opportunity, and the choices that shape a life.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1920&q=80',
    genre: ['Romance', 'Drama', 'Comedy'],
    duration: 128,
    language: 'English',
    rating: 8.0,
    releaseDate: '2016-12-09',
    cast: ['Ryan Gosling', 'Emma Stone', 'John Legend', 'Rosemarie DeWitt'],
    status: 'now_showing',
    featured: false,
  },
  {
    title: 'The Grand Budapest Hotel',
    description:
      'A legendary concierge and his loyal lobby boy become entangled in a whimsical adventure involving a priceless painting, a family fortune, and the changing face of Europe between the wars.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80',
    genre: ['Comedy', 'Adventure', 'Crime'],
    duration: 99,
    language: 'English',
    rating: 8.1,
    releaseDate: '2014-03-28',
    cast: [
      'Ralph Fiennes',
      'Tony Revolori',
      'F. Murray Abraham',
      'Saoirse Ronan',
    ],
    status: 'now_showing',
    featured: false,
  },
  {
    title: 'The Batman',
    description:
      'In his second year of fighting crime, Batman follows a trail of cryptic clues left by a sadistic killer. The investigation exposes corruption in Gotham and forces him to question the legacy he is building.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 176,
    language: 'English',
    rating: 7.8,
    releaseDate: '2026-12-18',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Jeffrey Wright'],
    status: 'upcoming',
    featured: false,
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales is thrown across the multiverse and encounters a team of Spider-People charged with protecting its existence. He must redefine what it means to be a hero when faced with a difficult choice.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    bannerUrl:
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1920&q=80',
    genre: ['Animation', 'Action', 'Adventure'],
    duration: 140,
    language: 'English',
    rating: 8.6,
    releaseDate: '2026-12-24',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    status: 'upcoming',
    featured: false,
  },
];

const sampleCinemas = [
  {
    name: 'CineBook Grand',
    location: '12 Cinema Avenue, Downtown',
    screens: ['Screen 1', 'IMAX', 'Screen 3'],
  },
  {
    name: 'Starlight Cinemas',
    location: '48 Riverside Walk, Riverside',
    screens: ['Hall A', 'Hall B', 'Dolby Atmos'],
  },
  {
    name: 'Nova Cineplex',
    location: 'Level 3, North Mall, Northside',
    screens: ['Nova 1', 'Nova 2', '4DX'],
  },
];

const showTimes = ['12:30', '16:45', '20:30'];
const showDateOffsets = [1, 2, 3, 4, 5];

module.exports = {
  sampleMovies,
  sampleCinemas,
  showTimes,
  showDateOffsets,
};
