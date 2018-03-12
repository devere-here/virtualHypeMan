import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout, setDinosaur} from '../store'

var GifPlayer = require('react-gif-player');

class Choose extends Component{
  constructor(){
    super();
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick(dinosaur){
    console.log('in handleClick');
    this.props.pickDinosaur(dinosaur)
  }

  render(){
    return (
      <div id="choose">
        <div id="choosePanel">
          <h1>Pick a dinosaur</h1>
          <div id="choosePanelFlexContainer">
            <Link to="/audio">
              <div className="choosePanelDinoContainer" onClick={() => this.handleClick('stegosaurus')}>
                <h2>Stegosaurus</h2>

                  <GifPlayer gif={'https://drive.google.com/uc?export=download&id=1jwO0PLd1G4jNBQcbtsW3zDHsc1_K9Kf-'}  autoplay />

              </div>
            </Link>
            <Link to="/audio">
            <div className="choosePanelDinoContainer" onClick={() => this.handleClick('tyrannosaurus')}>
              <h2>Tyrannosaurus</h2>

                <GifPlayer gif={'https://drive.google.com/uc?export=download&id=10oYkrHB_q2plQJxzELy8EyKsheHEgEip'}  autoplay />

            </div>
            </Link>
            <Link to="/audio">
              <div className="choosePanelDinoContainer" onClick={() => this.handleClick('brontosaurus')}>
                <h2>Brontosaurus</h2>
                <GifPlayer gif={'https://drive.google.com/uc?export=download&id=1G2eR26NW6DJGbUkAsSRsvafatiqzpKR1'}  autoplay />
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}


/**
 * CONTAINER
 */
const mapState = state => {
  return {
    dinosaur: state.dinosaur
  }
}

const mapDispatch = dispatch => {
  return {
    pickDinosaur(dinosaur){
      dispatch(setDinosaur(dinosaur));
    }

  }
}

export default connect(mapState, mapDispatch)(Choose)




//still={'https://drive.google.com/uc?export=download&id=1zinfIIFvIwHsd6WiuG0kWBc0o_yelvyH'}
//still={'https://drive.google.com/uc?export=download&id=155VwgHXUupoZ24wwVfzqZs8TBz3b26oo'}
//still={'https://drive.google.com/uc?export=download&id=1ksCp0s2T_NwAwR_28SbOoG1HT124JZVH'}
