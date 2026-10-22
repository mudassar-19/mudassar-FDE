# Swapping in your own 3D character

The original template's character model (`public/models/character.enc`) is
encrypted and its licensing is undocumented — see `analysis/REPORT.md` §6.
Don't ship it publicly. `src/config.ts` exports `USE_ORIGINAL_MODEL`:

- `true` — loads `character.enc` (local preview only).
- `false`, or `character.enc` missing/unreachable — automatically renders the
  code-generated low-poly "workspace" scene (`utils/proceduralScene.ts`)
  instead. Same camera and scroll choreography, no licensing risk, no
  network fetch.

Set it to `false` before any public deploy.

## Dropping in your own `.glb` later

1. Export a rigged, DRACO-compressed GLTF/GLB from Blender (or similar).
2. Put it at `public/models/character.glb` and point `character.ts`'s
   `loadOriginalModel()` at it directly with `GLTFLoader` (skip the
   AES decrypt step entirely — it isn't real security, see
   `analysis/REPORT.md` §3, and there's no reason to encrypt your own asset
   unless you specifically want to).
3. Your rig needs these object/bone names, because
   `src/components/utils/GsapScroll.ts` and `Scene.tsx` look them up by name:

   | Name | Type | Used for |
   |---|---|---|
   | `spine006` | bone/Object3D | Head — mouse-follow rotation (`mouseUtils.ts`), also the scroll timeline's final head tilt |
   | `spine005` | bone/Object3D | Neck — leans forward during the About-section scroll |
   | `footL`, `footR` | bone/Object3D | Ground-offset fix applied once after load (`character.ts`) |
   | `Plane004` | Object3D/mesh | Container whose children get faded in as the "monitor turns on"; the child mesh whose `material.name === "Material.027"` is treated as the screen |
   | `screenlight` | mesh | Emissive mesh whose `emissiveIntensity` is flickered for the glowing-screen effect |

   Animation clips, if you want the same intro/typing/blink behavior:

   | Clip name | Used for |
   |---|---|
   | `introAnimation` | Played once on load |
   | `key1`, `key2`, `key5`, `key6` | Looping idle clips, always playing |
   | `typing` | Filtered down to the bones in `data/boneData.ts`'s `typingBoneNames` and looped |
   | `browup` | Filtered down to `eyebrowBoneNames`, played once on hover |
   | `Blink` | Looping blink, started after the intro |

   If your model has no animations at all, that's fine —
   `animationUtils.ts` detects an empty `gltf.animations` array and no-ops,
   same as the procedural fallback.
4. Update `public/models/char_enviorment.hdr` if you want different
   reflections (`utils/lighting.ts` loads it by filename, not content).
