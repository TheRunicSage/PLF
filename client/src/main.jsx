import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import router from './router.jsx';
import './styles/global.css';
import './styles/reveal.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
