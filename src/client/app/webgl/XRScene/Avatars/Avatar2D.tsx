import React, { useRef, useEffect, useState, useCallback } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { Object3D, TextureLoader, DoubleSide } from "three";
import { chimeStore } from "../../stores/chime";
import { VideoTile, VideoTileState } from "amazon-chime-sdk-js";
import { useVideoTexture } from "@react-three/drei";

export const Avatar2D = (props) => {
  const avatarMesh = useRef();
  const avatarImage = props.image === undefined ? "jamesmiller.png" : props.image;
  const {attendees, meetingSession, tiles} = chimeStore();
  const [userTile, setUserTile] = useState<VideoTileState>(undefined);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement>(undefined);
  const [stream, setStream] = useState<MediaStream>(undefined);
  const texture = useLoader(TextureLoader, `/images/${avatarImage}`);

  const getUserTile = useCallback((tiles: VideoTile[]): VideoTileState | undefined => {
    const userTile = tiles.find(tile => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const tileState = tile.tileState as VideoTileState;
      const userTile = tileState.boundExternalUserId?.includes(props.username);
      if (userTile) return tile;
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const userTileState = userTile?.tileState as VideoTileState;
    return userTileState
  }, [props.username])

  const extractStream = (userTile: VideoTileState) => {
    return userTile.boundVideoStream;
  };
  
  useEffect(() => {
    if(!meetingSession) return;    
    const userTile = getUserTile(tiles);
    setUserTile(userTile);

  }, [getUserTile, attendees, meetingSession, tiles]);

  const createVideoElement = (tileState: VideoTileState, stream: MediaStream) => {
    const videoElement = document.createElement("video");
    videoElement.id = "video-" + tileState.tileId;
    videoElement.setAttribute("name", "video-" + tileState.boundAttendeeId);
    videoElement.controls = true;
    document.body.appendChild(videoElement);
    videoElement.srcObject = stream;
    videoElement.play()
    meetingSession.audioVideo.bindVideoElement(userTile.tileId, videoElement);
    return videoElement;
  }

  useFrame(async() => {
    if(meetingSession && userTile) {
      const stream = extractStream(userTile);
      
      setStream(stream);
      if(!videoElement && stream) {
        setVideoElement(createVideoElement(userTile, stream));
        return;
      }
    }

    const avatar: Object3D = avatarMesh.current;
    if (!avatar || props.activeUser) return;
    avatar.position.set(props.body.position.x, props.body.position.y, props.body.position.z)
    avatar.rotation.set(props.body.rotation.x, props.body.rotation.y, props.body.rotation.z)
  })

  const VideoMaterial = ({ src }) => {
    const texture = useVideoTexture(src)
    return <meshBasicMaterial map={texture} toneMapped={false} side={DoubleSide}/>
  }

  if(meetingSession && userTile && stream) {
    return (
      <mesh ref={avatarMesh}>
        <planeGeometry attach="geometry" args={[0.8, 0.5]} />
          <React.Suspense fallback={<meshBasicMaterial wireframe />}>
            <VideoMaterial src={stream} />
          </React.Suspense>
      </mesh>
    )
  }

  return (
    <mesh ref={avatarMesh}>
      <planeGeometry attach="geometry" args={[0.5, 0.5]} />
      <meshBasicMaterial
        attach="material"
        side={DoubleSide}
        map={texture}
      />
    </mesh>
  );
};