import React, { useRef, useEffect, useState, Ref } from 'react'
import { useThree } from '@react-three/fiber';
import { RayGrab, useXREvent } from '@react-three/xr';
import { Device, Selected, deviceStore, selectedObjectStore } from '../../stores';
import { Matrix4, Scene, Object3D, Vector3, Group, } from 'three';

type Base = React.ForwardRefExoticComponent<Ref<Group>>;

export const withXrInteractivity = (BaseComponent: React.ForwardRefExoticComponent<React.RefAttributes<unknown>>) => {
  const WrappedComponent = (props: Base) => {
    const { device } = deviceStore();
    const { setSelectedObject } = selectedObjectStore();
    const group = useRef();
    const { scene } = useThree();
    const [oldPosition, setOldPosition] = useState(new Vector3());
    const [newPosition, setNewPosition] = useState(new Vector3())

    useXREvent('selectstart', () => {
      updatePosition(props.name, scene, setOldPosition);
    });

    useXREvent('selectend', () => {
      updatePosition(props.name, scene, setNewPosition);
    })

    useEffect(() => {
      if (oldPosition && newPosition) {
        // if the old positions are not equal to the new positions
        if (oldPosition.x != newPosition.x || oldPosition.y != newPosition.y || oldPosition.z != newPosition.z) {
          // then you know this object has just been updated, execute logic to update websockets and analytics
          selectedObject(props.name, scene.getObjectByName(props.name), setSelectedObject, group);
        }
      }
    }, [oldPosition, newPosition, props.name, scene, setSelectedObject])


    switch (device) {
      case Device.WEB_VR:
      case Device.WEB_AR:
        return (
          <RayGrab>
            <BaseComponent
              ref={group}
              {...props}
            />
          </RayGrab>
        );
      default:
        return (
          <BaseComponent
            ref={group}
            {...props}
          />
        );
    }
  };

  WrappedComponent.displayName = 'withXrInteractivity'
  return WrappedComponent;
};

const updatePosition = (name: string, scene: Scene, setPosition: { (value: (prevState: undefined) => undefined): void; (value: (prevState: undefined) => undefined): void; (arg0: Vector3): void; }) => {
  const pos = new Vector3();
  let tempMatrix = new Matrix4;
  tempMatrix = scene.getObjectByName(name).matrixWorld;

  pos.setFromMatrixPosition(tempMatrix);
  setPosition(pos)
};

const selectedObject = (objectname: string, object: Object3D, setSelectedObject: (prop: Selected) => void, group: Ref<Group>) => {
  const { x, y, z } = object.position
  setSelectedObject({
    objectname: objectname,
    position: { x, y, z },
    group
  });
}


