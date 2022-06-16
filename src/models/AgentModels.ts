export interface AgentInputModel {
  id: number;
  firstName: string;
  lastName: string;

  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
}

export interface AgentViewModel {
  id: number;
  fullName: string;
}
