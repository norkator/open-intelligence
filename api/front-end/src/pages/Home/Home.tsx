import React, {Component} from "react";
// import styles from './Home.module.css'
import Storage from "./Storage/Storage";
import Labels from "./Labels/Labels";
import {connect} from 'react-redux';

class Home extends Component {
  render() {
    return (
      <div>
        <div className="ml-4" style={{color: 'white'}}>Date / calendar selection here</div>
        <Labels/>
        <Storage/>
      </div>
    )
  }
}


export default Home;
