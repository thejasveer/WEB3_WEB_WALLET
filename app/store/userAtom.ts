import { atom } from 'recoil';
import { User } from '../lib/user';

export const userAtom = atom<User|null>({
  key: 'userAtom', // unique ID (with respect to other atoms/selectors)
  default: new User(), // default value (aka initial value)
});

export const currentAccountAtom = atom({
    key:"currentAccountAtom",
    default:0
})