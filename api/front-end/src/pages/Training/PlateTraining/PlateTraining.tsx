import {Button, Card} from "react-bootstrap";
import React, {Component} from "react";
import {withTranslation, WithTranslation} from "react-i18next";

class PlateTraining extends Component<WithTranslation, any> {

  render() {
    const {t} = this.props;
    return (
      <div>
        <div className="magictime vanishIn">
          <Card bg="Light" text="dark">
            <Card.Header>
              <b>{t('training.plateTraining.plateTraining')}</b>
            </Card.Header>
            <Card.Body style={{padding: '5px'}}>
              <small className="mb-4">
                {t('training.plateTraining.plateTrainingDescription')}
              </small>
              <div className="mt-2">
                <Button
                  variant="dark"
                  onClick={() => window.open("/plate-training.html", "_blank")}
                >
                  {t('training.plateTraining.openPlateTraining')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }

}

export default withTranslation('i18n')(PlateTraining);
