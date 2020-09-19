import React, {Component} from "react";
import {CalendarEventsInterface, getCalendarEvents} from "../../../utils/HttpUtils";

class Calendar extends Component {

  state = {
    calendarEvents: [] as CalendarEventsInterface[]
  };

  componentDidMount(): void {
    this.loadCalendarEvents().then(() => null);
  }

  async loadCalendarEvents() {
    const events = await getCalendarEvents(1);
    console.log(events);
    this.setState({calendarEvents: events});
  }

  render() {
    return (
      <div>
        License plate seen calendar component comes here
      </div>
    )
  }
}

export default Calendar;
