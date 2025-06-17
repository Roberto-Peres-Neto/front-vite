// src/presentation/components/DashboardLayout.tsx
import {
  HomeOutlined,
  InboxOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
// Import MenuInfo from antd/lib/menu for correct click event typing
import { Avatar, Button, ConfigProvider, Dropdown, Layout, Menu, Modal, Space, Tabs, Typography, theme as antdTheme, type MenuProps } from 'antd';
import { useAtom, type Atom } from 'jotai';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAtom, type MenuModel } from '../atoms/authAtom';
import { activeTabKeyAtom, modalStateAtom, openedTabsAtom, type TabPane } from '../atoms/uiAtoms';


// Import MenuInfo type for menu click event typing
import type { MenuInfo } from 'rc-menu/lib/interface';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

type ItemType = MenuProps['items'][number];

const IconMap: { [key: string]: React.ComponentType } = {
  InboxOutlined: InboxOutlined,
  PlusCircleOutlined: PlusCircleOutlined,
  HomeOutlined: HomeOutlined,
  UserOutlined: UserOutlined,
};

// =========================================================
// Page/Modal Components Definition
// Moved outside the main component to prevent unnecessary recreation
// =========================================================

const WarehouseEntryPage: React.FC = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-800">Página de Entrada de Armazém</h1>
    <p className="text-gray-600 mt-2">Conteúdo da página de entrada de armazém.</p>
  </div>
);

const CreateWarehouseModalContent: React.FC = () => {
  const [modalState, setModalState] = useAtom(modalStateAtom);

  const handleClose = () => {
    setModalState({ ...modalState, visible: false });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-700">Formulário de Criação de Armazém</h2>
      <p className="text-gray-600 mt-2">Este é o conteúdo do seu modal. Você pode colocar um formulário aqui.</p>
      <Button onClick={handleClose} className="mt-4">Fechar Modal</Button>
    </div>
  );
};

const DefaultPage: React.FC<{ routeName: string }> = ({ routeName }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-800">Página: {routeName}</h1>
    <p className="text-gray-600 mt-2">
      Este é um placeholder. Você precisa criar um componente React para esta rota.
    </p>
  </div>
);

export function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800">Bem-vindo à Página Inicial!</h1>
      <p className="text-gray-600 mt-2">Este é o conteúdo da sua página inicial.</p>
      <p className="text-gray-600 mt-2">O menu lateral e o cabeçalho superior estão fixos.</p>
    </div>
  );
}

// Map routes to React components
const RouteComponentMap: { [key: string]: React.ComponentType<any> } = {
  '/home': HomePage,
  '/warehouse/entry': WarehouseEntryPage,
  // Add other route components here as needed
};

// Map 'modal' menu types to modal components
const ModalComponentMap: { [key: string]: React.ComponentType<any> } = {
  '/warehouse/create': CreateWarehouseModalContent, // Example of a modal
  // Add other modal components here
};

