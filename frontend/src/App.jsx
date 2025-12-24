import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
