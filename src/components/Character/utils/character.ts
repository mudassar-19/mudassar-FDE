import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { buildWorkspaceScene } from "./proceduralScene";
import { USE_ORIGINAL_MODEL } from "../../../config";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadOriginalModel = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = false;
                child.receiveShadow = false;
                mesh.frustumCulled = true;
                if (mesh.material && !Array.isArray(mesh.material)) {
                  (mesh.material as THREE.ShaderMaterial).precision = 'mediump';
                }
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  // Code-generated fallback: no license to worry about, no network fetch,
  // no DRACO/decrypt step. Exposes the same object names GsapScroll.ts
  // expects (see proceduralScene.ts), so the choreography code never
  // needs to know which scene is active.
  const loadProceduralModel = async (): Promise<GLTF> => {
    const workspace = buildWorkspaceScene();
    await renderer.compileAsync(workspace, camera, scene);
    setCharTimeline(workspace, camera);
    setAllTimeline();
    return { scene: workspace, animations: [] } as unknown as GLTF;
  };

  const loadCharacter = async (): Promise<GLTF | null> => {
    if (USE_ORIGINAL_MODEL) {
      try {
        const head = await fetch("/models/character.enc", { method: "HEAD" });
        if (head.ok) {
          return await loadOriginalModel();
        }
      } catch {
        // network/asset missing — fall through to the procedural scene
      }
    }
    return loadProceduralModel();
  };

  return { loadCharacter };
};

export default setCharacter;
