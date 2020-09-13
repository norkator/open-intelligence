import React from "react";
import {Switch, Route} from "react-router-dom"

import Cameras from "./app/Cameras/Cameras";
import Home from "./app/Home/Home";

/**
 * This function is handling which part of app page to show
 * rendering is based on navbar selections
 * @constructor
 */
const RouterDom = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/cameras' component={Cameras}/>
    </Switch>
  );
};

export default RouterDom;
