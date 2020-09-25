import React, {Component} from "react";
import {WithTranslation, withTranslation} from "react-i18next";


class Instances extends Component<WithTranslation> {
  state = {
    lastLicensePlate: null
  };

  componentDidMount(): void {
    this.getLastSeenLicensePlate().then(() => null);
    this.notificationHandler();
  }

  async getLastSeenLicensePlate() {
  }

  render() {
    const {t} = this.props;
    return (
      <div>
      </div>
    )
  }

  notificationHandler = () => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.info("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      const notification = new Notification("Hi there!");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("Hi there!");
        }
      });
    }
  }

}


export default (withTranslation('i18n')(Instances));

