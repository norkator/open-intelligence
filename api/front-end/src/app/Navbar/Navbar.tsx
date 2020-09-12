import React, {Component} from "react";
import Navbar from 'react-bootstrap/Navbar'
import styles from './Navbar.module.css'

class NavBar extends Component<any, any> {
  render() {

    const navBarImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACHklEQVR4Ae3WAWTjUBjA8UNRFMVQFMUwHIahCI7hMBTFUBTDYQiG4RAUBRSHAIaiKIrhAFAURVAURREERVAMRe+PfTzP+faSJsy2Pz9M0rcvSdPk26foq+PxeIkBZlhi+2qOKR5xXvYQVfiI4doa/TKG6WCDvEXwihpmALsdntBFG61XHnqYYA+zA+5OGaSCKcwS3KPieIkDpDAb5h1oCLNn1HOs08QCZndZF7mF2QiVE2+IqXX5vCwfTiDNCrxLF5Ai1w8GkLaoFXi3NpFC6r99FMoH+PsBEUK0lHW+Y4IF+soBr98a6BrSxtrWhlmorPMX0gFN66D3kM61gUJIQ2ubD7OVsk4Ks661fQLpURtoCcmztjVwgPSgrPMH0g5Va3sP0lQbKIYkp9keykfb4Qv8E79Q/882D9JcW4SISn5QtyBt38NATUixtmMCqVHiQG1IC23HCNJViQN1Ic20HZ8gBcoPWtZ6+v/RX8SkyNpWR4ysLezXGuwgXWoD1fAC6ca+XbGHawkurDXuIcUu13cEaYWK/YLveKbWaNlnGQkk32WgOlJIofLCn8Auxm9U7UuFZ0gb/R1Lf275yr5n8PADFw5nXupkvTXHMAv1I1K/lzOYBXnf8OYwW+Emwxp9bGE2OfW1cwy7CAGu0LAeCR6G2MBuUNQvq48UeUtwW/TP/RlGeIFrKQJUy3xS19DBGBF2kGIsEeJaBvnqQ/cPDxGlXpRi3oIAAAAASUVORK5CYII=";

    return (
      <>
        <Navbar bg="dark" variant="dark" className={styles.NavbarBrand}>
          <Navbar.Brand href="#home">
            <img
              alt="Open-Intelligence Logo"
              src={navBarImg}
              width="36"
              height="36"
              className="d-inline-block align-top"
            />{' '}
            Open-Intelligence
          </Navbar.Brand>
        </Navbar>
      </>
    )
  }
}


export default NavBar;
