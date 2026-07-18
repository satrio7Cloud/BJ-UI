import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { OrderProvider } from './context/OrderContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </ThemeProvider>
  </BrowserRouter>
)
