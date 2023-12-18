import { Body, Controller, Post } from '@nestjs/common';

import { ChimeResponse, ChimeService } from './chime.service';
import { DeleteChimeAttendeDto, JoinChimeDto } from './chime.dto';

@Controller('')
export class ChimeController {
  constructor(private readonly chimeService: ChimeService) {}

  @Post(':joinMeeting')
  async create(@Body() chimeDto: JoinChimeDto): Promise<ChimeResponse> {
    return this.chimeService.joinMeeting(chimeDto);
  }

  @Post(':exitMeeting')
  async deleteAttendee(
    @Body() chimeDto: DeleteChimeAttendeDto,
  ): Promise<ChimeResponse> {
    return this.chimeService.deleteAttendee(chimeDto.attendeeId);
  }

  @Post(':deleteMeeting')
  async deleteMeeting(): Promise<ChimeResponse> {
    return this.chimeService.deleteMeeting();
  }
}
