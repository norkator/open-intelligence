import React from "react";
import {Button, Modal} from "react-bootstrap";
import {Line} from "react-chartjs-2";


export const ActivityModal = (props: ActivityModalInterface) => {
  if (props.chartData === undefined) {
    return <></>
  }

  const labels: string[] = [];
  const data: number[] = [];

  props.chartData.forEach((cd: ActivityChartDataInterface) => {
    labels.push(cd.h);
    data.push(cd.a);
  });

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: props.t('activityModal.hourDataSet'),
      },
    },
  };

  const lineChartData = {
    labels: labels,
    datasets: [
      {
        label: props.t('activityModal.hourDataSet'),
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        // borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        // borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: data,
      }
    ]
  };

  return (
    <>
      <Modal size="lg" show={props.show} onHide={props.closeHandler()}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>{props.title}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-2">{props.description}</p>
          <Line options={lineChartOptions} data={lineChartData}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.closeHandler()}>
            {props.t('generic.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};

export interface ActivityChartDataInterface {
  a: number; // activity
  h: string; // hour
}

export interface ActivityModalInterface {
  t: Function;
  show: boolean;
  title: string;
  description: string;
  closeHandler: Function;
  chartData: ActivityChartDataInterface[];
}
