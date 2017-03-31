import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  public baseApiUrl = 'http://localhost:64847';
  public nodesApiUrl = '/api/nodes';
  public tagsApiUrl = '/api/tags';
  public emptyGuid = "00000000-0000-0000-0000-000000000000";
  constructor() {
  }

}
