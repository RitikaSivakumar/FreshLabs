import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SplashAnimationProps {
  onComplete: () => void;
}

const SplashAnimation: React.FC<SplashAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: THREE.WebGLRenderer;
    
    try {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 2.5;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
      const globeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x1e3a8a) },
          color2: { value: new THREE.Color(0x60a5fa) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          void main() {
            float dots = sin(vUv.x * 200.0) * sin(vUv.y * 100.0);
            dots = step(0.6, dots);
            float intensity = pow(1.0 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            vec3 finalColor = mix(color1 * 0.2, color2, dots * 0.5) + (color2 * intensity);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
      });

      const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
      scene.add(globe);

      const animate = () => {
        globe.rotation.y += 0.002;
        globeMaterial.uniforms.time.value += 0.01;
        if (camera.userData.isZooming) {
          camera.position.z -= 0.05;
          if (camera.position.z < 0.2) setIsExiting(true);
        }
        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      };

      animate();

      const zoomStart = setTimeout(() => {
        camera.userData.isZooming = true;
        setIsZooming(true);
      }, 3000);

      const complete = setTimeout(onComplete, 4000);

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(zoomStart);
        clearTimeout(complete);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationRef.current);
        if (renderer && renderer.domElement && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.error("Three.js Splash Failed:", err);
      // Fallback: Skip animation if WebGL fails
      onComplete();
    }
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[2000] bg-[#020617] flex items-center justify-center transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div className={`relative z-50 text-center transition-all duration-1000 ${isZooming ? 'scale-150 blur-lg opacity-0' : 'scale-100 opacity-100'}`}>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter shadow-blue-500/50 drop-shadow-2xl">
          FreshLabs
        </h1>
        <p className="mt-4 text-blue-400 font-bold uppercase tracking-[0.5em] text-xs">
          Financial Intelligence
        </p>
      </div>
    </div>
  );
};

export default SplashAnimation;