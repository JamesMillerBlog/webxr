/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: zixisun02 (https://sketchfab.com/zixisun51)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/shiba-faef9fe5ace445e7b2989d1c1ece361c
title: Shiba
*/
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { ForwardRefExoticComponent, Ref, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { withCollaboration } from './withCollaboration';
import { withXrInteractivity } from './withXrInteractivity';
import { Group } from 'three';

const Model = forwardRef((props: ForwardRefExoticComponent<Ref<Group>>, group: React.ForwardedRef<Group>) => {
  const { name } = props;
  const { nodes } = useGLTF('/shiba/scene.gltf')
  return (
    <group ref={group} {...props} dispose={null} name={name}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Group18985_default_0.geometry} material={nodes.Group18985_default_0.material} />
          </group>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Box002_default_0.geometry} material={nodes.Box002_default_0.material} />
          </group>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Object001_default_0.geometry} material={nodes.Object001_default_0.material} />
          </group>
        </group>
      </group>
    </group>
  )
});

Model.displayName = 'Shiba';

useGLTF.preload('/shiba/scene.gltf')


const InteractiveModel = withXrInteractivity(Model);
export const Shiba = withCollaboration(InteractiveModel);
