import React from "react";
import {Button, Modal} from "react-bootstrap";


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

          {
            props.imageData !== undefined ? <img src={props.imageData} alt={props.title}/> : null
          }

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
}
