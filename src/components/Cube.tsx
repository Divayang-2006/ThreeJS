import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export default function Cube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh 
      ref={meshRef}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#4ade80"
        metalness={0.5}
        roughness={0.2}
        envMapIntensity={1}
      />
    </mesh>
  );
} 