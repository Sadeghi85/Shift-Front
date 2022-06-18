export interface AgentViewModel {
  id: number;
  fullName: string;
}

export interface AgentSearchModel {
  id: number;
  firstName?: string;
  lastName?: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
}
