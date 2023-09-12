import { useLoader } from "@react-three/fiber";
import { AvatarModel, VRAvatarModel } from ".";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";
import { useCallback, useEffect, useState } from "react";

export interface LoadedNodes {
    [name: string]: THREE.Object3D<THREE.Event>;
}

export interface LoadedGltf {
    nodes: LoadedNodes;
    scene: THREE.Group;
}

export type Model = LoadedNodes | THREE.Group

export const Avatar3D = (props) => {
    const [vr, setVR] = useState(false)
    const [gltf, setGltf] = useState<LoadedGltf>()
    const [model, setModel] = useState<Model>()
    const [animations, setAnimations] = useState<THREE.AnimationClip[]>()

    if (!gltf) {
        const loadedGltf = LoadModel(props.avatar)
        setGltf(loadedGltf)
    }

    if (!animations) {
        const loadedAnimations = loadAnimations(["idle", "run", "jump"]);
        setAnimations(loadedAnimations)
    }

    const init = useCallback(() => {
        const model = gltf.nodes.AvatarRoot ? gltf.nodes : gltf.scene;
        if (gltf.nodes.AvatarRoot) setVR(true)
        setModel(model)
    }, [gltf])

    useEffect(() => {
        init()
    }, [init])

    if (props.activeUser && props.vr) {
        return (<></>)
    } else if (!vr && model && animations && !props.vr) {
        return (
            <AvatarModel
                model={model}
                animations={animations}
                movement={props.movement}
                body={props.body}
            />
        );
    } else if (vr && model) {
        const defaultPosition = {
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Vector3(0, 0, 0),
        };
        const leftHand = props.leftHand ? props.leftHand : defaultPosition;
        const rightHand = props.rightHand ? props.rightHand : defaultPosition;
        const position = new THREE.Vector3(0, -.5, 0);

        return (
            <group
                position={position}
            >
                <VRAvatarModel
                    model={model}
                    body={props.body}
                    leftHand={leftHand}
                    rightHand={rightHand}
                    vr={props.vr}
                />
            </group>
        );
    }
}

const LoadModel = (avatar: string): LoadedGltf => {
    const { nodes, scene } = useLoader(GLTFLoader, avatar, (loader) => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        loader.setDRACOLoader(dracoLoader);
    });

    return { nodes, scene };
};

const loadAnimations = (animationArray: string[]) => {
    const clips = animationArray.map((animation) => {
        useFBX.preload(`./${animation}.fbx`);
        const { animations } = useLoader(FBXLoader, `./${animation}.fbx`);
        animations[0].name = animation;
        return animations[0];
    });
    return clips;
};