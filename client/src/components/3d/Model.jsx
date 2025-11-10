// Model.jsx - POZİSYON ve SCALE DÜZELTMESİ:
import React, { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThreeD } from '../../hooks/useThreeD'; 

export function Model(props) { 
  const { nodes, materials } = useGLTF('/models/young_model.glb');
  const { wornItems } = useThreeD();
  const [modelReady, setModelReady] = useState(false);

  console.log('🎯 MODEL COMPONENT - Pozisyon ayarlanıyor');

  // ✅ BASİT ve GÜVENLİ MESH KONTROLÜ
  useEffect(() => {
    console.log('🔍 Model traversing başlıyor...');
    
    let sceneFound = false;
    
    const possibleScenes = [
      nodes.Sketchfab_Scene, 
      nodes.Scene, 
      nodes.scene, 
      nodes.RootNode,
      nodes.default || nodes
    ];

    for (const scene of possibleScenes) {
      if (scene) {
        console.log('✅ Sahne bulundu:', scene);
        sceneFound = true;
        
        // ✅ MODELİ MERKEZE GETİR ve DOĞRU SCALE YAP
        scene.position.set(0, 0, 0);
        scene.scale.set(1, 1, 1); // Önce reset
        
        scene.traverse((child) => {
          if (child.isMesh) {
            console.log('🔍 Mesh:', child.name);
            child.visible = true; // Tümünü göster
          }
        });
        break;
      }
    }

    if (!sceneFound) {
      console.log('❌ Hiçbir sahne bulunamadı');
    }

    setModelReady(true);
  }, [nodes]);

  // ✅ FALLBACK - GÖRÜNÜR BASİT MODEL
  if (!modelReady) {
    console.log('⏳ Model hazırlanıyor, fallback gösteriliyor');
    return (
      <group>
        {/* ✅ MERKEZDE ve GÖRÜNÜR BASİT MODEL */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 1, 8]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </group>
    );
  }

  const modelScene = nodes.Sketchfab_Scene || nodes.Scene || nodes.scene || nodes.RootNode || nodes.default || nodes;

  if (!modelScene) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="purple" />
        </mesh>
      </group>
    );
  }

  console.log('✅ Model render ediliyor - MERKEZDE');
  return (
    <primitive 
      object={modelScene} 
      position={[0, 0, 0]}  // ✅ MERKEZ
      scale={[1, 1, 1]}     // ✅ NORMAL BOYUT
      {...props}
    />
  );
}

useGLTF.preload('/models/young_model.glb');