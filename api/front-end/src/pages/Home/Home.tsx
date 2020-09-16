import React, {Component} from "react";
// import styles from './Home.module.css'
import Storage from "./Storage/Storage";
import Labels from "./Labels/Labels";

class Home extends Component {
  render() {
    return (
      <div>
        <Labels/>
        <Storage/>
      </div>
    )
  }
}


export default Home;
