import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NoteCreateDto, NoteUpdateDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async getAll(userId: number) {
    const notes = await this.prismaService.note.findMany({
      where: { userId },
    });
    return notes;
  }

  async getSingleById(noteId: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      throw new NotFoundException('Not found');
    }
    return note;
  }

  async create(userId: number, noteCreateDto: NoteCreateDto) {
    const note = await this.prismaService.note.create({
      data: {
        ...noteCreateDto,
        userId,
      },
    });
    return note;
  }

  async updateSingleById(
    userId: number,
    noteId: number,
    noteUpdateDto: NoteUpdateDto,
  ) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
        userId,
      },
    });

    if (!note) {
      throw new NotFoundException('Not found');
    }

    return this.prismaService.note.update({
      where: {
        id: noteId,
      },
      data: {
        ...noteUpdateDto,
      },
    });
  }

  async deleteById(userId: number, noteId: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
        userId,
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    await this.prismaService.note.delete({
      where: {
        id: noteId,
      },
    });

    return 'Note deleted successfully';
  }
}
