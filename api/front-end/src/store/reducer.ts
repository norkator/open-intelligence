import * as actionTypes from './actionTypes';
import {Reducer} from "redux";

const initialState = {
  selectedDate: null,
};

const reducer = (state = initialState, action: any): any => {
  switch (action.type) {
    case actionTypes.SET_SELECTED_DATE:
      state.selectedDate = action.selectedDate;
      break
    default:
      return state;
  }
};

export default reducer;
