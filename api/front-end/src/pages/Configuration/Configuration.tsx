import React, {Component} from "react";
import {WithTranslation, withTranslation} from "react-i18next";

class Configuration extends Component<WithTranslation> {
  private _isMounted: boolean;

  state = {};

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
      <div>
        Hello
      </div>
    )
  }
}

// @ts-ignore
export default withTranslation('i18n')(Configuration);
