import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const Dragon3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 80); // Set camera back so we can see the dragon flying

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x113311, 2.0); // Dark green ambient
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xbfff00, 1.5); // Neon yellow-green directional light
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Add particle system for "cyber dust"
    const particleCount = 2000;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      // Spread particles across a wide volume
      posArray[i] = (Math.random() - 0.5) * 400;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xbfff00, // Neon yellow-green particles
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 3. Load Models
    const loader = new GLTFLoader();
    let mixer = null;
    let dragon = null;

    // Load Dragon
    loader.load(
      '/demon_dragon.glb',
      (gltf) => {
        dragon = gltf.scene;

        // Scale the dragon (adjust this if it's too big or small)
        dragon.scale.set(60, 60, 60);

        // Apply neon green emissive tint to all meshes in the dragon
        dragon.traverse((child) => {
          if (child.isMesh && child.material) {
            // Add a neon yellow-green glow to the material
            child.material.emissive = new THREE.Color(0xbfff00);
            child.material.emissiveIntensity = 0.15; // Lower intensity to show textures
          }
        });

        // Attach a PointLight to the dragon so it casts a yellow-green glow on its surroundings!
        const dragonLight = new THREE.PointLight(0xbfff00, 10, 100);
        dragonLight.position.set(0, 5, 0); // Position slightly above the dragon
        dragon.add(dragonLight);

        scene.add(dragon);

        // Play animation
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(dragon);
          // Try to find a flying animation, or just play the first one
          let flyAnim = gltf.animations.find(a => a.name.toLowerCase().includes('fly'));
          const action = mixer.clipAction(flyAnim || gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (error) => {
        console.error('Error loading demon_dragon.glb:', error);
      }
    );

    // 4. Animation Loop
    const clock = new THREE.Clock();
    let animationId;

    function getTrajectoryPoint(t) {
      // Complex, non-fixed organic flight path using superimposed sines
      // Increased speed and amplitude so it flies off-screen and swoops back
      const speed = 0.8;
      const time = t * speed;

      // X: Wide horizontal sweeps (up to +/- 160)
      const x = Math.sin(time) * 120 + Math.sin(time * 0.6) * 40;

      // Y: Vertical swoops (low and high)
      const y = Math.cos(time * 0.7) * 30 + Math.sin(time * 1.3) * 15 + 10;

      // Z: Depth changes, flying from far back to very close to the camera
      const z = Math.cos(time * 1.1) * 80 + Math.sin(time * 0.4) * 50 - 20;

      return new THREE.Vector3(x, y, z);
    }

    // Variables for smooth rotation
    const dummyObject = new THREE.Object3D();
    const targetQuaternion = new THREE.Quaternion();

    function animate() {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update animation mixer
      if (mixer) {
        mixer.update(delta);
      }

      // Update dragon position and rotation
      if (dragon) {
        // Current target position
        const currentPos = getTrajectoryPoint(elapsedTime);
        dragon.position.copy(currentPos);

        // Look further ahead on the path to anticipate turns (0.5 seconds ahead)
        const nextPos = getTrajectoryPoint(elapsedTime + 0.5);

        // Calculate the target rotation using a dummy object
        dummyObject.position.copy(currentPos);
        dummyObject.lookAt(nextPos);
        targetQuaternion.copy(dummyObject.quaternion);

        // Smoothly interpolate the dragon's current rotation towards the target rotation
        dragon.quaternion.slerp(targetQuaternion, delta * 4.0);

        // Optional: Add banking (roll) based on yaw rotation difference
        const localTarget = dragon.worldToLocal(nextPos.clone());
        const targetRoll = -localTarget.x * 0.02; // adjust 0.02 to change tilt amount

        // Smoothly apply the roll
        dragon.rotateZ(targetRoll * delta * 10);
      }

      // Slowly rotate the particle system for a dynamic background
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;

      renderer.render(scene, camera);
    }

    animate();

    // 5. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return <canvas ref={canvasRef} id="webgl-canvas" />;
};

export default Dragon3D;
