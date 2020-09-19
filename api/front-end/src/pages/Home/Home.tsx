import React, {Component} from "react";
// import styles from './Home.module.css'
import Instances from "./Instances/Instances";
import Labels from "./Labels/Labels";
import {connect} from "react-redux";
import {ReduxPropsInterface} from "../../store/reducer";
import DateSelector from "./DateSelector/DateSelector";
import Calendar from "./Calendar/Calendar";

class Home extends Component<ReduxPropsInterface> {
  render() {
    return (
      <div>
        <div className="mt-2 mr-2 ml-2">
          <DateSelector {...this.props} />
        </div>
        <div className="mt-2 mr-2 ml-2">
          <Labels {...this.props} />
        </div>
        <div className="mt-2 mr-2 ml-2">
          <Calendar {...this.props} />
        </div>
        <div className="mt-2 mr-2 ml-2">
          <Instances/>
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
