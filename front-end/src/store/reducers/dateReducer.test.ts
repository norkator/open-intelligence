import dateReducer, {DateActionInterface} from "./dateReducer";
import {
  ChangeDate,
  getNowISODate
} from "../../utils/DateUtils";
import {
  CALENDAR_SELECTION,
  DATE_RANGE_END_DATE_SELECTED,
  DATE_RANGE_START_DATE_SELECTED,
  DECREMENT_DAY,
  INCREMENT_DAY,
  SET_SELECTED_DATE
} from "../actionTypes";


describe('dateReducer', () => {
  const nowIsoDate = getNowISODate();
  const testDate = '2020-01-01';

  it('should return the initial state with default nowISODate', () => {
    expect(dateReducer(undefined, {} as DateActionInterface)).toEqual(
      {
        selectedDate: nowIsoDate,
        dateRangeStartDate: ChangeDate(nowIsoDate, -7),
        dateRangeEndDate: nowIsoDate,
      }
    );
  });

  it('should set selectedDate state variable to ' + testDate, () => {
    expect(dateReducer({
      selectedDate: nowIsoDate,
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: nowIsoDate,
    }, {
      type: SET_SELECTED_DATE,
      selectedDate: testDate,
    } as DateActionInterface)).toEqual({
      selectedDate: testDate,
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: nowIsoDate,
    });
  });

  it('should increment selectedDate ' + testDate + ' by five days', () => {
    expect(dateReducer({
      selectedDate: testDate,
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: nowIsoDate,
    }, {
      type: INCREMENT_DAY,
      days: 5,
    } as DateActionInterface)).toEqual({
      selectedDate: '2020-01-06',
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: nowIsoDate,
    });
  });

  it('should decrement selectedDate ' + testDate + ' by five days', () => {
    expect(dateReducer({
      selectedDate: testDate,
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: nowIsoDate,
    }, {
      type: DECREMENT_DAY,
      days: -5,
    } as DateActionInterface)).toEqual({
      selectedDate: '2019-12-27',
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: nowIsoDate,
    });
  });

  it('should be date coming from calendar.target.value selection', () => {
    expect(dateReducer({
      selectedDate: nowIsoDate,
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: nowIsoDate,
    }, {
      type: CALENDAR_SELECTION,
      calendar: {
        target: {
          value: testDate
        }
      }
    } as DateActionInterface)).toEqual({
      selectedDate: testDate,
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: nowIsoDate,
    });
  });

  it('should calendar.target.value date range start date selection', () => {
    expect(dateReducer({
      selectedDate: nowIsoDate,
      dateRangeStartDate: '',
      dateRangeEndDate: nowIsoDate,
    }, {
      type: DATE_RANGE_START_DATE_SELECTED,
      calendar: {
        target: {
          value: testDate
        }
      }
    } as DateActionInterface)).toEqual({
      selectedDate: nowIsoDate,
      dateRangeStartDate: testDate,
      dateRangeEndDate: nowIsoDate,
    });
  });

  it('should calendar.target.value date range end date selection', () => {
    expect(dateReducer({
      selectedDate: nowIsoDate,
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: '',
    }, {
      type: DATE_RANGE_END_DATE_SELECTED,
      calendar: {
        target: {
          value: testDate
        }
      }
    } as DateActionInterface)).toEqual({
      selectedDate: nowIsoDate,
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: testDate,
    });
  });

});
