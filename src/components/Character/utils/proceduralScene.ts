import * as THREE from "three";

/**
 * Code-generated low-poly "workspace" scene used when USE_ORIGINAL_MODEL is
 * false or the encrypted character asset is missing (see config.ts and
 * ../README.md). Exposes the same object names the scroll choreography in
 * ../../utils/GsapScroll.ts and the mouse-follow code in Scene.tsx look up,
 * so no other file needs to branch on which scene is active.
 */
export function buildWorkspaceScene(): THREE.Group {
  const root = new THREE.Group();
  root.name = "workspaceRoot";

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: "#2a2230", roughness: 0.7 })
  );
  desk.position.set(0, -2, 0);
  root.add(desk);

  // "Neck" pivot — the whole desk assembly leans during the About scroll,
  // same role as the GLTF character's spine005 bone.
  const spine005 = new THREE.Object3D();
  spine005.name = "spine005";
  root.add(spine005);

  const laptopBase = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.25, 2.8),
    new THREE.MeshStandardMaterial({ color: "#3a3045", roughness: 0.4, metalness: 0.3 })
  );
  laptopBase.position.set(0, -1.6, 0.5);
  spine005.add(laptopBase);

  // "Head" pivot — tilts toward the cursor, same role as the GLTF
  // character's spine006 (head) bone.
  const spine006 = new THREE.Object3D();
  spine006.name = "spine006";
  spine006.position.set(0, -1.45, -0.9);
  spine005.add(spine006);

  // Decorative laptop lid — tilts toward the cursor via spine006, purely
  // visual (not looked up by name by GsapScroll).
  const screenHinge = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.6, 0.15),
    new THREE.MeshStandardMaterial({ color: "#3a3045", roughness: 0.4, metalness: 0.3 })
  );
  screenHinge.position.set(0, 1.3, 0);
  screenHinge.rotation.x = -0.15;
  spine006.add(screenHinge);

  // GsapScroll.ts walks `character.children` ONE level deep looking for
  // objects literally named "Plane004" and "screenlight" — both must be
  // direct children of the root group, not nested in the tilt hierarchy
  // above, or the lookup silently fails and crashes later when the
  // timeline tweens `monitor.material` / `screenLight.material`.
  const plane004 = new THREE.Object3D();
  plane004.name = "Plane004";
  plane004.position.set(0, 1.15, -0.9);
  root.add(plane004);

  const monitorMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: new THREE.Color("#c2a4ff"),
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0,
  });
  monitorMaterial.name = "Material.027";
  const monitor = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.2), monitorMaterial);
  monitor.rotation.x = -0.15;
  plane004.add(monitor);

  // "screenlight" — GsapScroll flickers this mesh's emissiveIntensity for
  // the glowing-screen effect, same role as the GLTF character's
  // screenlight mesh.
  const screenlight = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 2.2),
    new THREE.MeshStandardMaterial({
      color: "#c2a4ff",
      emissive: new THREE.Color("#c8bfff"),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0,
    })
  );
  screenlight.name = "screenlight";
  screenlight.position.set(0, 1.15, -0.88);
  screenlight.rotation.x = -0.15;
  root.add(screenlight);

  const accentGeometries: THREE.BufferGeometry[] = [
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.OctahedronGeometry(0.45, 0),
    new THREE.TorusGeometry(0.4, 0.12, 8, 16),
  ];
  const accentColors = ["#c2a4ff", "#7a5bff", "#3bd0ff"];
  accentGeometries.forEach((geometry, i) => {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: accentColors[i], roughness: 0.3, metalness: 0.4 })
    );
    const angle = (i / accentGeometries.length) * Math.PI * 2;
    mesh.position.set(Math.cos(angle) * 5, 1 + i * 0.4, Math.sin(angle) * 5 - 1);
    // Object3D.onBeforeRender fires every frame the renderer draws this
    // mesh — a free per-object animation hook with no extra wiring needed
    // in Scene.tsx's render loop.
    mesh.onBeforeRender = () => {
      mesh.rotation.x += 0.003 + i * 0.001;
      mesh.rotation.y += 0.004;
    };
    root.add(mesh);
  });

  // Scene.tsx's camera (narrow 14.5deg FOV, parked at y=13.1) was tuned for
  // the original character rig's scale/height. Lift the whole workspace a
  // little so it reads in that same framing instead of sitting in a lower
  // corner — kept modest since the desk geometry dominates the frame fast
  // at this camera distance.
  root.position.set(0, 4, 0);

  return root;
}
