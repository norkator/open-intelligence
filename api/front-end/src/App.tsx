import React from 'react';
import './App.css';
import NavBar from "./pages/Navbar/Navbar";
import {Switch, Route, useLocation} from "react-router-dom"
import styles from './pages/Cameras/Cameras.module.css'

import Cameras from "./pages/Cameras/Cameras";
import Home from "./pages/Home/Home";
import Faces from "./pages/Faces/Faces";


function App() {
  const location = useLocation();
  let classes: string[] = [];

  // if (location.pathname === '/cameras' || location.pathname === '/faces') {
  classes = [styles.Cameras];
  // }

  return (
    <div className="App">
      <NavBar/>
      <div className={classes.join(' ')}>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/cameras' component={Cameras}/>
          <Route exact path='/faces' component={Faces}/>
        </Switch>
      </div>
    </div>
  );
}

export default App;
