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
  switch (action.type) {
    case actionTypes.SET_SELECTED_DATE:
      return {
        ...state,
        ...{selectedDate: action.selectedDate}
      };
    case actionTypes.INCREMENT_DAY:
      return {
        ...state,
        ...{selectedDate: ChangeDate(state.selectedDate, action.days)}
      };
    case actionTypes.DECREMENT_DAY:
      return {
        ...state,
        ...{selectedDate: ChangeDate(state.selectedDate, action.days)}
      };
    default:
      return state;
  }
};

export default reducer;
