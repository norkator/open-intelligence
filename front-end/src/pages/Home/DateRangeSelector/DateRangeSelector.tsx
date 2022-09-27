import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/reducers/dateReducer";
import {DATE_RANGE_END_DATE_SELECTED, DATE_RANGE_START_DATE_SELECTED} from "../../../store/actionTypes";
import {connect} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {CommonPropsInterface} from "../../../store/reducers/commonReducer";


class DateRangeSelector extends Component<ReduxPropsInterface & WithTranslation & CommonPropsInterface> {
  render() {
    const {t} = this.props;

    return (
      <div>
        <div className="input-group mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text">{t('home.dateRangeSelector.daysBetween')}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('i18n')(DateRangeSelector));
