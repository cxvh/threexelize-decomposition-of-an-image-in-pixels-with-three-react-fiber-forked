import React from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";
import colors from "nice-color-palettes/1000";

import Pixeloni from "./Pixeloni";
import { WIDTH } from "./usePixels";

import "./styles.css";
import Effect from "./Post";

const bgColor = colors[1][0];

export default function App() {
  return (
    <Canvas
      shadowMap
      concurrent
      colorManagement
      camera={{ position: [0, 0, 0], near: 1, far: 1000 }}
      gl={{ alpha: false, antialias: false }}
    >
      <ambientLight intensity={0.2} />
      <pointLight
        intensity={0.3}
        angle={Math.PI / 4}
        position={[50, -40, 40]}
        penumbra={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        castShadow
      />
      <Effect />
      <Pixeloni />
      <mesh receiveShadow position={[0, 0, -WIDTH]}>
        <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
        <meshPhongMaterial attach="material" color={new THREE.Color(bgColor)} />
      </mesh>
    </Canvas>
  );
}
