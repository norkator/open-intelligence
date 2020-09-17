import * as actionTypes from './actionTypes';

export interface ReduxPropsInterface {
  selectedDate: string;
}

/**
 * Get today date
 * @return String date in ISO format
 */
const getNowISODate = (): string => {
  return new Date().toISOString().substr(0, 10);
};


const initialState = {
  selectedDate: getNowISODate(),
};

const reducer = (state = initialState, action: any): any => {
  // noinspection JSRedundantSwitchStatement
  switch (action.type) {
    case actionTypes.SET_SELECTED_DATE:
      state.selectedDate = action.selectedDate;
      break;
    default:
      return state;
  }
};

export default reducer;
