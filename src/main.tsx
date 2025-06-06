import { App as AntdApp, ConfigProvider } from 'antd'; // ⬅️ aqui
import 'antd/dist/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './main/routes/routes';
import { AuthProvider } from './presentation/contexts/AuthProvider';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <AntdApp>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
)
