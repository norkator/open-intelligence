import React, {Component} from "react";
// import styles from './Home.module.css'
import Storage from "./Storage/Storage";
import Labels from "./Labels/Labels";
import {connect} from "react-redux";
import {ReduxPropsInterface} from "../../store/reducer";
import DateSelector from "./DateSelector/DateSelector";

class Home extends Component<ReduxPropsInterface> {
  render() {
    return (
      <div>
        <div className="mt-2 mr-2 ml-2">
          <DateSelector selectedDate={this.props.selectedDate} onDecrementDay="" onIncrementDay="" />
        </div>
        <div className="mt-2 mr-2 ml-2">
          <Labels selectedDate={this.props.selectedDate} onDecrementDay="" onIncrementDay=""/>
        </div>
        <div className="mt-2 mr-2 ml-2">
          <Storage/>
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

export default connect(mapStateToProps)(Home);
