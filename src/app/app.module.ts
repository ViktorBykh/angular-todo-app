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

const routes: Routes = [
  { path: 'todos', component: TodosPageComponent },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(module => module.AboutModule)
  },
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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
