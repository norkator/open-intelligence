import React, {Component} from "react";
// import styles from './Home.module.css'
import Storage from "./Storage/Storage";
import Labels from "./Labels/Labels";
import {connect} from "react-redux";
import {ReduxPropsInterface} from "../../store/reducer";

class Home extends Component<ReduxPropsInterface> {
  render() {
    return (
      <div>
        <div className="ml-4" style={{color: 'white'}}>Date / calendar selection here</div>
        <Labels selectedDate={this.props.selectedDate}/>
        <Storage/>
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
