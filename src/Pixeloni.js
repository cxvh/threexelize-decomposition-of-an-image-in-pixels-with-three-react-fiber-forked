import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import usePixels, { WIDTH, HEIGHT } from "./usePixels";

const _object = new THREE.Object3D();

function Pixeloni(props) {
  const {
    colors,
    alpha,
    columns,
    rows,
    width = 1,
    height = 1,
    depth = 1,
    radius0 = 1 / 4,
    smoothness = 1
  } = props;

  const ref = useRef();
  const attrib = useRef();
  const animation = useRef(new Array(colors.length).fill(0));

  const [hovered, set] = useState();
  const previous = useRef();
  useEffect(() => void (previous.current = hovered), [hovered]);

  const eps = 0.00001;
  const radius = radius0 - eps;

  const shape = useMemo(() => {
    const shape = new THREE.Shape();

    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
    shape.absarc(
      width - radius * 2,
      height - radius * 2,
      eps,
      Math.PI / 2,
      0,
      true
    );
    shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
    return shape;
  }, [width, height, radius]);

  const geometryProps = useMemo(() => {
    return {
      depth: depth - radius0 * 2,
      bevelEnabled: true,
      bevelSegments: smoothness * 2,
      steps: 1,
      bevelSize: radius,
      bevelThickness: radius0,
      curveSegments: smoothness
    };
  }, [depth, radius, radius0, smoothness]);

  useFrame(() => {
    if (ref.current && attrib.current) {
      let i = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const id = i++;

          attrib.current.needsUpdate = true;

          if (animation.current[id] > 0) {
            animation.current[id] -= (2 * Math.PI) / 50;
          }
          if (id === hovered && animation.current[id] <= 0) {
            animation.current[id] = 2 * Math.PI;
          }
          _object.rotation.set(
            animation.current[id],
            animation.current[id],
            animation.current[id]
          );
          const z = -0.9 * WIDTH + 30 * Math.sin(animation.current[id] / 2);
          _object.position.set(-(WIDTH / 2) + x, HEIGHT / 2 - y, z);

          _object.updateMatrix();

          if (alpha[id] > 0.9) {
            ref.current.setMatrixAt(id, _object.matrix);
          }
        }
      }
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      castShadow
      ref={ref}
      args={[null, null, colors.length / 3]}
      onPointerMove={e => set(e.instanceId)}
      onPointerOut={e => set(undefined)}
    >
      <extrudeBufferGeometry
        attach="geometry"
        args={[shape, geometryProps]}
        onUpdate={self => self.center()}
      >
        <instancedBufferAttribute
          ref={attrib}
          attachObject={["attributes", "color"]}
          args={[colors, 3]}
        />
      </extrudeBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  );
}

function _Pixeloni() {
  const [loading, imageProps] = usePixels("/puzzle-bubble.png");

  return !loading && <Pixeloni {...imageProps} />;
}

export default _Pixeloni;
