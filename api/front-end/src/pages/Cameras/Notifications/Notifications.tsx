import React, {Component} from "react";
import {WithTranslation, withTranslation} from "react-i18next";


class Notifications extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    hasPermission: false,
    lastLicensePlate: null,
    intervalId: 0,
  };

  constructor(props: any) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount(): void {
    this._isMounted = true;
    this.checkPermission();
    if (this.state.hasPermission) {
      this.getLastSeenLicensePlate().then(() => null);
    }
    const intervalId = setInterval(() => this.getLastSeenLicensePlate(), 60 * 1000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount(): void {
    clearInterval(this.state.intervalId);
    this._isMounted = false;
  }

  async getLastSeenLicensePlate() {
    // Todo, implement api method, logic for notifications
    if (this.state.hasPermission) {
      this.notificationHandler('Seen license plate DUMMY-TEST');
    }
  }

  render() {
    const {t} = this.props;
    return (
      <></>
    )
  }

  checkPermission = () => {
    const this_ = this;
    if (Notification.permission === "granted") {
      this.setState({hasPermission: true});
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission: string) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          this_.setState({hasPermission: true})
        }
      });
    }
  };

  /**
   * Show desktop notification
   * @param message for notification
   */
  notificationHandler = (message: string) => {
    if (this.state.hasPermission) {
      new Notification(message);
    }
  }

}


export default (withTranslation('i18n')(Notifications));

