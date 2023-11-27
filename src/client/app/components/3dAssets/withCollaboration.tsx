import React, { useCallback, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber';
import { deviceStore, socketStore, cognitoStore, selectedObjectStore, Device } from '../../stores';
import { Matrix4 } from 'three';
import { ModelDataPacket, ModelPositionData, PositionsType } from '@shared/types';

export enum PositionSharing {
  INITIATING,
  STREAMIMG
}

export const withCollaboration = (BaseComponent) => {
  const WrappedComponent = (props) => {
    const { device } = deviceStore();
    const { selectedObject } = selectedObjectStore();
    const { receivedSocketData, websocket } = socketStore();
    const { cognito } = cognitoStore();
    const { scene } = useThree();
    const [positionSharing, setPositionSharing] = useState(PositionSharing.INITIATING);

    const submitPositionsToCloud = useCallback(() => {
      const object = scene.getObjectByName(selectedObject.objectname);
      const data: ModelDataPacket = {
        type: PositionsType.OBJECTS,
        uid: selectedObject.objectname,
        data: {
          submittedBy: cognito.username,
          matrixWorld: object.matrixWorld
        }
      };

      try {
        websocket.send(
          JSON.stringify({
            event: 'positions',
            data,
          })
        );
      } catch (e) {
        console.warn(e)
      }

    }, [cognito.username, scene, selectedObject, websocket])

    const updateModelFromWebSockets = useCallback(() => {
      const socketData = receivedSocketData as ModelDataPacket;
      const validModelPositionData = socketData.uid === props.name && socketData.data.matrixWorld;
      const data: ModelPositionData | undefined = (validModelPositionData) ? socketData.data : undefined;

      if (data) {
        if (positionSharing === PositionSharing.STREAMIMG && data.submittedBy != cognito.username || positionSharing === PositionSharing.INITIATING) {
          const tempMatrix = new Matrix4();
          const matrixWorld = data.matrixWorld as Matrix4;
          tempMatrix.copy(matrixWorld);
          const group = scene.getObjectByName(props.name);
          tempMatrix.decompose(group.position, group.quaternion, group.scale)
          if (positionSharing === PositionSharing.INITIATING) {
            setPositionSharing(PositionSharing.STREAMIMG);
          }
        }
      }
    }, [cognito.username, props.name, receivedSocketData, scene, positionSharing])

    useEffect(() => {
      if (device && device !== Device.WEB && selectedObject.objectname) {
        submitPositionsToCloud();
      }
    }, [device, selectedObject, submitPositionsToCloud])


    useEffect(() => {
      if (device != undefined && receivedSocketData) updateModelFromWebSockets();
    }, [device, receivedSocketData, updateModelFromWebSockets])

    return (
      <BaseComponent
        {...props}
      />
    )
  };

  WrappedComponent.displayName = 'withXrInteractivity'
  return WrappedComponent;
};
