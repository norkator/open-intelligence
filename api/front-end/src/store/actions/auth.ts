import {AUTH_LOGOUT, AUTH_SUCCESS} from "../actionTypes";

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: AUTH_LOGOUT
  };
};

export const authSuccess = (token: string, userId: number) => {
  return {
    type: AUTH_SUCCESS,
    idToken: token,
    userId: userId
  };
};

export const checkAuthTimeout = (expirationTime: number) => {
  return (dispatch: any) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authCheckState = () => {
  return (dispatch: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      // @ts-ignore
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = Number(localStorage.getItem('userId')) | 0;
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};
