import React from 'react';
import './App.css';
import NavBar from "./pages/Navbar/Navbar";
import {Switch, Route} from "react-router-dom"
import styles from './pages/Cameras/Cameras.module.css'

// Pages
import Cameras from "./pages/Cameras/Cameras";
import Home from "./pages/Home/Home";
import Faces from "./pages/Faces/Faces";
import Plates from "./pages/Plates/Plates";
import Training from "./pages/Training/Training";


function App() {
  let classes: string[] = [styles.Cameras];
  return (
    <div className="App">
      <NavBar/>
      <div className={classes.join(' ')} style={{paddingBottom: '80px'}}>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/cameras' component={Cameras}/>
          <Route exact path='/plates' component={Plates}/>
          <Route exact path='/faces' component={Faces}/>
          <Route exact path='/training' component={Training}/>
        </Switch>
      </div>
    </div>
  );
}

export default App;
