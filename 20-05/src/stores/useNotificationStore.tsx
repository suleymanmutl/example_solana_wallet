import { create, State } from 'zustand';
import produce from 'immer';

interface NotificationStore extends State {
  notifications: Array<{
    type: string;
    message: string;
    description?: string;
    txid?: string;
  }>;
  set: (x: (state: NotificationStore) => void) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  set: (fn) => set(produce(fn)),
}));
