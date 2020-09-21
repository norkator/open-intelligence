import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/dateReducer";
import {DATE_RANGE_END_DATE_SELECTED, DATE_RANGE_START_DATE_SELECTED} from "../../../store/actionTypes";
import {connect} from "react-redux";


class DateRangeSelector extends Component<ReduxPropsInterface> {
  render() {
    return (
      <div>
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text">Day's between</span>
          </div>
          <input type="date" className="form-control" placeholder="Change day"
                 aria-label="Day change"
                 value={this.props.dateRangeStartDate}
                 onChange={(event: any) => this.props.onDateRangeStartDateSelected(event)}/>
          <input type="date" className="form-control" placeholder="Change day"
                 aria-label="Day change"
                 value={this.props.dateRangeEndDate}
                 onChange={(event: any) => this.props.onDateRangeEndDateSelected(event)}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any): any => {
  return {
    dateRangeStartDate: state.dateReducer.dateRangeStartDate,
    dateRangeEndDate: state.dateReducer.dateRangeEndDate,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onDateRangeStartDateSelected: (value: string) => dispatch({type: DATE_RANGE_START_DATE_SELECTED, calendar: value}),
    onDateRangeEndDateSelected: (value: string) => dispatch({type: DATE_RANGE_END_DATE_SELECTED, calendar: value}),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DateRangeSelector);
