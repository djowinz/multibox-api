import { PartialType } from '@nestjs/swagger';
import { CreateGrantDto } from './create-grant.dto';

export class UpdateGrantDto extends PartialType(CreateGrantDto) {}
