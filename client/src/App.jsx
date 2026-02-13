import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { MovieDetailsPage } from './pages/MovieDetailsPage.jsx'
import { BookingPage } from './pages/BookingPage.jsx'
import { SummaryPage } from './pages/SummaryPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { ConfirmationPage } from './pages/ConfirmationPage.jsx'
import { MyTicketsPage } from './pages/MyTicketsPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/tickets" element={<MyTicketsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
