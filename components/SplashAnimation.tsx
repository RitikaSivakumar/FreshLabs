import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SplashAnimationProps {
  onComplete: () => void;
}

const SplashAnimation: React.FC<SplashAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- THREE.JS SETUP ---
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- GLOBE CREATION ---
    // Instead of a JPEG, we'll create a professional "Digital Twin" globe using a Dot-Matrix approach
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Shader to create a "Finance/Tech" dot grid globe
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x1e3a8a) }, // Deep Blue
        color2: { value: new THREE.Color(0x60a5fa) }, // Light Blue
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
          // Dot grid logic
          float dots = sin(vUv.x * 200.0) * sin(vUv.y * 100.0);
          dots = step(0.6, dots);
          
          // Fresnel effect (glow on edges)
          float intensity = pow(1.0 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          vec3 glow = color2 * intensity;
          
          vec3 finalColor = mix(color1 * 0.2, color2, dots * 0.5) + glow;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
    scene.add(globe);

    // Outer glow ring
    const glowGeometry = new THREE.SphereGeometry(1.02, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const posArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 0.005, color: 0xffffff });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) / width;
      mouseY = (e.clientY - height / 2) / height;
    };

    window.addEventListener('mousemove', onMouseMove);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Auto-rotation
      globe.rotation.y += 0.002;
      
      // Interactive rotation lag
      targetRotationY += (mouseX * 0.5 - targetRotationY) * 0.05;
      targetRotationX += (mouseY * 0.5 - targetRotationX) * 0.05;
      
      globe.rotation.y += targetRotationY;
      globe.rotation.x += targetRotationX;

      globeMaterial.uniforms.time.value = elapsedTime;

      // Handle cinematic zoom transition
      if (camera.userData.isZooming) {
        camera.position.z -= 0.1;
        if (camera.position.z < 0.2) {
          setIsExiting(true);
        }
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Timings
    const zoomInStart = setTimeout(() => {
      camera.userData.isZooming = true;
      setIsZooming(true);
    }, 5500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6500);

    // Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(zoomInStart);
      clearTimeout(completeTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (renderer.domElement && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onComplete]);

  const brandName = "FreshLabs";

  return (
    <div className={`fixed inset-0 z-[2000] bg-[#020617] overflow-hidden flex items-center justify-center transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* 3D Container */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Static Overlay Gradients */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#020617_80%)] pointer-events-none"></div>

      {/* FreshLabs Animated Branding */}
      <div className={`relative z-50 text-center pointer-events-none transition-all duration-1000 ${isZooming ? 'scale-150 blur-lg opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="flex items-center justify-center space-x-1 md:space-x-2">
          {brandName.split('').map((letter, i) => (
            <span
              key={i}
              className="inline-block text-6xl md:text-9xl font-black text-white tracking-tighter opacity-0 animate-letter-entry"
              style={{ 
                animationDelay: `${i * 0.1 + 0.5}s`,
                textShadow: '0 0 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        
        <div className="mt-8 flex flex-col items-center opacity-0 animate-sub-reveal delay-[1.5s]">
          <div className="h-[2px] w-24 bg-blue-500/40 animate-grow-x"></div>
          <p className="mt-6 text-blue-400/50 text-[10px] md:text-xs font-bold uppercase tracking-[1em] italic">
            Global Financial Intelligence
          </p>
        </div>
      </div>

      <style>{`
        @keyframes letter-entry {
          0% { 
            opacity: 0; 
            transform: translateY(50px) scale(0.5); 
            filter: blur(20px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
            filter: blur(0); 
          }
        }

        @keyframes sub-reveal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes grow-x {
          from { width: 0; }
          to { width: 96px; }
        }

        .animate-letter-entry {
          animation: letter-entry 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .animate-sub-reveal {
          animation: sub-reveal 1s ease-out 1.8s forwards;
        }

        .animate-grow-x {
          animation: grow-x 1.5s ease-in-out 1.6s forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashAnimation;