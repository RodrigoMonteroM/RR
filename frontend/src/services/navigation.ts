import { NavigateFunction } from 'react-router-dom';

let _navigate: NavigateFunction | null = null;

export const navigationService = {
  setNavigate(fn: NavigateFunction) {
    _navigate = fn;
  },
  navigate(to: string) {
    if (_navigate) {
      _navigate(to, { replace: true });
    } else {
      window.location.href = to;
    }
  },
};
