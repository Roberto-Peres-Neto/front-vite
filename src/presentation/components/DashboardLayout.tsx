// src/presentation/components/DashboardLayout.tsx
import {
  HomeOutlined,
  // Importe todos os ícones que você espera usar dinamicamente.
  InboxOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, Space, Typography, type MenuProps } from 'antd'; // Importado MenuProps
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authAtom, type MenuModel } from '../atoms/authAtom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// Define ItemType para ser o tipo de um item de menu do Ant Design
type ItemType = MenuProps['items'][number];

// Mapeamento dinâmico de strings de ícones para componentes de ícones do Ant Design
const IconMap: { [key: string]: React.ComponentType } = {
  InboxOutlined: InboxOutlined,
  PlusCircleOutlined: PlusCircleOutlined,
  HomeOutlined: HomeOutlined,
  UserOutlined: UserOutlined,
  // Adicione outros ícones conforme necessário
};

// Componente principal do layout do painel
export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [auth, setAuth] = useAtom(authAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // Função para lidar com o clique no item de menu
  const handleMenuItemClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    navigate('/login');
  };

  // Itens do menu de perfil do usuário (dropdown)
  // Tipado explicitamente como ItemType[] para evitar o erro.
  const profileMenuItems: ItemType[] = [
    {
      key: 'profile',
      label: 'Meu Perfil',
      icon: <UserOutlined />,
      onClick: () => {
        console.log('Navegar para o perfil');
      },
    },
    {
      type: 'divider', // O Ant Design reconhece 'divider' como um tipo de item
    },
    {
      key: 'logout',
      label: 'Sair',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  // Função para converter o seu MenuModel para o formato de item de menu do Ant Design
  const getAntdMenuItems = (menus: MenuModel[] | undefined): ItemType[] => {
    if (!menus) return [];

    return menus
      .filter((menu: MenuModel) => menu.routes !== null)
      .sort((a: MenuModel, b: MenuModel) => a.order - b.order)
      .map((menu: MenuModel) => ({
        key: menu.routes!,
        icon: menu.icon && IconMap[menu.icon] ? React.createElement(IconMap[menu.icon]) : null,
        label: menu.name,
        // Se houver submenus, você os processaria aqui.
        // Exemplo: children: menu.children ? getAntdMenuItems(menu.children) : undefined,
      }));
  };

  const menuItems = getAntdMenuItems(auth?.menus);

  // Função para obter a chave selecionada do menu baseado na rota atual
  const getSelectedMenuKey = () => {
    const currentPath = location.pathname;
    const selectedItem = menuItems?.find(item => item.key === currentPath);
    return selectedItem ? selectedItem.key as string : '/home'; // Garante que o retorno seja string
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sider (Menu Lateral) */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={250}
        collapsedWidth={80}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRadius: '0 8px 8px 0',
          boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)',
        }}
      >
        <div
          className="logo"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 24px',
            cursor: 'pointer',
            backgroundColor: '#001529',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0 8px 0 0',
          }}
        >
          {/* Logo da Empresa */}
          {collapsed ? (
            <img src="https://placehold.co/40x40/000/FFF?text=L" alt="Logo" style={{ borderRadius: '50%' }} />
          ) : (
            <Space>
              <img src="https://placehold.co/40x40/000/FFF?text=L" alt="Logo" style={{ borderRadius: '50%' }} />
              <Text style={{ color: 'white', fontSize: '1.2em', marginLeft: 8 }}>Avisei Felipe</Text>
            </Space>
          )}
        </div>
        {/* Menu Ant Design */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedMenuKey()]}
          onClick={handleMenuItemClick}
          items={menuItems}
        />
      </Sider>

      {/* Layout do Conteúdo Principal */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        {/* Header (Barra Superior) */}
        <Header
          style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 24,
            position: 'fixed',
            width: `calc(100% - ${collapsed ? 80 : 250}px)`,
            zIndex: 100,
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Botão de colapsar/expandir menu */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              borderRadius: '0 0 0 8px',
            }}
          />
          {/* Informações do Usuário (Foto de Perfil e Nome) */}
          <Space size="middle">
            <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" arrow>
              <Button type="text" style={{ padding: 0 }}>
                <Space>
                  {/* Usa a URL do nickname se for uma URL de imagem, ou um placeholder.
                      Se o nickname não for uma URL, use o completeName para o placeholder.
                      Adicionado fallback para o avatar se a URL do nickname não for válida.
                  */}
                  <Avatar src={auth?.accountModel?.personalInformation?.nickname} icon={<UserOutlined />} />
                  <Text strong>{auth?.accountModel?.personalInformation?.completeName || 'Usuário'}</Text>
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* Content (Área onde as rotas serão renderizadas) */}
        <Content
          style={{
            margin: '88px 16px 24px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 'calc(100vh - 112px)',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Outlet renderizará os componentes das rotas aninhadas */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
