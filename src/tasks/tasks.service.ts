import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { TaskCreateDto } from './dtos/taskCreateDto';
import { TasksFilterDto } from './dtos/tasksFilterDto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(dto: TasksFilterDto): Task[] {
    const { status, search } = dto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search),
      );
    }

    return tasks;
  }

  createTask(dto: TaskCreateDto): Task {
    const { title, description } = dto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const taskFound = this.tasks.find((task) => task.id === id);

    if (!taskFound) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return taskFound;
  }

  deleteTaskById(id: string): void {
    const taskFound = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== taskFound.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
