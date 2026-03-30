import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  HostListener,
  OnDestroy,
  inject,
} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

@Component({
  selector: 'app-floatinglove',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './floatinglove.component.html',
  styleUrls: ['./floatinglove.component.css'],
})
export class FloatingloveComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private frameId: number | null = null;
  private textureLoader = new THREE.TextureLoader();
  private group = new THREE.Group();

  // Audio Logic
  private audio = new Audio();
  private isMusicStarted = false;

  private imageUrls: string[] = [];
  private textContents: string[] = [];
  private config = { count: 250, neon: '#ff1493', text: '#ffffff', musicUrl: '' };

  ngAfterViewInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id') || 'C001';
    this.loadCustomerData(customerId);
  }

  private loadCustomerData(id: string): void {
    this.http.get<any>('/customers.json').subscribe({
      next: (res) => {
        const customerData = res.customers[id];
        if (!customerData) {
          if (id !== 'C001') this.loadCustomerData('C001');
          return;
        }

        this.imageUrls = customerData.images;
        this.textContents = customerData.messages;
        this.config = {
          count: customerData.settings.elementCount,
          neon: customerData.settings.neonColor,
          text: customerData.settings.textColor,
          musicUrl: customerData.settings.musicUrl || '' // JSON ထဲမှ music url ယူခြင်း
        };

        this.setupAudio(this.config.musicUrl);
        this.initThree();
        this.createGalaxyBackground();
        this.createMixedElements(this.config.count);
        this.initBloom();
        this.animate();
      },
      error: (err) => console.error('Could not load customers.json', err),
    });
  }

  private setupAudio(url: string): void {
    if (!url) return;
    this.audio.src = url;
    this.audio.load();
    this.audio.loop = true;
    this.audio.volume = 0.5;
  }

  // Browser Autoplay Policy အရ user screen ကို နှိပ်မှ music စဖွင့်ပေးရန်
  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  handleUserInteraction(): void {
    if (!this.isMusicStarted && this.config.musicUrl) {
      this.audio.play()
        .then(() => {
          this.isMusicStarted = true;
          console.log("Music started playing...");
        })
        .catch(err => console.log("Playback failed:", err));
    }
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    const isMobile = window.innerWidth < 768;
    const fov = isMobile ? 85 : 75;

    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 35;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 1);

    this.scene.add(this.group);
  }

  private initBloom(): void {
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4, 0.3, 0.85
    );
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
  }

  private createTextTexture(text: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 1024;
    canvas.height = 256;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 80px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.strokeStyle = this.config.neon;
    context.lineWidth = 8;
    context.strokeText(text, canvas.width / 2, canvas.height / 2);
    context.fillStyle = this.config.text;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  private createMixedElements(count: number): void {
    const imageTextures = this.imageUrls.map((url) => this.textureLoader.load(url));
    const textTextures = this.textContents.map((txt) => this.createTextTexture(txt));
    const allTextures = [...imageTextures, ...textTextures];

    if (allTextures.length === 0) return;

    const isMobile = window.innerWidth < 768;
    const responsiveScale = isMobile ? 0.65 : 1.0; 
    const spreadX = isMobile ? 55 : 100;

    for (let i = 0; i < count; i++) {
      const texIndex = i % allTextures.length;
      const texture = allTextures[texIndex];
      const isImage = texIndex < imageTextures.length;

      const geometry = isImage
        ? new THREE.PlaneGeometry(3.5, 4.5)
        : new THREE.PlaneGeometry(8, 2);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        opacity: 0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * spreadX,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 30,
      );

      const randomS = (0.8 + Math.random() * 1.5) * responsiveScale;
      mesh.scale.set(randomS, randomS, 1);
      this.group.add(mesh);

      gsap.to(material, {
        opacity: 0.9,
        duration: 2,
        delay: Math.random() * 2,
        ease: 'power2.out'
      });

      gsap.to(mesh.position, {
        y: 80,
        duration: 25 + Math.random() * 30,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * -60,
        onRepeat: () => {
          mesh.position.y = -80;
        },
      });
    }
  }

  private createGalaxyBackground(): void {
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000 * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 500;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    this.scene.add(new THREE.Points(starGeometry, starMaterial));
  }

  private animate(): void {
    this.frameId = requestAnimationFrame(() => this.animate());
    if (this.composer) {
      this.group.rotation.y += 0.001;
      this.composer.render();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.fov = width < 768 ? 85 : 75; 
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  ngOnDestroy(): void {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    
    // Audio cleanup
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.load();
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.group.clear();
    }
    if (this.composer) this.composer.dispose();
  }
}