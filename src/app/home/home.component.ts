import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../shared';
import { Http } from '@angular/http';
import { Observable, Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Node } from '../models';
import { TreeComponent, TreeNode } from 'angular-tree-component';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('treeView') treeView: TreeComponent;
  private nodes: Node[];
  private subscriptions: Subscription[] = [];
  private searchInput: string = "";

  private get treeOptions(): any {
    return {
      getChildren: (node: TreeNode) => {
        console.log(`finding the children of ${node.id}`);
        const modelNode = HomeComponent.findChildBfs(node.id, this.nodes);
        if (!modelNode) {
          console.log(`node ${node.id} not found in model with ${this.nodes.length} nodes`);
          return null;
        }
        console.log(`fetching: ${this.config.baseApiUrl}${this.config.nodesApiUrl}/${node.id}`);
        this.fetchChildren(node.id).subscribe(res => {
          if (!res || res.length === 0) {
            modelNode.hasChildren = false;
            modelNode.isExpanded = false;
            this.treeView.treeModel.update();
            return [];
          }
          modelNode.children = res;
          this.treeView.treeModel.update();
        });
        return modelNode.children;
      }
    };
  }

  // TODO: this should be moved to a tree model
  public static findChildBfs(id: string, queue: Node[]): Node {
    let cusins: Node[] = [];
    for (const item of queue) {
      if (item.id === id) {
        return item;
      } else {
        if (!item.children) {
          item.children = [];
        } else {
          cusins = cusins.concat(item.children);
        }
      }
    }
    console.log(`searching cusing with ${cusins.length} nodes`);
    if (cusins.length === 0) {
      return null;
    }
    return HomeComponent.findChildBfs(id, cusins);
  }



  constructor(private http: Http,
    private config: ConfigService) {
    //fetching root nodes
    this.fetchChildren(this.config.emptyGuid).subscribe(nodes => {
      this.nodes = nodes;
      this.treeView.treeModel.update();
      console.log("root nodes updated");
    }, error => {
      console.error(error);
    });
  }

  ngOnInit() {
  }

  private fetchChildren(parentId: string): Observable<Node[]> {
    const nodes: Node[] = [];
    return this.http.get(`${this.config.baseApiUrl}${this.config.nodesApiUrl}/${parentId}`).map(res => {
      console.log(res.json());
      const body: any = res.json();
      for (const item of body) {
        // const node: Node = new Node();
        // node.content = item.content;
        // node.gistUrl = item.gistUrl;
        // node.id = item.id;
        // node.title = item.title;
        item.hasChildren = true;
        const node: Node = <Node>item;
        nodes.push(node);
      }
      console.log(nodes);
      return nodes;
    }).catch(error => {
      console.error(error);
      return Observable.empty();
    });
  }

  ngOnDestroy() {
    for (const item of this.subscriptions) {
      if (item) {
        item.unsubscribe();
      }
    }
  }

  private newNode() {
    console.log(this.treeView.options);
    const newNode = new Node();
    newNode.title = "new node";
    this.http.post(`${this.config.baseApiUrl}${this.config.nodesApiUrl}`,
      {
        title: newNode.title,
      }).subscribe(res => {
        console.log(res);
        if (res.status === 201) {
          // TODO: just add the added item in th list instead of fetching all nodes
          this.nodes.push(newNode);
          this.treeView.treeModel.update();
        }
      });
  }

}
