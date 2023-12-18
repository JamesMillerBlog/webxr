import { DefaultMeetingSession, VideoTile } from "amazon-chime-sdk-js";
import { create } from "zustand";

export interface MeetingState {
  meetingSession: DefaultMeetingSession | undefined;
  attendees: string[];
  chimeActivated: boolean;
  tiles: VideoTile[];

  actions: {
    startMeeting: (meetingSession: DefaultMeetingSession) => void;
    stopMeeting: () => void;
    addAttendee: (attendee: string) => void;
    removeAttendee: (attendee: string) => void;
    activateChime: (activate: boolean) => void;
    updateVideoTiles: (tiles: VideoTile[]) => void;
  };
}

export const chimeStore = create<MeetingState>((set) => ({
  meetingSession: undefined,
  attendees: [],
  chimeActivated: false,
  tiles: [],

  actions: {
    startMeeting: (meetingSession: DefaultMeetingSession) =>
      set(() => ({ meetingSession })),
    stopMeeting: () => set(() => ({ meetingSession: undefined })),
    addAttendee: (attendee: string) =>
      set((state) => ({ attendees: [...state.attendees, attendee] })),
    removeAttendee: (attendee: string) =>
      set((state) => {
        const index = state.attendees.indexOf(attendee);
        state.attendees.splice(index, 1);

        return { attendees: [...state.attendees] };
      }),
    activateChime: (chimeActivated: boolean) => set(() => ({ chimeActivated })),
    updateVideoTiles: (tiles: VideoTile[]) => set(() => ({ tiles })),
  },
}));
