import React, {Component} from "react";
import {CalendarEventsInterface, getCalendarEvents} from "../../../utils/HttpUtils";
import FullCalendar, {EventClickArg} from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {Card} from "react-bootstrap";

class Calendar extends Component {
  state = {
    calendarWeekends: true,
    calendarEvents: [] as CalendarEventsInterface[],
  };

  calendarComponentRef = React.createRef<FullCalendar>();

  componentDidMount(): void {
    this.loadCalendarEvents().then(() => null);
  }

  async loadCalendarEvents() {
    const events = await getCalendarEvents(7);
    this.setState({calendarEvents: events});
  }

  render() {
    return (
      <div>
        <Card bg="Light" text="dark">
          <Card.Body>
            <div>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                ref={this.calendarComponentRef}
                weekends={this.state.calendarWeekends}
                events={this.state.calendarEvents}
                dateClick={this.handleDateClick}
                eventClick={this.handleEventClick}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView='timeGridWeek'
                height={600}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
    )
  }

  handleDateClick = (arg: any) => {
    // console.log(arg);
  };

  handleEventClick = (clickInfo: EventClickArg) => {
    console.log(clickInfo.event.title);
    console.log(clickInfo.event.extendedProps.file_name_cropped);
  }

}

export default Calendar;
