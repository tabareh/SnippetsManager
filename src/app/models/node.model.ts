export class Node {
    public id: string;
    public title: string;
    public content: string;
    public gistUrl: string;
    public isExpanded = false;
    public hasChildren = true;
    public children: Node[] = [];
    
}
