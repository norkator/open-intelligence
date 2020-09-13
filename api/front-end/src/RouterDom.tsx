import React from "react";
import {Switch, Route, useLocation} from "react-router-dom"
import styles from './app/Cameras/Cameras.module.css'

import Cameras from "./app/Cameras/Cameras";
import Home from "./app/Home/Home";

/**
 * This function is handling which part of app page to show
 * rendering is based on navbar selections
 * @constructor
 */
const RouterDom = () => {
  const location = useLocation();
  let classes: string[] = [];

  if (location.pathname === '/cameras') {
    classes = [styles.Cameras];
  }

  return (
    <div className={classes.join(' ')}>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/cameras' component={Cameras}/>
      </Switch>
    </div>
  );
};

export default RouterDom;
