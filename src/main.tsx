import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ui/teheme-provider.tsx'
import { store } from './store/store'
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App /> 
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
