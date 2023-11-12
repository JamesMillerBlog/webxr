import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AvatarController } from "./AvatarController";
import { useController } from "@react-three/xr";
import { Device, deviceStore, movementStore, positionsStore } from "../../../stores";
import { Objects } from "@shared/types";

export const YourAvatar = (props) => {
  const { image, username, userMode, avatar } = props;
  const camera = useThree((state) => state.camera);
  const from: React.Ref<THREE.Group> = useRef();
  const to: React.Ref<THREE.Group> = useRef();
  const temp: React.Ref<THREE.Group> = useRef();
  const userAvatar: React.Ref<THREE.Group> = useRef();
  const follow: React.Ref<THREE.Group> = useRef();
  const userCamera: React.Ref<THREE.Group> = useRef();

  const { device } = deviceStore();

  const { setPositions } = positionsStore();
  const { movement } = movementStore();
  const coronaSafetyDistance = 3;
  const lController = useController("left");
  const rController = useController("right");
  const leftController =
    device !== Device.WEB && lController ? lController.controller : undefined;
  const rightController =
    device !== Device.WEB && rController ? rController.controller : undefined;

  const defaultPosition = { x: 0, y: 0, z: 0 }
  const body = {
    position: defaultPosition,
    rotation: defaultPosition
  }
  let goalDistance = coronaSafetyDistance;
  let velocity = 0;
  const dir = new THREE.Vector3();

  const { forward, backward, left, right } = movement;

  useFrame(() => {
    const data: Objects = {
      body: {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
      },
      leftHand: {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
      },
      rightHand: {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
      }
    };
    if (device !== Device.WEB) {
      body.position = {
        x: camera.position.x,
        y: camera.position.y - 0.3,
        z: camera.position.z
      }

      body.rotation = {
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: -camera.rotation.z
      }

      data.body = body;

      if (leftController) {
        data.leftHand.position = {
          x: -leftController.position.x,
          y: leftController.position.y,
          z: -leftController.position.z
        }
        data.leftHand.rotation = {
          x: -leftController.rotation.x + 0.8,
          y: -leftController.rotation.y,
          z: -leftController.rotation.z
        }
      }

      if (rightController) {
        data.rightHand.position = {
          x: -rightController.position.x,
          y: rightController.position.y,
          z: -rightController.position.z
        }
        data.rightHand.rotation = {
          x: -rightController.rotation.x + 0.8,
          y: -rightController.rotation.y,
          z: -rightController.rotation.z
        }
      }
      setPositions(data)
    } else {
      let moveSpeed = 0;
      camera.position.setFromMatrixPosition(userCamera.current.matrixWorld);

      if (forward && !left && !right) moveSpeed += 0.2;
      else if (forward && (left || right)) moveSpeed += 0.1;
      else if (backward && !left && !right) moveSpeed += -0.2;
      else if (backward && (left || right)) moveSpeed += -0.1;

      if (left) userAvatar.current.rotation.y += 0.05
      else if (right) userAvatar.current.rotation.y -= 0.05

      velocity = (moveSpeed - velocity) * 0.3;
      userAvatar.current.translateZ(velocity);
      from.current.position.lerp(userAvatar.current.position, 0.4);
      to.current.position.copy(userCamera.current.position);
      temp.current.position.setFromMatrixPosition(camera.matrixWorld);
      dir.copy(from.current.position).sub(to.current.position).normalize();
      goalDistance += (3 - goalDistance) * 0.4;
      const dis = from.current.position.distanceTo(to.current.position) - goalDistance;
      userCamera.current.position.addScaledVector(dir, dis);
      temp.current.position.setFromMatrixPosition(follow.current.matrixWorld);
      userCamera.current.position.lerp(temp.current.position, 0.02);
      camera.lookAt(userAvatar.current.position);
      camera.updateProjectionMatrix();
      data.body.position = userAvatar.current.position;
      data.body.rotation.y = userAvatar.current.rotation.y;

      if (forward || left || right || backward) setPositions(data)
    }
  });

  return (
    <>
      {device === Device.WEB && (
        <>
          <group ref={from} />
          <group ref={to} />
          <group ref={userCamera} />
          <group ref={temp} />

          <group ref={userAvatar}>
            <AvatarController
              key={username}
              image={image}
              activeUser={true}
              avatar={avatar}
              userMode={userMode}
              body={body}
              movement={movement}
            />
            <group ref={follow} position={[0, 1, -3]} />
          </group>
        </>
      )}
    </>
  );
};