import { useThree } from "@react-three/fiber";
import React, { useRef, useEffect } from "react";
import { Device, deviceStore } from "../../webgl/stores";

export const Camera = (props) => {
  const ref = useRef();
  const set = useThree((state) => state.set);
  const { device } = deviceStore();
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    set({
      camera: ref.current,
    });
    camera.position.set(0, 0.5, -5);
    camera.updateProjectionMatrix();
    if (device === Device.WEB_AR) {
      const posCorrection = props.posCorrection ? props.posCorrection : 0;
      camera.position.y -= posCorrection;
    }
  }, [camera, device, props.posCorrection, set]);

  return <perspectiveCamera ref={ref} {...props} />;
};
