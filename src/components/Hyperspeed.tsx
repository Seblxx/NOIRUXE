import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from "postprocessing";

import "./Hyperspeed.css";

// Preset configurations
export const hyperspeedPresets = {
  cyberpunk: {
    distortion: "turbulentDistortion",
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3,
    },
  },
};

interface HyperspeedProps {
  preset?: keyof typeof hyperspeedPresets;
}

export default function Hyperspeed({ preset = "cyberpunk" }: HyperspeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const options = hyperspeedPresets[preset];
    
    // WebGL App implementation
    class HyperspeedApp {
      container: HTMLDivElement;
      renderer: THREE.WebGLRenderer;
      composer: any;
      camera: THREE.PerspectiveCamera;
      scene: THREE.Scene;
      clock: THREE.Clock;
      options: any;

      constructor(container: HTMLDivElement, opts: any) {
        this.container = container;
        this.options = opts;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
          opts.fov,
          container.offsetWidth / container.offsetHeight,
          0.1,
          10000
        );
        this.camera.position.set(0, 8, -5);

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(opts.colors.background, opts.length * 0.2, opts.length * 500);
        
        this.clock = new THREE.Clock();
        
        this.init();
      }

      init() {
        // Create road
        this.createRoad();
        
        // Create car lights
        this.createCarLights();
        
        // Create light sticks
        this.createLightSticks();
        
        // Setup post-processing
        this.setupPostProcessing();
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener("resize", this.onResize.bind(this));
      }

      createRoad() {
        const roadGeometry = new THREE.PlaneGeometry(
          this.options.roadWidth,
          this.options.length,
          20,
          100
        );
        
        const roadMaterial = new THREE.MeshBasicMaterial({
          color: this.options.colors.roadColor,
          side: THREE.DoubleSide,
        });
        
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.z = -this.options.length / 2;
        this.scene.add(road);
      }

      createCarLights() {
        const particleCount = this.options.lightPairsPerRoadWay * 2;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          positions[i3] = (Math.random() - 0.5) * this.options.roadWidth;
          positions[i3 + 1] = Math.random() * 2;
          positions[i3 + 2] = -Math.random() * this.options.length;

          const color = i % 2 === 0
            ? this.options.colors.leftCars[Math.floor(Math.random() * this.options.colors.leftCars.length)]
            : this.options.colors.rightCars[Math.floor(Math.random() * this.options.colors.rightCars.length)];

          const threeColor = new THREE.Color(color);
          colors[i3] = threeColor.r;
          colors[i3 + 1] = threeColor.g;
          colors[i3 + 2] = threeColor.b;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: 0.5,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
      }

      createLightSticks() {
        for (let i = 0; i < this.options.totalSideLightSticks; i++) {
          const geometry = new THREE.BoxGeometry(0.1, 1.5, 0.1);
          const material = new THREE.MeshBasicMaterial({
            color: this.options.colors.sticks,
          });
          const stick = new THREE.Mesh(geometry, material);
          
          stick.position.set(
            -this.options.roadWidth / 2 - 1,
            0.75,
            -i * (this.options.length / this.options.totalSideLightSticks)
          );
          
          this.scene.add(stick);
        }
      }

      setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const bloomEffect = new BloomEffect({
          luminanceThreshold: 0.2,
          luminanceSmoothing: 0,
          intensity: 1.5,
        });

        const bloomPass = new EffectPass(this.camera, bloomEffect);
        this.composer.addPass(bloomPass);

        const smaaEffect = new SMAAEffect({
          preset: SMAAPreset.HIGH,
        });

        const smaaPass = new EffectPass(this.camera, smaaEffect);
        smaaPass.renderToScreen = true;
        this.composer.addPass(smaaPass);
      }

      animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        // Animate camera
        this.camera.position.z += delta * 20;
        if (this.camera.position.z > 0) {
          this.camera.position.z = -this.options.length;
        }

        // Render
        if (this.composer) {
          this.composer.render(delta);
        } else {
          this.renderer.render(this.scene, this.camera);
        }
      }

      onResize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        if (this.composer) {
          this.composer.setSize(width, height);
        }
      }

      dispose() {
        window.removeEventListener("resize", this.onResize.bind(this));
        if (this.renderer) {
          this.renderer.dispose();
        }
        if (this.composer) {
          this.composer.dispose();
        }
        if (this.container && this.renderer.domElement) {
          this.container.removeChild(this.renderer.domElement);
        }
      }
    }

    appRef.current = new HyperspeedApp(containerRef.current, options);

    return () => {
      if (appRef.current) {
        appRef.current.dispose();
      }
    };
  }, [preset]);

  return <div id="lights" ref={containerRef} />;
}
