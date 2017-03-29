import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from './shared';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagsComponent } from './tags/tags.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const ROUTES = [
  { path: '', component: HomeComponent },
  { path: 'tags', component: TagsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TagsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
