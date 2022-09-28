import React, {Component} from "react";
import {WithTranslation, withTranslation} from "react-i18next";
import {Card} from "react-bootstrap";


class Cleaning extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {
    isLoading: true,
  };

  constructor(props: any) {
    super(props);
    this._isMounted = false;
  }

  componentDidMount(): void {
    this._isMounted = true;
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  render() {
    const {t} = this.props;
    return (
      <div className="mt-2 mr-2 ml-2">
        <Card bg="dark" text="light">
          <Card.Header>
            {t('cleaning.title')}
          </Card.Header>
          <Card.Body style={{padding: '10px'}}>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

// @ts-ignore
export default withTranslation('i18n')(Cleaning);
