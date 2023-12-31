import {
  Controller,
  UseGuards,
  Get,
  Patch,
  Req,
  Body,
  Delete,
  Post,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CustomJwtGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { GetUser } from '../auth/decorators';
import { NoteCreateDto, NoteUpdateDto } from './dto';

@Controller('notes')
@UseGuards(CustomJwtGuard)
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Post()
  createNote(
    @GetUser('id') userId: number,
    @Body() noteCreateDto: NoteCreateDto,
  ) {
    return this.noteService.create(userId, noteCreateDto);
  }

  @Get()
  getAllNotes(@GetUser('id') userId: number) {
    return this.noteService.getAll(userId);
  }

  @Get('/getSingle/:noteId')
  getNoteById(@Param('noteId', ParseIntPipe) noteId: number) {
    return this.noteService.getSingleById(noteId);
  }

  @Patch(':noteId')
  updateNoteById(
    @GetUser('id') userId: number,
    @Param('noteId', ParseIntPipe) noteId: number,
    @Body() noteUpdateDto: NoteUpdateDto,
  ) {
    return this.noteService.updateSingleById(userId, noteId, noteUpdateDto);
  }

  @Delete()
  deleteNoteById(
    @GetUser('id') userId: number,
    @Query('id', ParseIntPipe) noteId: number,
  ) {
    return this.noteService.deleteById(userId, noteId);
  }
}
