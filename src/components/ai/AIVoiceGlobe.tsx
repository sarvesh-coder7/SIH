import "./AIVoiceGlobe.css";
import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import earthTextureUrl from "../../assets/images/earth_texture.jpg";
import * as THREE from "three";

/* =========================================================
   TYPES
========================================================= */

export type VoiceGlobeState =
    | "listening"
    | "processing"
    | "success";

interface AIVoiceGlobeProps {
    state?: VoiceGlobeState;
}

/* =========================================================
   EARTH
========================================================= */

function Earth({ state }: { state: VoiceGlobeState }) {
    const earthRef = useRef<THREE.Mesh>(null);
    const earthTexture = useTexture(earthTextureUrl);

    useFrame((_, delta) => {
        if (!earthRef.current) return;

        // Slow rotation while listening
        const speed = state === "processing" ? 1.1 : 0.35;

        earthRef.current.rotation.y += delta * speed;
    });

    return (
        <group>
            {/* Main Earth */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[1, 64, 64]} />

                <meshStandardMaterial
                    map={earthTexture}
                    color="#22B982"
                    roughness={0.6}
                    metalness={0.2}
                    emissive="#087F63"
                    emissiveIntensity={0.6}
                />
            </mesh>

            {/* Inner glowing shell */}
            <mesh scale={1.03}>
                <sphereGeometry args={[1, 64, 64]} />

                <meshBasicMaterial
                    color="#FF9D16"
                    transparent
                    opacity={0.28}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Atmosphere */}
            <mesh scale={1.12}>
                <sphereGeometry args={[1, 64, 64]} />

                <meshBasicMaterial
                    color="#FFB52E"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

/* =========================================================
   GLOWING ORBIT RINGS
========================================================= */

function OrbitRings({ state }: { state: VoiceGlobeState }) {
    const ring1 = useRef<THREE.Mesh>(null);
    const ring2 = useRef<THREE.Mesh>(null);
    const ring3 = useRef<THREE.Mesh>(null);
    const ring4 = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        const speedMult = state === "processing" ? 2.5 : 1;

        if (ring1.current) {
            ring1.current.rotation.z += delta * 0.25 * speedMult;
            ring1.current.rotation.y += delta * 0.08 * speedMult;
        }
        if (ring2.current) {
            ring2.current.rotation.z -= delta * 0.18 * speedMult;
            ring2.current.rotation.x += delta * 0.06 * speedMult;
        }
        if (ring3.current) {
            ring3.current.rotation.z += delta * 0.12 * speedMult;
        }
        if (ring4.current) {
            ring4.current.rotation.z -= delta * 0.09 * speedMult;
        }
    });

    const glow = state === "processing" ? 1.2 : 0.8;

    return (
        <group>
            {/* Main bright gold orbit */}
            <mesh ref={ring1} rotation={[Math.PI / 2.8, 0, 0]}>
                <torusGeometry args={[1.3, 0.015, 16, 128]} />
                <meshBasicMaterial
                    color="#ffaa00"
                    transparent
                    opacity={glow}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Subtle Green atmospheric ring 1 */}
            <mesh ref={ring2} rotation={[Math.PI / 2.2, 0.3, 0]}>
                <torusGeometry args={[1.45, 0.005, 16, 128]} />
                <meshBasicMaterial
                    color="#ffb030"
                    transparent
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Subtle Green atmospheric ring 2 */}
            <mesh ref={ring3} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.6, 0.003, 12, 128]} />
                <meshBasicMaterial
                    color="#ffd060"
                    transparent
                    opacity={0.25}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Subtle Green atmospheric ring 3 */}
            <mesh ref={ring4} rotation={[Math.PI / 1.8, -0.2, 0]}>
                <torusGeometry args={[1.75, 0.002, 12, 128]} />
                <meshBasicMaterial
                    color="#ffe090"
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

/* =========================================================
   GLOWING PARTICLES
========================================================= */

function Particles() {
    const pointsRef = useRef<THREE.Points>(null);

    const count = 180;

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const radius = 1.5 + Math.random() * 0.7;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] =
            radius * Math.sin(phi) * Math.cos(theta);

        positions[i * 3 + 1] =
            radius * Math.sin(phi) * Math.sin(theta);

        positions[i * 3 + 2] =
            radius * Math.cos(phi);
    }

    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        pointsRef.current.rotation.y += delta * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>

            <pointsMaterial
                size={0.018}
                color="#f7d56a"
                transparent
                opacity={0.75}
                sizeAttenuation
            />
        </points>
    );
}

