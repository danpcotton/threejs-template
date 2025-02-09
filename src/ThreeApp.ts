import { BoxGeometry, Clock, DirectionalLight, EquirectangularReflectionMapping, Mesh, MeshStandardMaterial, PerspectiveCamera, Raycaster, Scene, SRGBColorSpace, Texture, Vector2, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { WebGPURenderer } from "three/webgpu";
import { Pane } from "tweakpane";

export class ThreeApp
{
    private canvas: HTMLCanvasElement;

    private renderer: WebGPURenderer;
    private clock: Clock;

    private scene: Scene;
    private camera: PerspectiveCamera;

    private light: DirectionalLight;

    private raycaster: Raycaster;
    private mouse: Vector2 = new Vector2();

    private gui: Pane;

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;
        this.init3d();
    }

    private async init3d(): Promise<void>
    {
        this.renderer = new WebGPURenderer({
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false,
            canvas: this.canvas
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x1A1A1C);
        this.renderer.outputColorSpace = SRGBColorSpace;

        this.scene = new Scene();

        this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 1.5, 3.5);
        this.camera.lookAt(new Vector3());

        this.clock = new Clock();
        new OrbitControls(this.camera, this.canvas);

        //await this.loadEnvironment();

        this.light = new DirectionalLight(0xFFFFFF, 0.5);
        this.light.position.set(1, 1, 1);
        this.scene.add(this.light);

        window.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e));
        window.addEventListener("resize", (e: Event) => this.onResize(e));
        this.onResize(null);

        this.defaultCube();

        this.render();
    }

    private defaultCube(): void
    {
        this.scene.add(new Mesh(new BoxGeometry(), new MeshStandardMaterial({
            color: 0x44BBEE
        })));
    }

    private async loadEnvironment(): Promise<void>
    {
        // TODO
    }

    private time: number = 0;
    private render(): void
    {
        let dt: number = this.clock.getDelta();
        this.time += dt;

        // Mouse interaction
        /*
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let interaction: Array<Intersection> = this.raycaster.intersectObject(this.floor);
        if (interaction.length > 0)
        {
            let position: Vector3 = interaction[0].point;
        }
        */

        this.renderer.renderAsync(this.scene, this.camera);

        requestAnimationFrame(() => this.render());
    }

    private onMouseMove(e: MouseEvent): void
    {
        this.updateMouse(
            e.clientX,
            e.clientY
        );
    }

    private updateMouse(mx: number, my: number): void
    {
        let w: number = window.innerWidth;
        let h: number = window.innerHeight;

        if (mx > 0 && mx < w && my > 0 && my < h)
        {
            this.mouse.set(
                (mx / w) * 2 - 1,
                -(my / h) * 2 + 1,
            );
        }
    }

    private onResize(e: Event): void
    {
        let w: number = window.innerWidth;
        let h: number = window.innerHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);
    }
}
