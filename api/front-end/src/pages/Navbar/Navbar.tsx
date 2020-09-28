import React, {Component} from "react";
import {Nav, Navbar, NavDropdown} from 'react-bootstrap'
import styles from './Navbar.module.css'
import {Link} from "react-router-dom";
import {withTranslation} from "react-i18next";
import {saveLanguageSelection} from "../../i18nConfig";
// eslint-disable-next-line
import {i18n} from "i18next"; // Todo, why esLint whines even when it's in use?

class NavBar extends Component<any, any> {
  state = {
    activeLink: '/'
  };

  setActiveLinkHandler = (link: string) => {
    this.setState({activeLink: link});
  };

  componentDidMount(): void {
    this.setCurrentPath();
  }

  setCurrentPath = () => {
    try {
      // Todo: find other way, this is horrible
      const split = window.location.href.split('/');
      const activeLink = '/' + split[split.length - 1];
      console.log(activeLink);
      this.setState({activeLink: activeLink});
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const {i18n} = this.props;
    const {t} = this.props;
    const navBarImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACHklEQVR4Ae3WAWTjUBjA8UNRFMVQFMUwHIahCI7hMBTFUBTDYQiG4RAUBRSHAIaiKIrhAFAURVAURREERVAMRe+PfTzP+faSJsy2Pz9M0rcvSdPk26foq+PxeIkBZlhi+2qOKR5xXvYQVfiI4doa/TKG6WCDvEXwihpmALsdntBFG61XHnqYYA+zA+5OGaSCKcwS3KPieIkDpDAb5h1oCLNn1HOs08QCZndZF7mF2QiVE2+IqXX5vCwfTiDNCrxLF5Ai1w8GkLaoFXi3NpFC6r99FMoH+PsBEUK0lHW+Y4IF+soBr98a6BrSxtrWhlmorPMX0gFN66D3kM61gUJIQ2ubD7OVsk4Ks661fQLpURtoCcmztjVwgPSgrPMH0g5Va3sP0lQbKIYkp9keykfb4Qv8E79Q/882D9JcW4SISn5QtyBt38NATUixtmMCqVHiQG1IC23HCNJViQN1Ic20HZ8gBcoPWtZ6+v/RX8SkyNpWR4ysLezXGuwgXWoD1fAC6ca+XbGHawkurDXuIcUu13cEaYWK/YLveKbWaNlnGQkk32WgOlJIofLCn8Auxm9U7UuFZ0gb/R1Lf275yr5n8PADFw5nXupkvTXHMAv1I1K/lzOYBXnf8OYwW+Emwxp9bGE2OfW1cwy7CAGu0LAeCR6G2MBuUNQvq48UeUtwW/TP/RlGeIFrKQJUy3xS19DBGBF2kGIsEeJaBvnqQ/cPDxGlXpRi3oIAAAAASUVORK5CYII=";
    const navBarLinksClasses = ['nav-link', styles.Link];

    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand className={styles.NavbarBrand}>
            <img
              alt="Open-Intelligence Logo"
              src={navBarImg}
              width="36"
              height="36"
              className="d-inline-block align-top"
            />{' '}
            <span className={styles.NavbarBrand}>Open-Intelligence</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent"/>
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="mr-auto">
              {
                this.state.activeLink !== '/' ?
                  <Link className={navBarLinksClasses.join(' ')} to="/"
                        onClick={() => this.setActiveLinkHandler('/')}>{t('navbar.home')}</Link>
                  : <span className="mt-2">{t('navbar.home')}</span>
              }
              {
                this.state.activeLink !== '/cameras' ?
                  <Link className={navBarLinksClasses.join(' ')} to="/cameras"
                        onClick={() => this.setActiveLinkHandler('/cameras')}>{t('navbar.cameras')}</Link>
                  : <span className="mt-2">{t('navbar.cameras')}</span>
              }
              {
                this.state.activeLink !== '/plates' ?
                  <Link className={navBarLinksClasses.join(' ')} to="/plates"
                        onClick={() => this.setActiveLinkHandler('/plates')}>{t('navbar.plates')}</Link>
                  : <span className="mt-2">{t('navbar.plates')}</span>
              }
              {
                this.state.activeLink !== '/faces' ?
                  <Link className={navBarLinksClasses.join(' ')} to="/faces"
                        onClick={() => this.setActiveLinkHandler('/faces')}>{t('navbar.faces')}</Link>
                  : <span className="mt-2">{t('navbar.faces')}</span>
              }
              {
                this.state.activeLink !== '/training' ?
                  <Link className={navBarLinksClasses.join(' ')} to="/training"
                        onClick={() => this.setActiveLinkHandler('/training')}>{t('navbar.training')}</Link>
                  : <span className="mt-2">{t('navbar.training')}</span>
              }
            </Nav>
            <Nav>
              <NavDropdown title={t('navbar.changeLanguage')} id="lang-dropdown">
                <NavDropdown.Item onClick={() => this.setLanguageHandler(i18n, 'en')}>English</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.setLanguageHandler(i18n, 'fi')}>Finnish</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.setLanguageHandler(i18n, 'cn')}>Chinese</NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.setLanguageHandler(i18n, 'hi')}>Hindi</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    )
  }

  setLanguageHandler = (i18n: i18n, language: string) => {
    saveLanguageSelection(language);
    i18n.changeLanguage(language).then(() => null);
  }

}


export default withTranslation('i18n')(NavBar);
