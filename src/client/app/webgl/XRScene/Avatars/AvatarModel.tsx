import { useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Device, deviceStore } from "../../../webgl/stores";

export const AvatarModel = (props) => {
  const { animations, model, body, movement } = props;
  const { device } = deviceStore();

  const bodyPos = (device === Device.WEB) ? body.position.y - 1.5 : body.position.y - 1.7;

  const { actions, mixer, ref } = useAnimations(animations);

  useFrame((_state, delta) => {
    const jumpAction = actions["jump"];
    const runAction = actions["run"];
    const idleAction = actions["idle"];

    if (movement.jump === true) {
      jumpAction.play();
      jumpAction.clampWhenFinished = true;
      jumpAction.repetitions = 0;
    }
    if (movement.forward === true) {
      idleAction.stop()
      runAction.play()
    } else if (movement.forward === false) {
      runAction.stop();
      idleAction.play()
    }

    if (!jumpAction.isRunning()) jumpAction.stop()

    mixer.update(delta / 1000)

    const avatar = ref.current;
    if (!avatar || props.activeUser) return;
    avatar.position.set(body.position.x, bodyPos, body.position.z)
    avatar.rotation.set(body.rotation.x, body.rotation.y, body.rotation.z)
  })

  return (
    <primitive
      object={model}
      ref={ref}
    />
  );
};