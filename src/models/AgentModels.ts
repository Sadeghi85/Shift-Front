interface IAgentViewModel {
  id?: number;
  fullName?: string;
}
export class AgentViewModel implements IAgentViewModel {
  id: number;
  fullName: string;

  constructor(params: IAgentViewModel) {
    this.id = params.id || 0;
    this.fullName = params.fullName || "";
  }
}

interface IAgentSearchModel {
  id?: number;
  name?: string;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
}
export class AgentSearchModel implements IAgentSearchModel {
  id: number;
  name: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  constructor(params: IAgentSearchModel) {
    this.id = params.id || 0;
    this.name = params.name || "";
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 10;
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
  }
}
