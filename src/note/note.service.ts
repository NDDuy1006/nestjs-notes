import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NoteCreateDto, NoteUpdateDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async getAll(userId: number) {
    const notes = await this.prismaService.note.findMany({
      where: { userId },
    });
    console.log(notes);

    return notes;
  }

  async getSingleById(userId: number, noteId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid user');
    }

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

  async creat(userId: number, noteCreateDto: NoteCreateDto) {
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

  deleteById(userId: number, noteId: number) {}
}
