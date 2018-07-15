import * as THREE from './lib/three.js';
import * as animate from '/parent/core/animate.js'
import { contentOrigin } from '/app/src/env.js'

let camera, scene, renderer;
let isUserInteracting = false;
let lon = -152
let lat = 4.4;
let onPointerDownPointerX;
let onPointerDownPointerY;
let onPointerDownLon;
let onPointerDownLat;

class Pan extends HTMLElement {

  constructor() {
    super()
    // this.bind({resize: 'resize'});
    // this.bind({wheel: 'wheel'}, this.el);
    // this.bind({mousedown: 'mousedown'}, this.el);
  }


  connectedCallback() {
    console.log('hi', this.children)
    this.attachShadow({ mode: 'open' })
    const div = document.createElement('div')
    div.style.position = 'absolute'
    this.shadowRoot.appendChild(div)
    div.appendChild(document.createElement('slot'))

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.display = 'block'
    this.shadowRoot.appendChild(renderer.domElement)

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
    camera.target = new THREE.Vector3( 0, 0, 0 );

    const img = Array.from(this.children).find(el => el.tagName === 'IMG')
    const srcset = JSON.parse(img.dataset.srcset)
    const url = contentOrigin + srcset.reverse()[0].url

    const texture = new THREE.TextureLoader().load(url, texture => {
      this.update()
    });

    const material = new THREE.MeshBasicMaterial({map: texture});
    material.side = THREE.DoubleSide;

    const geometry = new THREE.SphereGeometry(3, 60, 40, 0, 2.5, 4, 1.2);
    geometry.scale(-1, -1, 1);

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    this.animate()
  }


  disconnectedCallback() {

  }


  animate() {
    let duration = 10000

    let easeLat = animate.cubicOut(lat, -0.3)
    let easeFov = animate.cubicOut(camera.fov, 40)
    let easeLon = animate.cubicOut(lon, -64)

    let tick = time => {
      lat = easeLat(time)
      lon = easeLon(time)
      camera.fov = easeFov(time)
      camera.updateProjectionMatrix()
      this.update()
    };

    this.tween = animate.timer({ duration, tick });
  }


  resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.update();
  }


  mousedown(e) {
    this.tween.cancel();
    this.bind({
      mousemove: 'mousemove',
      mouseup: 'mouseup',
    }, window);

    isUserInteracting = true;
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
  }


  mousemove(e) {
    if ( isUserInteracting === true ) {
      lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
      lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
      this.update();
    }
  }


  mouseup(e) {
    this.unbind(['mousemove','mouseup'], window);
    this.animate();
    isUserInteracting = false;
  }


  // wheel(e) {
  //   camera.fov += event.deltaY * 0.05;
  //   console.log(camera.fov);
  //   camera.updateProjectionMatrix();
  //   this.update();
  //   e.preventDefault();
  // }


  update() {
    lat = Math.max(-85, Math.min(85, lat));

    // console.log(camera.fov, lat, lon);

    let phi = THREE.Math.degToRad(90 - lat);
    let theta = THREE.Math.degToRad(lon);

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt(camera.target);

    renderer.render(scene, camera);
  }

}


window.customElements.define('fx-pan', Pan)


