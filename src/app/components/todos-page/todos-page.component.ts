import { CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, switchMap, take } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { TodosService } from 'src/app/services/todos.service';
import { Status } from 'src/app/types/status';
import { Todo } from 'src/app/types/todo';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrls: ['./todos-page.component.scss']
})
export class TodosPageComponent implements OnInit {
  dragTodos: Todo[] = [];
  todos$ = this.todoService.todos$;

  activeTodos$ = this.todos$.pipe(
    distinctUntilChanged(),
    map(todos => todos.filter(todo => !todo.completed))
  );

  completedTodos$ = this.todos$.pipe(
    map(todos => todos.filter(todo => todo.completed))
  );

  activeCount$ = this.activeTodos$.pipe(
    map(todos => todos.length)
  );

  visibleTodos$ = this.route.params.pipe(
    switchMap(params => {
      switch (params['status'] as Status) {
        case 'active':
          return this.activeTodos$;

        case 'completed':
          return this.completedTodos$;

        default:
          return this.todos$;
      }
    })
  );

  todoForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
      ]
    }),
  })

  get title() {
    return this.todoForm.get('title') as FormControl;
  }

  constructor(
    private todoService: TodosService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.todoService.todos$.subscribe(todos => {
      this.dragTodos = todos;
    });

    this.route.params.subscribe();

    this.todoService.loadTodos()
      .subscribe({
        error: () => this.messageService.showMessage('Unnable to load todos'),
      });
  }

  drop(event: CdkDragDrop<Todo[]>) {
    moveItemInArray(this.dragTodos, event.previousIndex, event.currentIndex);
    const index: number = event.previousIndex;

    this.deleteTodo(this.dragTodos[index]);
    this.createTodo(this.dragTodos[index]);
  }

  createTodo(todo: Todo) {
    this.todoService.createNewTodo(todo)
      .subscribe({
        error: () => this.messageService.showMessage('Unnable to create todo'),
      });
  }

  trackById(i: number, todo: Todo) {
    return todo.id;
  }

  handleFormSubmit() {
    if (this.todoForm.invalid) {
      return;
    }
    this.addTodo(this.title.value)
    this.todoForm.reset();
  }

  addTodo(newTitile: string) {
    this.todoService.createTodo(newTitile)
      .subscribe({
        error: () => this.messageService.showMessage('Unnable to add todo'),
      });
  }

  renameTodo(todo: Todo, title: string) {
    this.todoService.updateTodo({ ...todo, title })
      .subscribe({
        error: () => this.messageService.showMessage('Unnable to rename todo'),
      });
  }

  toggleTodo(todo: Todo) {
    this.todoService.updateTodo({ ...todo, completed: !todo.completed })
      .subscribe({
        error: () => this.messageService.showMessage('Unnable to toggle todo'),
      });
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo)
      .subscribe({
        error: () => this.messageService.showMessage('Unnable to delete todo'),
      });
  }

  clearCompleted() {
    this.completedTodos$.pipe(take(1)).subscribe(completedTodos => {
      completedTodos.forEach(todo => this.deleteTodo(todo));
    });
  }
}
