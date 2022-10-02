import React, {Component} from 'react';
import NavBar from "./components/Navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import styles from './App.module.css';
import * as auth from './store/actions/auth';
import {connect} from "react-redux";
import {AuthStateInterface} from "./store/reducers/authReducer";
import {ReduxPropsInterface} from "./store/reducers/dateReducer";
import {CommonPropsInterface} from "./store/reducers/commonReducer";

// Pages
import Cameras from "./pages/Cameras/Cameras";
import Home from "./pages/Home/Home";
import Faces from "./pages/Faces/Faces";
import Plates from "./pages/Plates/Plates";
import Training from "./pages/Training/Training";
import History from "./pages/History/History";
import Configuration from "./pages/Configuration/Configuration";


class App extends Component<AuthStateInterface> {

  componentDidMount() {
    // this.props.onTryAutoSignup(); // Enabling some day when this app has authentication
  }

  render() {
    let classes: string[] = [styles.App, 'bg-dark'];

    let content =
      this.props.isAuthenticated ?
        <div>
          <NavBar/>
          <div className={classes.join(' ')}>
            <Routes>
              <Route path='/' element={<Home {...props}/>}/>
              <Route path='/cameras' element={<Cameras/>}/>
              <Route path='/plates' element={<Plates {...props}/>}/>
              <Route path='/faces' element={<Faces/>}/>
              <Route path='/training' element={<Training {...props}/>}/>
              <Route path='/history' element={<History/>}/>
              <Route path='/configuration' element={<Configuration/>}/>
            </Routes>
          </div>
        </div>
        :
        <div className={classes.join(' ')}>
          <h1 className="m-2" style={{color: 'white'}}>Login not implemented</h1>
          <small className="m-2" style={{color: 'white'}}>You should not see this yet</small>
        </div>;

    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

const props: ReduxPropsInterface & CommonPropsInterface & AuthStateInterface = {
  authRedirectPath: "",
  dateRangeEndDate: "",
  dateRangeStartDate: "",
  error: null,
  isAuthenticated: true,
  loading: true,
  onDateRangeEndDateSelected(event: Object): void {
  },
  onDateRangeStartDateSelected(event: Object): void {
  },
  onDateSelected(event: string): void {
  },
  onDecrementDay(): void {
  },
  onIncrementDay(): void {
  },
  onSetAxiosError(error: any): void {
  },
  selectedDate: "",
  token: null,
  userId: null
}

const mapStateToProps = (state: any) => {
  return {
    isAuthenticated: state.authReducer.token !== null,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onTryAutoSignup: () => dispatch(auth.authCheckState())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
