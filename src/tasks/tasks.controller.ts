import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { TaskCreateDto } from './dtos/taskCreateDto';
import { TasksFilterDto } from './dtos/tasksFilterDto';
import { TaskStatusValidationPipe } from './pipes/taskStatusValidation.pipe';

@Controller('tasks')
export class TaskController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() dto: TasksFilterDto): Task[] {
    if (Object.keys(dto).length) {
      return this.tasksService.getTasksWithFilters(dto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  getSingleById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() dto: TaskCreateDto): Task {
    return this.tasksService.createTask(dto);
  }

  @Delete('/:id')
  deleteSingleById(@Param('id') id: string): void {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
