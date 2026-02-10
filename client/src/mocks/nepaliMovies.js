// Realistic mock data for Nepali movies so the app
// feels more localized even without a public API.

export const NEPALI_MOVIES = [
  {
    id: 'np-001',
    title: 'Kabaddi 4: The Final Match',
    poster:
      'https://dummyimage.com/400x600/020617/fbbf24&text=Kabaddi+4%3A+The+Final+Match',
    genre: ['Romance', 'Drama', 'Comedy'],
    duration: 150,
    rating: 8.1,
    description:
      'A heartwarming romantic drama set in a rural village, exploring love, friendship, and rivalry on and off the kabaddi court.',
    language: 'ne',
    languageLabel: 'Nepali',
    country: 'NP',
    priceByCountry: {
      IN: 200,
      NP: 400,
    },
    availableCities: ['Kathmandu', 'Pokhara', 'Lalitpur'],
  },
  {
    id: 'np-002',
    title: 'Prem Geet 3',
    poster:
      'https://dummyimage.com/400x600/020617/f97316&text=Prem+Geet+3',
    genre: ['Romance', 'Musical', 'Drama'],
    duration: 140,
    rating: 7.6,
    description:
      'An epic cross-border love story that blends music, romance, and family drama across generations.',
    language: 'ne',
    languageLabel: 'Nepali',
    country: 'NP',
    priceByCountry: {
      IN: 220,
      NP: 450,
    },
    availableCities: ['Kathmandu', 'Pokhara'],
  },
  {
    id: 'np-003',
    title: 'The Man from Kathmandu',
    poster:
      'https://dummyimage.com/400x600/020617/22c55e&text=The+Man+from+Kathmandu',
    genre: ['Action', 'Thriller'],
    duration: 130,
    rating: 7.2,
    description:
      'An action-packed journey of a conflicted young man discovering his roots in Kathmandu while facing a dangerous criminal network.',
    language: 'ne',
    languageLabel: 'Nepali',
    country: 'NP',
    priceByCountry: {
      IN: 230,
      NP: 420,
    },
    availableCities: ['Kathmandu', 'Lalitpur'],
  },
]

