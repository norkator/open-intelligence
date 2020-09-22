import * as actionTypes from './actionTypes';
import {ChangeDate, getNowISODate} from '../utils/DateUtils';

export interface ReduxPropsInterface {
  selectedDate: string;
  onIncrementDay: () => void;
  onDecrementDay: () => void;
  onDateSelected: (event: string) => void;
  dateRangeStartDate: string;
  dateRangeEndDate: string;
  onDateRangeStartDateSelected: (event: string) => void;
  onDateRangeEndDateSelected: (event: string) => void
}

const nowIsoDate = getNowISODate();

const initialState = {
  selectedDate: nowIsoDate,
  dateRangeStartDate: ChangeDate(nowIsoDate, -7),
  dateRangeEndDate: nowIsoDate,
};

const dateReducer = (state = initialState, action: any): any => {
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
    case actionTypes.CALENDAR_SELECTION:
      return {
        ...state,
        ...{selectedDate: action.calendar.target.value}
      };
    case actionTypes.DATE_RANGE_START_DATE_SELECTED:
      return {
        ...state,
        ...{dateRangeStartDate: action.calendar.target.value}
      };
    case actionTypes.DATE_RANGE_END_DATE_SELECTED:
      return {
        ...state,
        ...{dateRangeEndDate: action.calendar.target.value}
      };
    default:
      return state;
  }
};

export default dateReducer;
