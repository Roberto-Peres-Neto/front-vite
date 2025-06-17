import { atom } from "jotai";
import type { MenuModel } from "./authAtom";

export type TabPane = {
  key: string;
  title: string;
  content: React.ReactNode;
  closable?: boolean;
  icon?: React.ReactNode;
  menuItem: MenuModel
}

export const openedTabsAtom = atom<TabPane[]>([])
export const activeTabKeyAtom = atom<string | null>(null);

export const modalStateAtom = atom<{
  visible: boolean;
  content: React.ReactNode | null;
  title: string;
  key: string | null;
}>({
  visible: false,
  content: null,
  title: '',
  key: null,
});