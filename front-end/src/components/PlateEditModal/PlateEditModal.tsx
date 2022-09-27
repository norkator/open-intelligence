import React from "react";
import {Button, Modal} from "react-bootstrap";
import {LoadingIndicator} from "../LoadingIndicator/LoadingIndicator";
import styles from "./PlatesEditModal.module.css";


export const PlateEditModal = (props: PlateEditModalPropsInterface) => {
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

          <div>
            {
              props.imageData !== undefined ?
                <img className={styles.Image} src={props.imageData} alt={props.title}/>
                :
                props.isLoading ? <LoadingIndicator isDark={true}/> :
                  <Button variant="outline-info" size="sm" className="mt-1 mb-1"
                          onClick={() => props.loadVehicleImageHandler(props.licencePlate)}>
                    {props.t('plateEditModal.loadVehicleImage')}
                  </Button>
            }
          </div>

          <form className="mt-4">
            <div className="form-group">
              <label htmlFor="new_plate_licence_plate">{props.t('plateEditModal.licencePlate')}</label>
              <input type="text" className="form-control" defaultValue={props.licencePlate}
                     onChange={(event) => props.lpOnChange(event.target.value)}
              />
              <small className="form-text text-muted">{props.t('plateEditModal.inputDescription')}</small>
            </div>
            <div className="form-group">
              <label htmlFor="new_plate_owner_name">{props.t('plateEditModal.ownerName')}</label>
              <input type="text" className="form-control" defaultValue={props.ownerName}
                     onChange={(event) => props.ownerOnChange(event.target.value)}
              />
              <small className="form-text text-muted">{props.t('plateEditModal.ownerNameInputHelp')}</small>
            </div>
          </form>

        </Modal.Body>
        <Modal.Footer>
          {
            props.showReject ? <Button variant="danger" onClick={() => props.rejectHandler(props)}>
              {props.t('generic.reject')}
            </Button> : null
          }
          <Button variant="primary" onClick={() => props.saveHandler(props)}>
            {props.t('generic.save')}
          </Button>
          <Button variant="secondary" onClick={props.closeHandler()}>
            {props.t('generic.close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export interface PlateEditModalPropsInterface {
  t: Function;
  isLoading: boolean;
  show: boolean;
  title: string;
  description: string;
  saveHandler: Function;
  closeHandler: Function;
  id: string;
  licencePlate: string;
  ownerName: string;
  lpOnChange: Function;
  ownerOnChange: Function;
  imageData?: string;
  showReject: boolean;
  rejectHandler: Function;
  loadVehicleImageHandler: Function;
}
