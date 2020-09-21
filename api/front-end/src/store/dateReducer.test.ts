import dateReducer, {getNowISODate} from "./dateReducer";
import {ChangeDate} from "../utils/DateUtils";
import {INCREMENT_DAY, SET_SELECTED_DATE} from "./actionTypes";


describe('dateReducer', () => {
  const nowIsoDate = getNowISODate();
  const testDate = '2020-01-01';

  it('should return the initial state with default nowISODate', () => {
    expect(dateReducer(undefined, {})).toEqual(
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
    })).toEqual({
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
    })).toEqual({
      selectedDate: '2020-01-06',
      dateRangeStartDate: ChangeDate(nowIsoDate, -7),
      dateRangeEndDate: nowIsoDate,
    });
  });

});