// =========================================================

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [auth, setAuth] = useAtom(authAtom);
  const [openedTabs, setOpenedTabs] = useAtom(openedTabsAtom) as [TabPane[], (update: TabPane[] | ((prev: TabPane[]) => TabPane[])) => void];
  const [activeTabKey, setActiveTabKey] = useAtom(activeTabKeyAtom) as [string | null, (update: string | null | ((prev: string | null) => string | null)) => void];

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [modalState, setModalState] = useAtom(modalStateAtom) as [
    typeof modalStateAtom extends Atom<infer T> ? T : never,
    (update: (typeof modalStateAtom extends Atom<infer T> ? T : never) | ((prev: (typeof modalStateAtom extends Atom<infer T> ? T : never)) => (typeof modalStateAtom extends Atom<infer T> ? T : never))) => void
  ];


  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const profileMenuItems: ItemType[] = [
    {
      key: 'profile',
      label: 'Meu Perfil',
      icon: <UserOutlined />,
      onClick: () => {
        console.log('Navigate to profile');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sair',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const getAntdMenuItems = (menus: MenuModel[] | undefined): ItemType[] => {
    if (!menus) return [];

    return menus
      .filter((menu: MenuModel) => menu.routes !== null)
      .sort((a: MenuModel, b: MenuModel) => a.order - b.order)
      .map((menu: MenuModel) => ({
        key: menu.routes!,
        icon: menu.icon && IconMap[menu.icon] ? React.createElement(IconMap[menu.icon]) : null,
        label: menu.name,
        menuItem: menu, // Ensure the complete MenuModel is available in onClick
      }));
  };

  const menuItems = getAntdMenuItems(auth?.menus);

  const handleMenuItemClick = useCallback(({ key, item }: MenuInfo) => {
    const menuItem: MenuModel | undefined = (item as any)?.props?.menuItem;

    if (!menuItem) {
      navigate(key);
      return;
    }

    switch (menuItem.type) {
      case 'menu': {
        const existingTabIndex = openedTabs.findIndex(tab => tab.key === key);
        if (existingTabIndex !== -1) {
          setActiveTabKey(key);
          navigate(key);
        } else {
          const Component = RouteComponentMap[key] || (() => <DefaultPage routeName={menuItem.name} />);
          const newTab: TabPane = {
            key: key,
            title: menuItem.name,
            content: <Component />,
            closable: true,
            menuItem: menuItem,
          };
          setOpenedTabs(prev => [...prev, newTab]);
          setActiveTabKey(key);
          navigate(key);
        }
        break;
      }
      case 'modal': {
        const ModalComponent = ModalComponentMap[key];
        if (ModalComponent) {
          setModalState({
            visible: true,
            content: <ModalComponent />,
            title: menuItem.name,
            key: key,
          });
        } else {
          console.warn(`No modal component found for key: ${key}`);
        }
        break;
      }
      case 'external':
        if (menuItem.routes) {
          window.open(menuItem.routes, '_blank');
        }
        break;
      default:
        navigate(key);
        break;
    }
  }, [openedTabs, setOpenedTabs, setActiveTabKey, setModalState, navigate]);

  const onTabChange = (activeKey: string) => {
    setActiveTabKey(activeKey);
    navigate(activeKey);
  };

  const onTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      const newOpenedTabs = openedTabs.filter(tab => tab.key !== targetKey);
      setOpenedTabs(newOpenedTabs);

      if (activeTabKey === targetKey) {
        const newActiveKey = newOpenedTabs.length > 0 ? newOpenedTabs[newOpenedTabs.length - 1].key : '/home';
        setActiveTabKey(newActiveKey);
        navigate(newActiveKey);
      }
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const existingTab = openedTabs.find(tab => tab.key === currentPath);

    if (currentPath === '/' || currentPath === '/home') {
      const homeTab: TabPane = {
        key: '/home',
        title: 'Home',
        content: <HomePage />,
        closable: false, // Home tab usually not closable
        menuItem: { id: 'home', name: 'Home', routes: '/home', icon: 'HomeOutlined', type: 'menu', action: null, subject: null, order: 0, parentId: null }
      };
      if (!existingTab) {
        setOpenedTabs([homeTab]);
      }
      setActiveTabKey('/home');
    } else if (existingTab) {
      setActiveTabKey(currentPath);
    } else {
      const correspondingMenuItem = auth?.menus?.find(m => m.routes === currentPath && m.type === 'menu');
      if (correspondingMenuItem) {
        const Component = RouteComponentMap[currentPath] || (() => <DefaultPage routeName={correspondingMenuItem.name} />);
        const newTab: TabPane = {
          key: currentPath,
          title: correspondingMenuItem.name,
          content: <Component />,
          closable: true,
          menuItem: correspondingMenuItem,
        };
        setOpenedTabs(prev => [...prev, newTab]);
        setActiveTabKey(currentPath);
      } else {
        if (location.pathname !== '/home') {
          navigate('/home');
        }
      }
    }
  }, [location.pathname, auth?.menus, openedTabs, setOpenedTabs, setActiveTabKey, navigate]);

  const getSelectedMenuKey = () => {
    const currentPath = location.pathname;
    const selectedItem = menuItems?.find(item => item.key === currentPath);
    if (selectedItem) {
      return selectedItem.key as string;
    }

    const correspondingMenuItem = auth?.menus?.find(m => m.routes === currentPath && m.type === 'menu');
    if (correspondingMenuItem) {
      return correspondingMenuItem.routes as string;
    }

    return '/home';
  };

  // Find the content of the active tab to be rendered in Content
  const activeTabContent = openedTabs.find(tab => tab.key === activeTabKey)?.content || null;
  const themeAlgorithm = theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ConfigProvider
      theme={{
        algorithm: themeAlgorithm,
        token: {
          colorBgBase: theme === 'dark' ? '#1f1f1f' : '#fff',
          colorTextBase: theme === 'dark' ? '#fff' : '#000',
          colorPrimary: '#1677ff',
        },
      }}
    >

      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme={theme}
          width={250}
          collapsedWidth={80}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
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
               background: theme === 'dark' ? '#141414' : '#fff',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0 8px 0 0', // Adicionado border radius aqui
            }}
          >
            {collapsed ? (
              <img src="https://placehold.co/40x40/000/FFF?text=L" alt="Logo" style={{ borderRadius: '50%' }} />
            ) : (
              <Space>
                <img src="https://placehold.co/40x40/000/FFF?text=L" alt="Logo" style={{ borderRadius: '50%' }} />
                <Text style={{ color: 'white', fontSize: '1.2em', marginLeft: 8 }}>Avisei Felipe</Text>
              </Space>
            )}
          </div>
          <Menu
            theme={theme}
            mode="inline"
            selectedKeys={[getSelectedMenuKey()]}
            onClick={handleMenuItemClick}
            items={menuItems}
          />
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
          <Header
            style={{
              backgroundColor: theme === 'dark' ? '#141414' : '#e8e8e8',
              height: 40, // Altura fixa
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'fixed',
              left: collapsed ? 80 : 250,
              right: 0,
              top: 0,
              zIndex: 100,
              boxShadow: 'none', // Removido sombra do header
              transition: 'left 0.2s',
              padding: 0, // Removido padding para que as tabs preencham a borda
            }}
          >
            {/* Tabs - Alinhadas à esquerda e com scroll */}
            <div style={{ flexGrow: 1, overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
              <Tabs
                type="editable-card"
                hideAdd
                onChange={onTabChange}
                activeKey={activeTabKey || '/home'}
                onEdit={onTabEdit}
                style={{
                  minWidth: '100%',
                  height: '100%',
                  display: 'inline-flex',
                  background: theme === 'dark' ? '#141414' : '#fff',
                }}
                tabBarStyle={{
                  marginBottom: 0,
                  background: theme === 'dark' ? '#141414' : '#fff',
                  borderBottom: 'none', // Remove a linha
                  paddingLeft: 24,
                }}
                items={openedTabs.map(pane => ({
                  key: pane.key,
                  label: (
                    <Space size={4}>
                      {pane.menuItem.icon && IconMap[pane.menuItem.icon] ? React.createElement(IconMap[pane.menuItem.icon]) : null}
                      {pane.title}
                    </Space>
                  ),
                  children: null as React.ReactNode, // Conteúdo renderizado no Content
                  closable: pane.closable, // Mantém o botão de fechar (true para a maioria, false para Home)
                }))}
              />
            </div>

            {/* User Info (Avatar and Name) - Alinhado à direita */}
            <Space size="middle" style={{ marginLeft: 16, paddingRight: 24 }}> {/* Adicionado paddingRight aqui */}
              <Button
                type="text"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                icon={theme === 'light' ? <UserOutlined /> : <UserOutlined />} // Troque por um ícone de lua/sol se quiser
              >
                {theme === 'light' ? 'Dark' : 'Light'}
              </Button>
              <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" arrow>
                <Button type="text" style={{ padding: 0 }}>
                  <Space>
                    <Avatar src={auth?.accountModel?.personalInformation?.nickname} icon={<UserOutlined />} />
                    <Text strong>{auth?.accountModel?.personalInformation?.completeName}</Text>
                  </Space>
                </Button>
              </Dropdown>
            </Space>
          </Header>

          {/* Content (Área onde as rotas serão renderizadas) */}
          <Content
            style={{
              background: theme === 'dark' ? '#1f1f1f' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
              marginTop: 40,
              marginRight: 0,
              marginBottom: 0,
              marginLeft: 0,
              padding: 24,
              minHeight: 'calc(100vh - 64px)',
              boxShadow: 'none', // Remove sombra
              borderRadius: '0',
              overflow: 'auto',
              borderTop: 'none', // Garante que não há borda
            }}
          >
            {/* Renderiza o conteúdo da aba ativa aqui */}
            {activeTabContent}
          </Content>
        </Layout>

        <Modal
          title={modalState.title}
          open={modalState.visible}
          onCancel={() => setModalState({ ...modalState, visible: false })}
          footer={null}
          width={700}
          destroyOnHidden={true}
        >
          {modalState.content}
        </Modal>
      </Layout>
    </ConfigProvider>

  );
};
