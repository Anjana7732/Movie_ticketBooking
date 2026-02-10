export const COUNTRIES = {
  IN: {
    code: 'IN',
    name: 'India',
    currencySymbol: '₹',
    currencyCode: 'INR',
    cities: [
      { value: 'Mumbai', label: 'Mumbai' },
      { value: 'Delhi', label: 'Delhi' },
      // Backend uses "Bengaluru" but we surface it as Bangalore in the UI.
      { value: 'Bengaluru', label: 'Bangalore' },
    ],
    defaultLanguage: 'hi',
  },
  NP: {
    code: 'NP',
    name: 'Nepal',
    currencySymbol: 'NPR',
    currencyCode: 'NPR',
    cities: [
      { value: 'Kathmandu', label: 'Kathmandu' },
      { value: 'Pokhara', label: 'Pokhara' },
      { value: 'Lalitpur', label: 'Lalitpur' },
    ],
    defaultLanguage: 'ne',
  },
}

