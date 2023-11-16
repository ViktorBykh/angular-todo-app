import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoComponent } from './components/todo/todo.component';
import { MessageComponent } from './components/message/message.component';
import { RouterModule, Routes } from '@angular/router';
import { TodosPageComponent } from './components/todos-page/todos-page.component';
import { FilterComponent } from './components/filter/filter.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
 
const routes: Routes = [
  { path: 'todos/:status',component: TodosPageComponent },
  { path: '**', redirectTo: '/todos/all', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    MessageComponent,
    TodosPageComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
