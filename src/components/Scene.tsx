import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, AccumulativeShadows, RandomizedLight, Center } from '@react-three/drei';
import Cube from './Cube';

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
      <color attach="background" args={['#f0f0f0']} />
      
      {/* Main lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Environment and ground */}
      <Environment preset="city" />
      <AccumulativeShadows
        temporal
        frames={100}
        alphaTest={0.85}
        opacity={0.8}
        scale={10}
        position={[0, -0.99, 0]}
      >
        <RandomizedLight
          amount={8}
          radius={5}
          intensity={0.5}
          ambient={0.5}
          position={[5, 5, -5]}
        />
      </AccumulativeShadows>

      {/* Center the cube and add orbit controls */}
      <Center>
        <Cube />
      </Center>
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
      />
    </Canvas>
  );
} 