/* =========================================================
   3D GLOBE SCENE
========================================================= */

function GlobeScene({
    state,
}: {
    state: VoiceGlobeState;
}) {
    return (
        <>
            <ambientLight intensity={2.5} />

            <pointLight
                position={[5, 3, 5]}
                intensity={5}
                color="#ffffff"
            />

            <pointLight
                position={[-5, -3, 2]}
                intensity={4}
                color="#ffffff"
            />

            <pointLight
                position={[0, -2, 5]}
                intensity={3}
                color="#f7c948"
            />

            <Earth state={state} />

            <OrbitRings state={state} />

            <Particles />

            <Stars
                radius={5}
                depth={2}
                count={100}
                factor={1}
                saturation={0}
                fade
                speed={0.3}
            />

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
            />
        </>
    );
}

/* =========================================================
   AUDIO WAVEFORM
========================================================= */

function AudioWaveform({
    state,
    align = "center"
}: {
    state: VoiceGlobeState;
    align?: "left" | "right" | "center";
}) {
    const bars = 15;

    // For symmetrical effect
    const delays = align === "left"
        ? Array.from({ length: bars }).map((_, i) => (bars - i) * 0.07)
        : Array.from({ length: bars }).map((_, i) => i * 0.07);

    return (
        <div
            className={`ai-globe-waveform ${align} ${state === "processing"
                ? "processing"
                : ""
                }`}
        >
            {delays.map((delay, index) => (
                <span
                    key={index}
                    style={{
                        animationDelay: `${delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export const AIVoiceGlobe: React.FC<
    AIVoiceGlobeProps
> = ({ state = "listening" }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Fade in only. Keep CSS translateX(-50%) positioning intact.
        containerRef.current.animate(
            [
                { opacity: 0 },
                { opacity: 1 },
            ],
            {
                duration: 500,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "forwards",
            }
        );
    }, []);

    const statusText =
        state === "processing"
            ? "Processing..."
            : state === "success"
                ? "Done"
                : "Listening...";

    return (
        <div
            ref={containerRef}
            className={`ai-voice-globe-overlay ${state === "processing"
                ? "is-processing"
                : ""
                } ${state === "success"
                    ? "is-success"
                    : ""
                }`}
        >
            {/* Background glow */}
            <div className="ai-globe-background-glow" />

            {/* Main Interface */}
            <div className="ai-globe-interface">
                {state === "success" ? (
                    <div className="ai-globe-success">
                        ✓
                    </div>
                ) : (
                    <div className="ai-globe-active-ui">
                        <AudioWaveform state={state} align="left" />

                        <div className="ai-globe-canvas">
                            <Canvas
                                camera={{
                                    position: [0, 0, 3.0],
                                    fov: 45,
                                }}
                                dpr={[1, 2]}
                            >
                                <React.Suspense fallback={null}>
                                    <GlobeScene state={state} />
                                </React.Suspense>
                            </Canvas>
                        </div>

                        <AudioWaveform state={state} align="right" />
                    </div>
                )}
            </div>

            {/* Status Text (floating below) */}
            {state !== "success" && (
                <div className="ai-globe-text">
                    <h3>{statusText}</h3>
                    <p>
                        {state === "processing"
                            ? "Understanding your request"
                            : "Speak now to control the platform"}
                    </p>
                </div>
            )}

            {/* Bottom decorative wave */}
            <div className="ai-globe-wave-container">
                <svg className="ai-globe-wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="rgba(247, 201, 72, 0.15)" d="M0,192L48,197.3C96,203,192,213,288,213.3C384,213,480,203,576,176C672,149,768,107,864,106.7C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    <path fill="url(#waveGradient)" d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,106.7C672,96,768,128,864,149.3C960,171,1056,181,1152,176C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(247, 180, 60, 0.05)" />
                            <stop offset="50%" stopColor="rgba(247, 180, 60, 0.20)" />
                            <stop offset="100%" stopColor="rgba(247, 180, 60, 0.05)" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
};

export default AIVoiceGlobe;
