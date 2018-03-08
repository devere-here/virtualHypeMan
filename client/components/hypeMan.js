import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import * as Three from 'three';

class HypeMan extends React.Component{
  constructor(props){
    super(props);

    console.log('this.props', this.props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);



  }


  componentDidMount(){

    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera( 25,
      width / height,
      0.1,
      1000);

    const renderer = new Three.WebGLRenderer({ antialias: true });
    const geometry = new Three.SphereGeometry(2, 25, 25);
    const material = new Three.MeshBasicMaterial({ color: 0xbfff00 });

    const eyeMaterial = new Three.LineBasicMaterial( { color: 0x000000} );
    let eyeLeftGeometry = new Three.Geometry();
    eyeLeftGeometry.vertices.push(new Three.Vector3( -0.5, 1.1, 3));
    eyeLeftGeometry.vertices.push(new Three.Vector3( -0.5, 0.8, 3));
    eyeLeftGeometry.vertices.push(new Three.Vector3( -0.5, 0.4, 3));

    let leftEyeLine = new Three.Line(eyeLeftGeometry, eyeMaterial);


    let eyeRightGeometry = new Three.Geometry();
    eyeRightGeometry.vertices.push(new Three.Vector3( 0.5, 1.1, 3));
    eyeRightGeometry.vertices.push(new Three.Vector3( 0.5, 0.8, 3));
    eyeRightGeometry.vertices.push(new Three.Vector3( 0.5, 0.4, 3));

    let rightEyeLine = new Three.Line(eyeRightGeometry, eyeMaterial);



    const sphere = new Three.Mesh(geometry, material);

    let lineMaterial = new Three.LineBasicMaterial( { color: 0x0000ff } );

    //const line = new Three.Line(geometry, lineMaterial);
    let lineXGeometry = new Three.Geometry();
    lineXGeometry.vertices.push(new Three.Vector3( -100, 0, 0));
    lineXGeometry.vertices.push(new Three.Vector3( 0, 0, 0));
    lineXGeometry.vertices.push(new Three.Vector3( 100, 0, 0));

    let lineYGeometry = new Three.Geometry();
    lineYGeometry.vertices.push(new Three.Vector3( 0, -100, 0));
    lineYGeometry.vertices.push(new Three.Vector3( 0, 0, 0));
    lineYGeometry.vertices.push(new Three.Vector3( 0, 100, 0));


    let lineZGeometry = new Three.Geometry();
    lineZGeometry.vertices.push(new Three.Vector3( 0, 0, -100));
    lineZGeometry.vertices.push(new Three.Vector3( 0, 0, 0));
    lineZGeometry.vertices.push(new Three.Vector3( 0, 0, 100));


    let lineX = new Three.Line( lineXGeometry, lineMaterial );
    let lineY = new Three.Line( lineYGeometry, lineMaterial );
    let lineZ = new Three.Line( lineZGeometry, lineMaterial );

    lineX.linewidth = 100;
    lineY.linewidth = 100;
    lineZ.linewidth = 100;


    //scene.add(sphere);
    scene.add(lineX);
    scene.add(lineY);
    scene.add(lineZ);
    scene.add(leftEyeLine);
    scene.add(rightEyeLine);




    let geom = new Three.Geometry();
    let v1 = new Three.Vector3(-0.5, 0, 3);
    let v2 = new Three.Vector3(0, -0.5, 3);
    let v3 = new Three.Vector3(0.5, 0, 3);

    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);

    console.log('geom is ', geom);

    geom.faces.push( new Three.Face3( 0, 1, 2 ) );
    geom.computeFaceNormals();
    geometry.computeVertexNormals();

    let mouthMaterial = new Three.MeshStandardMaterial( { color: 0x0000ff } );

    let mouth = new Three.Mesh( geometry, mouthMaterial )

    scene.add(mouth);

    console.log('sphere.position', sphere.position);


    camera.position.z = 15;

    /* LIGHT */

	//Create a white 'directional light'
	let light = new Three.DirectionalLight(0xffffff, 1);

	//We the position of our light
	light.position.set( 50, 250, 500 );

	//We add our light into the scene
	scene.add(light);



    renderer.setClearColor('#57ab34');
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = material;
    this.sphere = sphere;

    this.mount.appendChild(this.renderer.domElement);
    this.start();

  }

  componentWillUnMount(){
    console.log('in componentWillUnMount');
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {

    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    console.log('about to stop');
    cancelAnimationFrame(this.frameId)
  }


  animate() {

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render(){
    return (
      <div
        style={{width: '400px', height: '400px'}}
        ref={mount => {this.mount = mount}}
      />
    )
  }
}


/**
 * CONTAINER
 */
// const mapState = state => {
//   return {
//     isLoggedIn: !!state.user.id
//   }
// }

// const mapDispatch = dispatch => {
//   return {
//     handleClick() {
//       dispatch(logout())
//     }
//   }
// }

export default connect(null, null)(HypeMan)

/**
 * PROP TYPES
 */
// HypeMan.propTypes = {
//   handleClick: PropTypes.func.isRequired,
//   isLoggedIn: PropTypes.bool.isRequired
// }
