import { atom } from 'jotai'

export const authAtom = atom<{
  accessToken: string
  userCode: string
} | null>(null)
