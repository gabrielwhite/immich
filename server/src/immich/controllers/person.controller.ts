import {
  AssetFaceUpdateDto,
  AssetResponseDto,
  AuthDto,
  BulkIdResponseDto,
  ImmichReadStream,
  MergePersonDto,
  PeopleResponseDto,
  PeopleUpdateDto,
  PersonResponseDto,
  PersonSearchDto,
  PersonService,
  PersonStatisticsResponseDto,
  PersonUpdateDto,
} from '@app/domain';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth, Authenticated } from '../app.guard';
import { UseValidation } from '../app.utils';
import { UUIDParamDto } from './dto/uuid-param.dto';

function asStreamableFile({ stream, type, length }: ImmichReadStream) {
  return new StreamableFile(stream, { type, length });
}

@ApiTags('Person')
@Controller('person')
@Authenticated()
@UseValidation()
export class PersonController {
  constructor(private service: PersonService) {}

  @Get()
  getAllPeople(@Auth() auth: AuthDto, @Query() withHidden: PersonSearchDto): Promise<PeopleResponseDto> {
    return this.service.getAll(auth, withHidden);
  }

  @Post()
  createPerson(@Auth() auth: AuthDto): Promise<PersonResponseDto> {
    return this.service.createPerson(auth);
  }

  @Put(':id/reassign')
  reassignFaces(
    @Auth() auth: AuthDto,
    @Param() { id }: UUIDParamDto,
    @Body() dto: AssetFaceUpdateDto,
  ): Promise<PersonResponseDto[]> {
    return this.service.reassignFaces(auth, id, dto);
  }

  @Delete()
  unassignFaces(@AuthUser() authUser: AuthUserDto, @Body() dto: AssetFaceUpdateDto): Promise<BulkIdResponseDto[]> {
    return this.service.unassignFaces(authUser, dto);
  }

  @Put()
  updatePeople(@Auth() auth: AuthDto, @Body() dto: PeopleUpdateDto): Promise<BulkIdResponseDto[]> {
    return this.service.updatePeople(auth, dto);
  }

  @Get(':id')
  getPerson(@Auth() auth: AuthDto, @Param() { id }: UUIDParamDto): Promise<PersonResponseDto> {
    return this.service.getById(auth, id);
  }

  @Put(':id')
  updatePerson(
    @Auth() auth: AuthDto,
    @Param() { id }: UUIDParamDto,
    @Body() dto: PersonUpdateDto,
  ): Promise<PersonResponseDto> {
    return this.service.update(auth, id, dto);
  }

  @Get(':id/statistics')
  getPersonStatistics(@Auth() auth: AuthDto, @Param() { id }: UUIDParamDto): Promise<PersonStatisticsResponseDto> {
    return this.service.getStatistics(auth, id);
  }

  @Get(':id/thumbnail')
  @ApiOkResponse({
    content: {
      'image/jpeg': { schema: { type: 'string', format: 'binary' } },
    },
  })
  getPersonThumbnail(@Auth() auth: AuthDto, @Param() { id }: UUIDParamDto) {
    return this.service.getThumbnail(auth, id).then(asStreamableFile);
  }

  @Get(':id/assets')
  getPersonAssets(@Auth() auth: AuthDto, @Param() { id }: UUIDParamDto): Promise<AssetResponseDto[]> {
    return this.service.getAssets(auth, id);
  }

  @Post(':id/merge')
  mergePerson(
    @Auth() auth: AuthDto,
    @Param() { id }: UUIDParamDto,
    @Body() dto: MergePersonDto,
  ): Promise<BulkIdResponseDto[]> {
    return this.service.mergePerson(auth, id, dto);
  }
}
