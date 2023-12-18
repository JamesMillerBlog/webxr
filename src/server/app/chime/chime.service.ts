import { Injectable } from '@nestjs/common';
import { ChimeDetails } from '@shared/types';
import * as AWS from 'aws-sdk';
import {
  CreateMeetingResponse,
  GetMeetingResponse,
} from 'aws-sdk/clients/chime';
import { InjectModel, Model } from 'nestjs-dynamoose';

const chime = new AWS.Chime();
chime.endpoint = new AWS.Endpoint(
  'https://meetings-chime.eu-west-2.amazonaws.com',
);

export interface ChimeResponse {
  statusCode: number;
  headers: { 'content-type': string };
  body: string;
}

const json = (
  statusCode: number,
  contentType: string,
  body: ChimeDetails | object,
) => {
  return {
    statusCode,
    headers: { 'content-type': contentType },
    body: JSON.stringify(body),
  };
};

const create_UUID = () => {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
};

export interface ChimeKey {
  meetingId: string;
}

@Injectable()
export class ChimeService {
  constructor(
    @InjectModel('Chime')
    private chimeModel: Model<ChimeKey, ChimeKey>,
  ) {}

  async createMeeting(): Promise<CreateMeetingResponse> {
    const meetingToken = create_UUID();

    const meeting = await chime
      .createMeeting({
        ClientRequestToken: meetingToken,
        MediaRegion: 'eu-west-2',
        ExternalMeetingId: meetingToken,
      })
      .promise();
    const id = meeting.Meeting.MeetingId;

    await this.chimeModel.create({ meetingId: id });

    return meeting;
  }

  async getExistingMeeting(meetingId: string) {
    const meeting = await chime
      .getMeeting({
        MeetingId: meetingId,
      })
      .promise();

    return meeting;
  }

  async createOrJoinExistingMeeting(): Promise<GetMeetingResponse> {
    let meeting = null;

    const res = await this.chimeModel.scan().exec();
    const meetingId = res[0]?.meetingId;

    if (
      !meetingId ||
      meetingId === 'undefined' ||
      meetingId === 'null' ||
      meetingId === ''
    ) {
      meeting = await this.createMeeting();
    } else {
      try {
        meeting = await this.getExistingMeeting(meetingId);
      } catch (e) {
        this.deleteMeeting();
        meeting = await this.createMeeting();
      }
    }

    return meeting;
  }

  async joinMeeting(query): Promise<ChimeResponse> {
    try {
      const userName = query.userName;

      const meeting = await this.createOrJoinExistingMeeting();
      // Add attendee to the meeting (new or existing)
      const attendee = await chime
        .createAttendee({
          MeetingId: meeting.Meeting.MeetingId,
          ExternalUserId: `${userName}#${query.clientId}`,
        })
        .promise();

      return json(200, 'application/json', {
        Info: {
          Meeting: meeting,
          Attendee: attendee,
        },
      });
    } catch (e) {
      console.warn(String(e));
      return json(200, 'application/json', {});
    }
  }

  // Delete attendee from the meeting
  async deleteAttendee(attendeeId: string) {
    const res = await this.chimeModel.scan().exec();
    const meetingId = res?.[0].meetingId;
    await chime
      .deleteAttendee({
        MeetingId: meetingId,
        AttendeeId: attendeeId,
      })
      .promise();
    return json(200, 'application/json', {});
  }

  // Delete the meeting
  async deleteMeeting() {
    const res = await this.chimeModel.scan().exec();
    const meetingId = res.length > 0 ? res?.[0].meetingId : null;
    if (!meetingId) {
      return json(200, 'application/json', {});
    }
    this.chimeModel.delete({ meetingId });
    await chime
      .deleteMeeting({
        MeetingId: meetingId,
      })
      .promise();
    return json(200, 'application/json', {});
  }
}
