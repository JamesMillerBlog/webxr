import React, { useCallback, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber';
import { deviceStore, socketStore, cognitoStore, selectedObjectStore, Device } from '../../stores';
import { Matrix4 } from 'three';
import { ModelDataPacket, ModelPositionData, PositionsType } from '@shared/types';

export const withCollaboration = (BaseComponent) => {
  const WrappedComponent = (props) => {
    const { device } = deviceStore();
    const { selectedObject } = selectedObjectStore();
    const { sendJson, lastJsonMessage } = socketStore();
    const { cognito } = cognitoStore();
    const { scene } = useThree();
    const [socketMode, setSocketMode] = useState('initialLoad');

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
      sendJson({
        action: 'positions',
        data: JSON.stringify(data)
      });
    }, [cognito.username, scene, selectedObject, sendJson])

    const updateModelFromWebSockets = useCallback(() => {
      let data: ModelPositionData;
      if (Array.isArray(lastJsonMessage)) {
        for (let x = 0; x < lastJsonMessage.length; x++) {
          const socketData = lastJsonMessage[x] as unknown as ModelDataPacket;
          if (socketData.uid == props.name && socketData.data.matrixWorld) {
            data = socketData.data;
          }
        }
      }

      if (data) {
        if (socketMode == 'stream' && data.submittedBy != cognito.username || socketMode == 'initialLoad') {
          const tempMatrix = new Matrix4();
          const matrixWorld = data.matrixWorld as Matrix4;
          tempMatrix.copy(matrixWorld);
          const group = scene.getObjectByName(props.name);
          tempMatrix.decompose(group.position, group.quaternion, group.scale)
          if (socketMode == 'initialLoad') {
            setSocketMode('stream');
          }
        }
      }
    }, [cognito.username, lastJsonMessage, props.name, scene, socketMode])

    useEffect(() => {
      if (device && device !== Device.WEB && selectedObject.objectname) {
        submitPositionsToCloud();
      }
    }, [device, selectedObject, submitPositionsToCloud])


    useEffect(() => {
      if (device != undefined && lastJsonMessage) updateModelFromWebSockets();
    }, [device, lastJsonMessage, updateModelFromWebSockets])

    return (
      <BaseComponent
        {...props}
      />
    )
  };

  WrappedComponent.displayName = 'withXrInteractivity'
  return WrappedComponent;
};
