import * as actionTypes from '../actionTypes';
import {AxiosError} from "axios";

export interface CommonPropsInterface {
  onSetAxiosError: (error: AxiosError | any) => void;
}

interface CommonStateInterface {
  axiosError: AxiosError | null;
}

interface CommonActionInterface {
  type: string;
  axiosError: AxiosError | null;
}

const initialState = {
  axiosError: null
};

const commonReducer = (state: CommonStateInterface = initialState, action: CommonActionInterface): CommonStateInterface => {
  switch (action.type) {
    case actionTypes.SET_AXIOS_ERROR:
      return {
        ...state,
        ...{axiosError: action.axiosError}
      };
    default:
      return state;
  }
};

export default commonReducer;
