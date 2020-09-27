import React, {Component} from 'react';
import './App.css';
import NavBar from "./pages/Navbar/Navbar";
import {Switch, Route} from "react-router-dom";
import styles from './pages/Cameras/Cameras.module.css';
import * as auth from './store/actions/auth';
import {connect} from "react-redux";

// Pages
import Cameras from "./pages/Cameras/Cameras";
import Home from "./pages/Home/Home";
import Faces from "./pages/Faces/Faces";
import Plates from "./pages/Plates/Plates";
import Training from "./pages/Training/Training";


class App extends Component<any, any> {

  componentDidMount() {
    // this.props.onTryAutoSignup(); // Enabling some day when this app has authentication
  }

  render() {
    let classes: string[] = [styles.Cameras];

    let content =
      this.props.isAuthenticated ?
        <div>
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
        :
        <div className={classes.join(' ')}>
          <h1 className="m-2" style={{color: 'white'}}>Login not implemented</h1>
          <small className="m-2" style={{color: 'white'}}>You should not see this yet</small>
        </div>

    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    isAuthenticated: state.authReducer.token !== null
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onTryAutoSignup: () => dispatch(auth.authCheckState())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
