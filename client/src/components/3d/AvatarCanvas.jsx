// client/src/components/3d/AvatarCanvas.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Model } from './Model'; 

// Yükleniyor mesajı
const Loader = () => (
  <div style={{ 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)',
    color: '#0d6efd',
    fontWeight: 'bold'
  }}>
    3D Model Yükleniyor...
  </div>
);


export default function AvatarCanvas({ activeMeshName }) {
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      
      <Suspense fallback={<Loader />}>

        <Canvas 
          shadows 
          // ÇALIŞAN SON AYARLAR (Kamera)
          camera={{ position: [0, 1.5, 10], fov: 25 }} 
          style={{ background: '#85afadff' }}
        >
          {/* Işıklandırma ve Çevre */}
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={1} 
            castShadow 
          />
          <Environment preset="studio" />
          
          {/* Model Ayarları */}
          <Model 
            position={[0, -1, 0]} 
            scale={[0.015, 0.015, 0.015]} // Sizin çalışan ölçeğiniz
            activeMeshName={activeMeshName}
          />

          {/* Kontroller (Dikey Kısıtlama Düzeltildi) */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minDistance={2}   // <-- Modelin detaylarını görmek için yakınlaşma
            maxDistance={10}
            // 🚨 HATA DÜZELTİLDİ: Sadece Üst-Yarı kürede dönmeye izin ver (Tam dik bakmayı engeller)
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2} // <-- Sizin çalışan limitiniz
          />

        </Canvas>
        
      </Suspense>
    </div>
  );
}