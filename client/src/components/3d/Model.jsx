// client/src/components/3d/Model.jsx
import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThreeD } from '../../hooks/useThreeD'; 

// GİYİLEBİLİR TÜM KIYAFET mesh'lerinin listesi
const ALL_CLOTHING_MESHES = [
  'CalculusTest01_0', // Pantolon mesh adı
  'mesh_0'            // Tişört/Ceket mesh adı
];

export function Model(props) { 
  const { nodes, materials } = useGLTF('/models/young_model.glb');
  const { wornItems } = useThreeD(); // Context'ten o an giyilen kıyafetleri al

  // Ana sahne objesini bul
  const modelScene = nodes.Sketchfab_Scene || nodes.Scene || nodes.scene || nodes.RootNode;

  // GİZLEME/GÖSTERME MANTIĞI
  useEffect(() => {
    if (!modelScene) return;

    // 1. O an giyilen kıyafetlerin mesh adlarının listesi
    // (İlk yüklemede ['mesh_0', 'CalculusTest01_0'] içerecek)
    const wornMeshNames = Object.values(wornItems)
      .filter(item => item !== null)
      .map(item => item.meshName);

    // 2. Modeldeki tüm parçaları dolaş
    modelScene.traverse((child) => {
      if (child.isMesh) {
        
        // Bu parça giyilebilir bir kıyafet mi?
        if (ALL_CLOTHING_MESHES.includes(child.name)) {
          
          // Bu kıyafet, "giyilenler" listesinde var mı?
          if (wornMeshNames.includes(child.name)) {
            child.visible = true; // Varsa GÖSTER
          } else {
            child.visible = false; // Yoksa GİZLE
          }
          
        } else {
          // Bu bir kıyafet değil (Vücut, Saç, Gözler vb.)
          child.visible = true; 
        }
      }
    });

  }, [wornItems, modelScene, nodes]); 

  if (!modelScene) {
    if (Object.keys(nodes).length > 0) {
      console.error("Model.jsx: Ana sahne objesi ('Sketchfab_Scene' gibi) bulunamadı.");
    }
    return null;
  }

  // Modeli ekrana bas
  return <primitive object={modelScene} {...props} />;
}

useGLTF.preload('/models/young_model.glb');