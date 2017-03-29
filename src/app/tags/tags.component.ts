import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Tag } from '../models';
import { Observable } from 'rxjs';
import { ConfigService } from '../shared';
import { FormControl, NgModel } from '@angular/forms';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent {

  private tags: Tag[] = [];
  private searchInput: string = "";

  private get filteredTags(): Tag[] {
    if (!this.searchInput) {
      return this.tags;
    }
    return this.tags.filter(t => {
      if (t.name) {
        return t.name.toLowerCase().includes(this.searchInput.toLocaleLowerCase());
      } else {
        console.log(t);
        return false;
      }
    });

  }

  constructor(private http: Http,
    private config: ConfigService) {
    this.fetchTags();
  }

  public fetchTags(): void {
    this.tags = [];
    this.http.get(`${this.config.baseApiUrl}/api/tags`).subscribe(res => {
      console.log(res);
      const body: any = res.json();
      for (const item of body) {
        const tag: Tag = <Tag>item;
        this.tags.push(tag);
      }
      console.log(this.tags);
    });
  }

  public addTag() {
    this.http.post(`${this.config.baseApiUrl}/api/tags`, { name: this.searchInput }).subscribe(res => {
      console.log(res);
      this.fetchTags();
    });
  }

  public removeTag(id: number) {
    this.http.delete(`${this.config.baseApiUrl}/api/tags/${id}`).subscribe(res => {
      console.log(res);
      this.fetchTags();
    });
  }

  public updateTag(id: number, tagTitleInput: NgModel) {
    const tag: Tag = this.tags.filter(t => t.id === id)[0];
    // console.log('updating ' + JSON.stringify(tag));
    // console.log('all tags after:' + JSON.stringify(this.tags));
    this.http.put(`${this.config.baseApiUrl}/api/tags/${id}`, tag).subscribe(res => {
      console.log(res);
      console.log(tagTitleInput);
      tagTitleInput.control.markAsPristine();
    });
  }

}
