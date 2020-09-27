import React, {Component} from "react";
import {
  WithTranslation,
  withTranslation
} from "react-i18next";
import {
  getLicensePlateDetections,
  LicensePlateDetectionsInterface
} from "../../../utils/HttpUtils";
import {DateIsOlderThanHour, getNowISODate} from "../../../utils/DateUtils";


class Notifications extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    hasPermission: true,
    notificationsEnabled: true,
    resultOption: 'distinct_detection', // this will return results from known plates only
    lastLicensePlate: '',
    intervalId: 0,
  };

  constructor(props: any) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount(): void {
    this._isMounted = true;
    this.checkPermission();
    const intervalId = setInterval(() => this.getLastSeenLicensePlate(), 60 * 1000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount(): void {
    clearInterval(this.state.intervalId);
    this._isMounted = false;
  }

  async getLastSeenLicensePlate() {
    if (this.state.hasPermission && this.state.notificationsEnabled) {
      const licensePlateDetections = await getLicensePlateDetections(
        this.state.resultOption, getNowISODate(), '', '') as LicensePlateDetectionsInterface[];
      if (licensePlateDetections.length > 0) {
        const lastItem: LicensePlateDetectionsInterface = licensePlateDetections[licensePlateDetections.length - 1];
        if (!DateIsOlderThanHour(Date.parse(lastItem.title))) {
          if (this.state.lastLicensePlate !== lastItem.detectionCorrected) {
            this.setState({lastLicensePlate: lastItem.detectionCorrected});
            this.notificationHandler(
              lastItem.detectionCorrected + ' - ' + lastItem.ownerName + ' seen ' + lastItem.title
            );
          }
        }
      }
    }
  }

  render() {
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

