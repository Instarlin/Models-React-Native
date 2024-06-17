import React, { useState, useRef, Suspense, useLayoutEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'expo-three';
import { SensorType, useAnimatedSensor } from 'react-native-reanimated';

function Box(props) {
  const [active, setActive] = useState(false)

  const mesh = useRef();

  useFrame((state, delta) => {
    if (active) mesh.current.rotation.y += delta;
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(Event) => {setActive(!active)}}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={active?'#10a37f':'grey'} />
    </mesh>
  );
}

function Steve(props) {
  const base = useLoader(TextureLoader,require('./assets/Steve/steve.png'))

  const material = useLoader(MTLLoader,require('./assets/Steve/Steve.mtl'));

  const obj = useLoader(OBJLoader,require('./assets/Steve/Steve.obj'), (loader) => {
    material.preload();
    loader.setMaterials(material);
  });

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = base;
      }
    })
  }, [obj])
  
  const [active, setActive] = useState(false)

  const mesh = useRef();

  useFrame((state, delta) => {
    console.log(props.animatedSensor.sensor.value);
    // if (active) mesh.current.rotation.y += delta;
    let { x, y, z } = props.animatedSensor.sensor.value;
    x = -(~~(x * 100) / 5000);
    y = -(~~(y * 100) / 5000);
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
  });


  return <mesh
  {...props}
  rotation={[0, 1, 0]}
  ref={mesh}
  scale={active ? 2 : 1}
  onClick={(Event) => {setActive(!active)}}>
    <primitive object={obj} scale={0.15} />
  </mesh>;
}

function Anime1(props) {
  const [base1,base2,base3,base4,base5,base6,base7,base8,base9] = useLoader(TextureLoader, [
    require('./assets/anime/tex_white2.jpg'),
    require('./assets/anime/hudiejie.jpg'), 
    require('./assets/anime/tex_white.jpg'),
    require('./assets/anime/qunzi.jpg'),
    require('./assets/anime/lian.jpg'),
    require('./assets/anime/shenti.jpg'),
    require('./assets/anime/tex_yuka.jpg'),
    require('./assets/anime/siwang.jpg'),
    require('./assets/anime/toufa.jpg'),
  ]);

  const material = useLoader(MTLLoader,require('./assets/anime/peri.mtl'));
  const obj = useLoader(OBJLoader,require('./assets/anime/peri.obj'), (loader) => {
    material.preload();
    loader.setMaterials(material);
  });

  const textures = [base1,base2,base3,base4,base5,base6,base7,base8,base9];
  let index = 0;

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = textures[index % textures.length];
        index++;
      }
    })
  }, [obj, index, textures]);

  const [active, setActive] = useState(false);

  const mesh = useRef();

  useFrame((state, delta) => {
    console.log(props.animatedSensor.sensor.value);
    // if (active) mesh.current.rotation.y += delta;
    let { x, y, z } = props.animatedSensor.sensor.value;
    x = -(~~(x * 100) / 5000);
    y = -(~~(y * 100) / 5000);
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
  });

  return (
    <mesh {...props} ref={mesh} onClick={(Event) => {setActive(!active)}} rotation={[0, 0, 0]}>
      <primitive object={obj} scale={0.021} />
    </mesh>
  )
}

// function Anime2(props) {
//   const [base1,base2,base3,base4,base5,base6,base7,base8,base9,base10,base11,base12,base13,base14] = useLoader(TextureLoader, [
//     require('../ModelJS/assets/animePink/eyes.bmp'),
//     require('../assets/animePink/skin.bmp'),
//     require('../assets/animePink/hair.bmp'),
//     require('../assets/animePink/ribbon.bmp'),
//     require('../assets/animePink/skin.bmp'),
//     require('../assets/animePink/sox.bmp'),
//     require('../assets/animePink/pants.bmp'),
//     require('./assets/animePink/obi.bmp'),
//     require('./assets/animePink/fuku.bmp'),
//     require('./assets/animePink/race.bmp'),
//     require('./assets/animePink/nail.bmp'),
//     require('./assets/animePink/black.bmp'),
//     require('./assets/animePink/black.bmp'),
//     require('./assets/animePink/nail.bmp'),
//   ])

//   const material = useLoader(MTLLoader,require('./anime2/D0207034A.mtl'));

//   const obj = useLoader(OBJLoader,require('./anime2/D0207034A.obj'), (loader) => {
//     material.preload();
//     loader.setMaterials(material);
//   });

//   const textures = [base1,base2,base3,base4,base5,base6,base7,base8,base9,base10,base11,base12,base13,base14];
//   let index = 0;

//   useLayoutEffect(() => {
//     obj.traverse((child) => {
//       if (child instanceof THREE.Mesh) {
//         child.material.map = textures[index % textures.length];
//         index++;
//       }
//     })
//   }, [obj, index, textures])
  
//   const [active, setActive] = useState(false)

//   const mesh = useRef();

//   useFrame((state, delta) => {
//     if (active) mesh.current.rotation.y += delta;
//   })

//   return <mesh
//   {...props}
//   ref={mesh}
//   onClick={(Event) => {setActive(!active)}}
//   rotation={[0, 1, 0]}>
//     <primitive object={obj} scale={0.021} />
//   </mesh>;
// }

export default function App() {
  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {interval: 100,});

  return (
  <Canvas>
    <mesh>
      <ambientLight />
      <pointLight position={[10, 10, 7]} intensity={2}/>
      <Suspense fallback={null}>
        {/* <Anime1 animatedSensor={animatedSensor} position={[0, -1.7, -0.4]}/> */}
        <Box/>
      </Suspense>
    </mesh> 
  </Canvas>
  )
}
