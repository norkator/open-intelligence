import * as actionTypes from './actionTypes';
import {ChangeDate} from '../utils/DateUtils';

export interface ReduxPropsInterface {
  selectedDate: string;
  onIncrementDay: any;
  onDecrementDay: any;
}

export interface ReduxDispatchInterface {
  onSelectedDateChange: any;
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
      return state;
    case actionTypes.INCREMENT_DAY:
      console.log(action);
      return {
        selectedDate: ChangeDate(action.selectedDate, 1)
      };
    default:
      return state;
  }
};

export default reducer;
