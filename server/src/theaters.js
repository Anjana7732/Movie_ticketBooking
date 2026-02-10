// Static theater and showtime data for multiple cities.

const SHOWTIMES = ['10:00 AM', '1:30 PM', '4:30 PM', '7:30 PM', '10:30 PM'];

const theatersByCity = [
  {
    city: 'Bengaluru',
    theaters: [
      {
        id: 'blr-pvr-orion',
        name: 'PVR Orion Mall',
        address: 'Brigade Gateway, Dr Rajkumar Rd, Bengaluru',
        showtimes: SHOWTIMES,
      },
      {
        id: 'blr-inox-garuda',
        name: 'INOX Garuda Mall',
        address: 'Magrath Rd, Ashok Nagar, Bengaluru',
        showtimes: SHOWTIMES,
      },
    ],
  },
  {
    city: 'Mumbai',
    theaters: [
      {
        id: 'mum-pvr-icon',
        name: 'PVR ICON, Phoenix Mall',
        address: 'Lower Parel, Mumbai',
        showtimes: SHOWTIMES,
      },
      {
        id: 'mum-cinepolis-andheri',
        name: 'Cinépolis Andheri',
        address: 'Andheri West, Mumbai',
        showtimes: SHOWTIMES,
      },
    ],
  },
  {
    city: 'Delhi',
    theaters: [
      {
        id: 'del-pvr-pacific',
        name: 'PVR Pacific Mall',
        address: 'Tagore Garden, New Delhi',
        showtimes: SHOWTIMES,
      },
      {
        id: 'del-inox-nehrup',
        name: 'INOX Nehru Place',
        address: 'Nehru Place, New Delhi',
        showtimes: SHOWTIMES,
      },
    ],
  },
];

export function getTheaters() {
  return theatersByCity;
}

