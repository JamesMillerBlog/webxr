"use client"

import React, { useCallback, useEffect, useState } from "react";
import { HTTP_API_URL } from "../common";
import { ConsoleLogger, DefaultDeviceController, DefaultMeetingSession, LogLevel, MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { useAuthStore } from "../stores";
import { ChimeDetails } from "@shared/types";
import axios from "axios";
import { chimeStore } from "../webgl/stores/chime";

export default function ChimeProvider({children}: {children: React.ReactNode}) {
  const {meetingSession, actions, chimeActivated} = chimeStore()
  const [clientId, setClientId] = useState("");
  const { auth } = useAuthStore();

  const attendeeObserver = useCallback((attendeeId: string | string[], present: unknown, externalUserId: string) => {
    const attendeeUserName = externalUserId.substring(0, externalUserId.indexOf("#"));
    
    if (present) actions.addAttendee(attendeeUserName);
    else actions.removeAttendee(attendeeUserName);
  }, [actions]);

  const cleanup = useCallback(() => {
    if (!meetingSession) return
    meetingSession.deviceController.destroy();
    meetingSession.audioVideo.stop();
    meetingSession.audioVideo.stopLocalVideoTile();
    meetingSession.audioVideo.unbindAudioElement();
    meetingSession.audioVideo.realtimeUnsubscribeToAttendeeIdPresence(attendeeObserver);

    const videoElements = document.getElementsByTagName("video");
    for (let i = 0; i < videoElements.length; i++) videoElements[i].remove();  
    actions.stopMeeting();
    actions.activateChime(false)
  },[actions, attendeeObserver, meetingSession]);

    
  const start = useCallback(async (jwt: undefined | string, chimeActivated: boolean) => {
    if(!jwt || !chimeActivated) return;
    try {
      if(meetingSession) {
        cleanup();
      }
      const response = await axios({
        method: "post",
        url: `${HTTP_API_URL}/joinMeeting`,
        data: {
          userName: auth.username,
          clientId
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.jwt}`,
        },
      });
      const data: ChimeDetails = JSON.parse(response.data.body);
      const configuration = new MeetingSessionConfiguration(
        data.Info.Meeting,
        data.Info.Attendee
      );
      const logger = new ConsoleLogger('ChimeLogger', LogLevel.INFO);
      const deviceController = new DefaultDeviceController(logger);
      const newMeetingSession = new DefaultMeetingSession(
        configuration,
        logger,
        deviceController
      );

      const audioInputs = await newMeetingSession.audioVideo.listAudioInputDevices();
      const videoInputs = await newMeetingSession.audioVideo.listVideoInputDevices();
      await newMeetingSession.audioVideo.startAudioInput(audioInputs[0].deviceId);
      await newMeetingSession.audioVideo.startVideoInput(videoInputs[0].deviceId);

      const { audioVideo } = newMeetingSession;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const videoTileController = audioVideo.videoTileController;
      const observer = {
        videoTileDidUpdate: (tileState) => {
          if (!tileState.boundAttendeeId) {
            return;
          }
          if (!(newMeetingSession === null)) {
            const tileMap = videoTileController.getAllVideoTiles();
            actions.updateVideoTiles(tileMap)
          }
        },
      };
      const eventObserver = {
        eventDidReceive(name, attributes) {
          switch (name) {
            case 'meetingEnded':
              console.log("NOTE: Meeting Ended", attributes);
              cleanup();
              break;
            case 'meetingReconnected':
              console.log('NOTE: Meeting Reconnected...');
              break;
            case 'meetingRecover':
              console.log('NOTE: Meeting Recovered...');
              break;
            case 'videoAvailability':
              console.log('NOTE: Video Availability Changed', attributes);
              break;
            case 'videoSendHealth':
              console.log('NOTE: Video Send Health Changed', attributes);
              break;
            case 'videoReceiveHealth':
              console.log('NOTE: Video Receive Health Changed', attributes);
              break;
            case 'metrics':
              console.log('NOTE: Meeting Metrics Collected', attributes);
              break;
            default:
              console.log('Unhandled Meeting Event: ', name);
              break;
          }
        }
      };
      newMeetingSession.audioVideo.addObserver(observer);
      newMeetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(attendeeObserver);
      newMeetingSession.eventController.addObserver(eventObserver);

      const audioOutputElement = document.getElementById("meeting-audio") as HTMLAudioElement;
      newMeetingSession.audioVideo.bindAudioElement(audioOutputElement);
      newMeetingSession.audioVideo.start();
      newMeetingSession.audioVideo.startLocalVideoTile();
      
      actions.startMeeting(newMeetingSession)
    } catch (err) {
      console.error("Error: ");
      console.log(err)
    }
  }, [actions, attendeeObserver, auth.jwt, auth.username, cleanup, clientId, meetingSession])

  useEffect(() => {
    start(auth.jwt, chimeActivated);
  }, [start, auth.jwt, chimeActivated])

  useEffect(() => {
    if(meetingSession && !auth.jwt) cleanup();
  }, [meetingSession, auth.jwt, cleanup])

  useEffect(() => {
    const cId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setClientId(cId) 
  }, []);

  return (
    <>
      <audio style={{display: "none"}} id="meeting-audio" />
      {children}
    </>
  );
}