import React, {Component} from "react";
import styles from './Home.module.css'
import Storage from "./Storage/Storage";

class Home extends Component {
  render() {
    return (
      <div>
        <div>Label viewer?</div>
        <Storage/>
        <div>Running instances</div>
      </div>
    )
  }
}


export default Home;
