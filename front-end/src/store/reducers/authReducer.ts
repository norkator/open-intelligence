import {
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_SUCCESS,
  SET_AUTH_REDIRECT_PATH
} from "../actionTypes";


export interface AuthStateInterface {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  error: string | null;
  loading: boolean;
  authRedirectPath: string;
}

export interface AuthActionInterface {
  type: string;
  error: string;
  idToken: string;
  userId: number;
  path: string;
}

const initialState = {
  isAuthenticated: false,
  token: 'dummy-place-holder', // token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/'
};

const authStart = (state: AuthStateInterface, action: AuthActionInterface) => {
  return updateObject(state, {error: null, loading: true});
};

const authSuccess = (state: AuthStateInterface, action: AuthActionInterface) => {
  return updateObject(state, {
    token: action.idToken,
    userId: action.userId,
    error: null,
    loading: false
  });
};

const authFail = (state: AuthStateInterface, action: AuthActionInterface) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const authLogout = (state: AuthStateInterface, action: AuthActionInterface) => {
  return updateObject(state, {token: null, userId: null});
};

const setAuthRedirectPath = (state: AuthStateInterface, action: AuthActionInterface) => {
  return updateObject(state, {authRedirectPath: action.path})
}

const reducer = (state: AuthStateInterface = initialState, action: AuthActionInterface) => {
  switch (action.type) {
    case AUTH_START:
      return authStart(state, action);
    case AUTH_SUCCESS:
      return authSuccess(state, action);
    case AUTH_FAIL:
      return authFail(state, action);
    case AUTH_LOGOUT:
      return authLogout(state, action);
    case SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    default:
      return state;
  }
};

const updateObject = (oldObject: Object, updatedProperties: Object): Object => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export default reducer;
