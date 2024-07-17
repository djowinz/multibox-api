import { PartialType } from '@nestjs/swagger';
import { CreateInboxGrantDto } from './create-inbox-grant.dto';

export class UpdateInboxGrantDto extends PartialType(CreateInboxGrantDto) {}
