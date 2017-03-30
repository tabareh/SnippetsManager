import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../shared';
import { Http } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
import { Node } from '../models';
import { TreeComponent } from 'angular-tree-component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('treeView') treeView: TreeComponent;
  private nodes: any[] = [];
  private subscriptions: Subscription[] = [];
  constructor(private http: Http,
    private config: ConfigService) {
    this.subscriptions.push(this.fetchNodes());

  }

  ngOnInit() {
  }

  private fetchNodes(): Subscription {
    var nodes: any[] = [];
    return this.http.get(`${this.config.baseApiUrl}/api/nodes`).subscribe(res => {
      console.log(res.json());
      const body: any = res.json();
      let i = 0;
      for (const item of body) {
        const node: Node = <Node>{
          'id': item.id,
          'title': item.title,
          'name': item.title,
          'content': item.content,
          'gistUrl': item.gistUrl
        };
        nodes.push(node);
        this.nodes = nodes;
        i++;
      }
      console.log(this.nodes);
    });
  }


  OnDestroy() {
    for (let item of this.subscriptions) {
      item.unsubscribe();
    }
  }

}
