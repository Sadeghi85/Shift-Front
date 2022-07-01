export interface AgentViewModel {
  id: number;
  fullName: string;
}

export interface AgentSearchModel {
  id: number;
  name: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
}
