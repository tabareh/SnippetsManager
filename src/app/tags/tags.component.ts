import { Component, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { Tag } from '../models';
import { Observable, Subscription } from 'rxjs';
import { ConfigService } from '../shared';
import { FormControl, NgModel } from '@angular/forms';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnDestroy{

  private tags: Tag[] = [];
  private searchInput: string = "";
  private subscriptions: Subscription[] = [];

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

  public fetchTags(): Subscription {
    this.tags = [];
    return this.http.get(`${this.config.baseApiUrl}${this.config.tagsApiUrl}`).subscribe(res => {
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
    this.http.post(`${this.config.baseApiUrl}${this.config.tagsApiUrl}`, { name: this.searchInput }).subscribe(res => {
      console.log(res);
      if (res.status === 201) {
        // TODO: just add the added item in th list instead of fetching all tags
      }
      this.fetchTags();
    });
  }

  public removeTag(id: number) {
    this.http.delete(`${this.config.baseApiUrl}${this.config.tagsApiUrl}/${id}`).subscribe(res => {
      console.log(res);
      if (res.status === 204) {
        let i = this.tags.indexOf(this.tags.filter(t => t.id === id)[0]);
        this.tags.splice(i, 1);

      }
    });
  }

  public updateTag(id: number, tagTitleInput: NgModel) {
    const tag: Tag = this.tags.filter(t => t.id === id)[0];
    // console.log('updating ' + JSON.stringify(tag));
    // console.log('all tags after:' + JSON.stringify(this.tags));
    this.http.put(`${this.config.baseApiUrl}${this.config.tagsApiUrl}/${id}`, tag).subscribe(res => {
      console.log(res);
      console.log(tagTitleInput);
      if (res.status === 204) {
        tagTitleInput.control.markAsPristine();
      }
    });
  }

  ngOnDestroy() {
    for (const item of this.subscriptions) {
        item.unsubscribe();
    }
  }

}
