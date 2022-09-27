import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/reducers/dateReducer";
import {
  INCREMENT_DAY,
  DECREMENT_DAY,
  CALENDAR_SELECTION
} from '../../../store/actionTypes';
import {connect} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";


class DateSelector extends Component<ReduxPropsInterface & WithTranslation> {

  render() {
    const {t} = this.props;

    return (
      <div>
        <div className="">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">{t('home.dateSelector.selectedDay')}</span>
            </div>
            <input id="selected_day_field" type="date" className="form-control" placeholder="Change day"
                   aria-label="Day change" value={this.props.selectedDate}
                   onChange={(event: any) => this.props.onDateSelected(event)}/>
            <div className="input-group-append">
              <button className="btn btn-outline-info" type="button"
                      onClick={this.props.onDecrementDay}>
                {t('home.dateSelector.earlier')}
              </button>
              <button className="btn btn-outline-info" type="button"
                      onClick={this.props.onIncrementDay}>
                {t('home.dateSelector.next')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any): any => {
  return {
    selectedDate: state.dateReducer.selectedDate,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onIncrementDay: () => dispatch({type: INCREMENT_DAY, days: 1}),
    onDecrementDay: () => dispatch({type: DECREMENT_DAY, days: -1}),
    onDateSelected: (value: any) => dispatch({type: CALENDAR_SELECTION, calendar: value}),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('i18n')(DateSelector));
