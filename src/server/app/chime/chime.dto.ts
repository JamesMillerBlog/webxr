export class BaseChimeDto {
  clientId: string;
}
export class JoinChimeDto extends BaseChimeDto {
  userName: string;
}

export class DeleteChimeAttendeDto extends BaseChimeDto {
  attendeeId: string;
}
