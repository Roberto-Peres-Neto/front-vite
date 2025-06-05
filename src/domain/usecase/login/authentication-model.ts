export interface Authentication {
  auth: (params: Authentication.Params) => Promise<Authentication.Model>
}

export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }

  export type Model = {
    accessToken: string
    userCode: string
    roles: Array<{ action: string; subject: string }>
    permissions: Array<{ permissaoSigla: string; permissionDesciption: string }>
    profile: Array<{ name: string; desc: string }>
    menus: Array<{
      id: string
      name: string
      route: string | null
      icon: string | null
      type: 'menu' | 'modal' | 'external'
      action: string | null
      subject: string | null
      order: number
      parentId: string | null
      children?: Array<{
        id: string
        name: string
        route: string | null
        icon: string | null
        type: 'menu' | 'modal' | 'external'
        action: string | null
        subject: string | null
        order: number
        parentId: string | null
      }>
    }>
  }
}
