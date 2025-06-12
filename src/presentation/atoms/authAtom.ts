// src/presentation/atoms/authAtom.ts
import { atom } from 'jotai'

export type MenuModel = {
  id: string
  name: string
  routes: string | null
  icon: string | null
  type: 'menu' | 'modal' | 'external'
  action: string | null
  subject: string | null
  order: number
  parentId: string | null
  children?: Array<MenuModel>
}

export type ILoadInformationUserAccountToUserCodeResponse = {
  personalInformation: {
    completeName: string
    nickname: string
    emailPersonal: string
    cpf: string
    phone: string
    dateOfBirth: string
    rg: string
    cnh: string
    cnhCategory: string
    voterRegistration: string
    maritalStatus: string
  }
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
  }
  relatives: {
    fatherName: string
    motherName: string
    wifeName: string
    howManyBrothers: number
    howManyChildren: number
  }
  employeeDetails: {
    emailCorporate: string
    admissionDate: string
    position: string
    salary: number
    workShift: string
    employContract: string
    costCenterCode: string
    costCenterDescription: string
    lunchBreakDuration: string
    lunchBreakStart: string
    lunchBreakEnd: string
    currentSalary: string
    nextSalaryValue: string
    nextSalaryDate: string
  }
}
export type AuthModel = {
  accessToken: string
  userCode: string
  roles: Array<{ action: string; subject: string }>
  permissions: Array<{ permissaoSigla: string; permissionDesciption: string }>
  profile: Array<{ name: string; desc: string }>
  menus: MenuModel[]
  accountModel: ILoadInformationUserAccountToUserCodeResponse
}

const getInitialAuthState = (): AuthModel | null => {
  // Verifica se o ambiente é do lado do cliente (navegador)
  if (typeof window !== 'undefined') {
    const storedAuth = localStorage.getItem('auth');
    try {
      return storedAuth ? JSON.parse(storedAuth) : null;
    } catch (e) {
      console.error("Erro ao fazer parse do estado de autenticação do localStorage:", e);
      localStorage.removeItem('auth'); // Limpa dados inválidos
      return null;
    }
  }
  return null;
};

export const authAtom = atom<AuthModel | null>(getInitialAuthState());

