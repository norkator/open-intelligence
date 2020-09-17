import React, {Component} from "react";
import {ReduxPropsInterface} from "../../../store/reducer";
import {INCREMENT_DAY, DECREMENT_DAY} from '../../../store/actionTypes';
import {connect} from "react-redux";


class DateSelector extends Component<ReduxPropsInterface> {

  render() {
    return (
      <div>
        <div className="">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">Selected day</span>
            </div>
            <input id="selected_day_field" type="date" className="form-control" placeholder="Change day"
                   aria-label="Day change" value={this.props.selectedDate} onChange={() => null}/>
            <div className="input-group-append">
              <button className="btn btn-outline-info" type="button"
                      onClick={this.props.onDecrementDay}>
                ← Earlier
              </button>
              <button className="btn btn-outline-info" type="button"
                      onClick={this.props.onIncrementDay}>
                Next →
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
    selectedDate: state.selectedDate,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onIncrementDay: () => dispatch({type: INCREMENT_DAY, days: 1}),
    onDecrementDay: () => dispatch({type: DECREMENT_DAY, days: -1}),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);
