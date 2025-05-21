import ReactDOM from 'react-dom/client'
import './index.css'
import router from './router.jsx'
import { RouterProvider } from 'react-router-dom'
import { ContextProvider } from './views/context/ContextProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextProvider>
      <RouterProvider router={router}/>
    </ContextProvider>
)
