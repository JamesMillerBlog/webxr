"use client"
import { deviceStore, avatarStore, Device } from "./stores";
import Header from "./components/Header";
import RpmPopUp from "./components/ReadyPlayerMe";
import { XRScene } from './components/XRScene';
import { Shiba, Slide, Dome } from './components/3dAssets';

export default function Page() {
    const { device } = deviceStore();
    const { showIFrame } = avatarStore();
    return (
        <>
            <Header />
            {showIFrame && <RpmPopUp />}
            <XRScene>
                <Shiba name={"shiba"} position={[1, 0, -3]} rotation={[0, 1, 0]} />
                {device != Device.WEB_AR && (
                    <Dome name={"breakdown"} image={"space.jpg"} admin={true} />
                )}
                <Slide
                    name={"smile"}
                    image={"smile.jpeg"}
                    position={[-2, 0, -2]}
                    rotation={[0, 0, 0]}
                    width={1}
                    height={1}
                />
                <ambientLight intensity={1} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <spotLight position={[10, 10, 10]} angle={15} penumbra={1} />
            </XRScene>
        </>
    );
}
