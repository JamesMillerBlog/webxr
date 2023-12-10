import { ForwardRefExoticComponent, Ref, forwardRef } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { withCollaboration } from "./withCollaboration";

export interface Props extends ForwardRefExoticComponent<Ref<THREE.Group>> {
  image: string;
}

const Model = forwardRef((props: Props, group: Ref<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>>>) => {
  const { image, name } = props;
  const texture = useLoader(THREE.TextureLoader, `/images/${image}`);
  const { gl } = useThree();
  texture.anisotropy = gl.capabilities.getMaxAnisotropy();

  return (
    <mesh ref={group} name={name}>
      <sphereGeometry attach="geometry" args={[6, 32, 32]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={THREE.DoubleSide}
        color={"white"}
      />
    </mesh>
  );
});

Model.displayName = 'Dome'

export const Dome = withCollaboration(Model);
