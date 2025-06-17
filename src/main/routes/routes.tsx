// src/main/routes/routes.tsx
import { authAtom, type MenuModel } from '@/presentation/atoms/authAtom'; // Importa MenuModel e AuthModel
import { DashboardLayout, HomePage } from '@/presentation/components/DashboardLayout'; // Import HomePage
import { useAtom } from 'jotai';
import { Navigate, Route, Routes } from 'react-router-dom';
import makeLoginForm from '../factories/pages/login/login';

// =========================================================
// Componentes de página (continuam sendo definidos aqui, mas serão renderizados nas Tabs)
// =========================================================

// Estes componentes serão instanciados e passados para a aba.
// Eles devem ser componentes React válidos.

// Exemplo de componente para /warehouse/entry
const WarehouseEntryPage: React.FC = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-800">Página de Entrada de Armazém</h1>
    <p className="text-gray-600 mt-2">Conteúdo da página de entrada de armazém.</p>
  </div>
);

// Exemplo de componente para /warehouse/create (se você decidir ter uma rota para ele também)
const CreateWarehousePage: React.FC = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-800">Página de Criar Entrada (Rota Direta)</h1>
    <p className="text-gray-600 mt-2">Conteúdo da página para criar uma nova entrada no armazém.</p>
  </div>
);

// Componente de página padrão para rotas não mapeadas ou como placeholder
const DefaultPage: React.FC<{ routeName: string }> = ({ routeName }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-800">Página: {routeName}</h1>
    <p className="text-gray-600 mt-2">
      Este é um placeholder. Você precisa criar um componente React para esta rota.
    </p>
  </div>
);

// =========================================================


export function AppRoutes() {
  const [auth] = useAtom(authAtom);

  return (
    <Routes>
      <Route path="/login" element={makeLoginForm()} />

      <Route
        path="/"
        element={auth ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        {/*
          Estas rotas aqui no routes.tsx são para que o React Router
          saiba que essas URLs são válidas e podem ser acessadas.
          A renderização do *conteúdo* dessas rotas será feita pelas Tabs
          dentro do DashboardLayout. O 'element' aqui pode ser um placeholder
          ou um componente que não renderiza nada diretamente,
          pois o conteúdo real vem do estado das tabs.
        */}
        <Route index element={<HomePage />} /> {/* Renderiza HomePage para '/' */}
        <Route path="/home" element={<HomePage />} /> {/* Renderiza HomePage para '/home' */}

        {auth?.menus?.map((menu: MenuModel) => {
          // Para menus do tipo 'menu', crie uma rota. O conteúdo será gerenciado pelas Tabs.
          // Para 'modal' ou 'external', não é necessário uma rota aninhada aqui,
          // pois a ação será tratada diretamente no onClick do menu no DashboardLayout.
          if (menu.routes && menu.type === 'menu') {
            // O componente aqui pode ser um placeholder ou o próprio componente real,
            // mas o DashboardLayout é quem decidirá qual aba está ativa e seu conteúdo.
            // Aqui estamos apenas definindo que esta rota é um caminho válido.
            let ComponentToRender: React.FC<any>;
            switch (menu.routes) {
              case '/warehouse/entry':
                ComponentToRender = WarehouseEntryPage;
                break;
              // Adicione outros casos para rotas "normais" (tipo 'menu')
              default:
                ComponentToRender = () => <DefaultPage routeName={menu.name} />;
                break;
            }
            return (
              <Route
                key={menu.id}
                path={menu.routes}
                element={<ComponentToRender />} // O elemento aqui é o componente que você quer que apareça na aba
              />
            );
          }
          return null;
        })}
      </Route>

      {/* Rota de fallback para qualquer caminho não encontrado, redireciona para home */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}
