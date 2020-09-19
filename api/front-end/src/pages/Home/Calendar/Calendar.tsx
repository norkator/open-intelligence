import React, {Component} from "react";
import {
  CalendarEventsInterface,
  getCalendarEvents,
  getObjectDetectionImage,
  getObjectDetectionImageFileNameForCroppedImageName,
  ObjectDetectionImageFileNameInterface,
  ObjectDetectionImageInterface
} from "../../../utils/HttpUtils";
import FullCalendar, {EventClickArg} from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {Card} from "react-bootstrap";
import {GenericImageModal, ModalPropsInterface} from "../../../components/GenericImageModal/GenericImageModal";

class Calendar extends Component {
  state = {
    calendarWeekends: true,
    calendarEvents: [] as CalendarEventsInterface[],
    genericImageModalData: {show: false} as ModalPropsInterface,
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
          <Card.Header>
            <b>Vehicle activity</b>
          </Card.Header>
          <Card.Body>
            <div>
              <p>!!! Add here input field to adjust loadable days !!!</p>
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

        <GenericImageModal
          closeHandler={() => this.genericImageModalCloseHandler}
          show={this.state.genericImageModalData.show}
          description={this.state.genericImageModalData.description}
          src={this.state.genericImageModalData.src}
          title={this.state.genericImageModalData.title}
          showBadges={this.state.genericImageModalData.showBadges}
          srImage={this.state.genericImageModalData.srImage}
          detectionResult={this.state.genericImageModalData.detectionResult}
          color={this.state.genericImageModalData.color}
          additionalInfo={this.state.genericImageModalData.additionalInfo}
        />

      </div>
    )
  }

  handleDateClick = (arg: any) => {
    // console.log(arg);
  };

  handleEventClick = (clickInfo: EventClickArg) => {
    const title = clickInfo.event.title;
    const file = clickInfo.event.extendedProps.file_name_cropped;
    const description = clickInfo.event.extendedProps.description;
    this.loadObjectDetectionImageHandler(file, title, description).then(() => null);
  };

  async loadObjectDetectionImageHandler(croppedImageName: string, detectionResult: string, description: string) {
    this.setState({isLoading: true});
    const file = await getObjectDetectionImageFileNameForCroppedImageName(croppedImageName) as ObjectDetectionImageFileNameInterface;
    const image = await getObjectDetectionImage(file.file_name) as ObjectDetectionImageInterface;
    this.setState({
      isLoading: false,
      genericImageModalData: {
        show: true,
        title: image.file_name,
        description: 'Original image file where selected calendar event license plate is seen',
        src: image.data,
        showBadges: true,
        detectionResult: detectionResult,
        additionalInfo: description,
      }
    });
  };

  genericImageModalCloseHandler = () => {
    this.setState({genericImageModalData: {show: false}});
  };

}

export default Calendar;
