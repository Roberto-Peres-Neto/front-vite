// src/main/routes/routes.tsx
import { authAtom, type MenuModel } from '@/presentation/atoms/authAtom'; // Importa MenuModel e AuthModel
import { DashboardLayout } from '@/presentation/components/DashboardLayout';
import { useAtom } from 'jotai';
import { Navigate, Route, Routes } from 'react-router-dom';
import makeLoginForm from '../factories/pages/login/login';

// =========================================================
// Crie/importe seus componentes de página aqui.
// É crucial que estes componentes sejam definidos FORA da função AppRoutes
// para evitar recriação desnecessária e problemas de renderização.
// =========================================================

// Exemplo de componente para /warehouse/entry
const WarehouseEntryPage: React.FC = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-800">Página de Entrada de Armazém</h1>
    <p className="text-gray-600 mt-2">Conteúdo da página de entrada de armazém.</p>
  </div>
);

// Exemplo de componente para /warehouse/create (mesmo que seja tipo 'modal', pode ter uma rota para ele)
const CreateWarehousePage: React.FC = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-800">Página de Criar Entrada</h1>
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

// Seu componente HomePage existente, agora definido FORA de AppRoutes
export function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800">Bem-vindo à Página Inicial!</h1>
      <p className="text-gray-600 mt-2">Este é o conteúdo da sua página inicial.</p>
      <p className="text-gray-600 mt-2">O menu lateral e o cabeçalho superior estão fixos.</p>
    </div>
  );
}

// =========================================================


export function AppRoutes() {
  const [auth] = useAtom(authAtom);

  return (
    <Routes>
      {/* Rota para o formulário de login */}
      <Route path="/login" element={makeLoginForm()} />

      {/* Rota principal que usa o DashboardLayout. */}
      {/* Se o usuário não estiver autenticado, ele é redirecionado para /login. */}
      {/* As rotas filhas serão renderizadas dentro do <Outlet /> no DashboardLayout. */}
      <Route
        path="/"
        element={auth ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        {/* Rota inicial ou padrão quando o usuário está logado (e.g., / ou /home) */}
        <Route index element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Mapeia dinamicamente as rotas com base nos menus do usuário logado */}
        {auth?.menus?.map((menu: MenuModel) => {
          // Apenas adiciona rotas para itens de menu que possuem uma 'route' definida
          // e que você deseja que sejam acessíveis via URL (tipo 'menu', por exemplo).
          // Se "modal" deve abrir um modal real, a lógica seria diferente no onClick do menu,
          // e não necessariamente uma rota aqui, mas para fins de demonstração, incluiremos.
          if (menu.routes) {
            let ComponentToRender: React.FC<any>;

            // Mapeia a rota do menu para o componente React correspondente
            switch (menu.routes) {
              case '/warehouse/entry':
                ComponentToRender = WarehouseEntryPage;
                break;
              case '/warehouse/create': // Mesmo sendo "modal", se tiver rota, pode ser mapeado.
                ComponentToRender = CreateWarehousePage;
                break;
              // Adicione mais casos aqui para cada rota que você tiver em seus menus
              // case '/sua/nova/rota':
              //   ComponentToRender = SeuNovoComponentePage;
              //   break;
              default:
                // Se a rota não for mapeada para um componente específico, use um componente padrão
                ComponentToRender = () => <DefaultPage routeName={menu.name} />;
                break;
            }

            return (
              <Route
                key={menu.id} // Use o ID do menu como chave única para a rota
                path={menu.routes}
                element={<ComponentToRender />}
              />
            );
          }
          return null; // Não renderiza rotas para itens sem 'route'
        })}
      </Route>

      {/* Rota de fallback para qualquer caminho não encontrado */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}
