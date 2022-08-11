interface IShiftTabletReviewProblemInputModel {
  id?: number;
  shiftTabletId?: number;
  roleTypeId?: number;
  description?: string;
  fileNumber?: string;
  programTitle?: string;
  clacketNo?: number;
  problemDescription?: string;
  reviewerCode?: string;
}
export class ShiftTabletReviewProblemInputModel
  implements IShiftTabletReviewProblemInputModel
{
  id: number;
  shiftTabletId: number;
  roleTypeId: number;
  description: string;
  fileNumber: string;
  programTitle: string;
  clacketNo: number;
  problemDescription: string;
  reviewerCode: string;

  constructor(params: IShiftTabletReviewProblemInputModel) {
    this.id = params.id || 0;
    this.shiftTabletId = params.shiftTabletId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.description = params.description || "";
    this.fileNumber = params.fileNumber || "";
    this.programTitle = params.programTitle || "";
    this.clacketNo = params.clacketNo || 0;
    this.problemDescription = params.problemDescription || "";
    this.reviewerCode = params.reviewerCode || "";
  }
}

interface IShiftTabletReviewProblemSearchModel {
  id?: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;

  shiftTabletId?: number;
  roleTypeId?: number;
  isDeleted?: boolean | null;
}
export class ShiftTabletReviewProblemSearchModel
  implements IShiftTabletReviewProblemSearchModel
{
  id: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  shiftTabletId: number;
  roleTypeId: number;
  isDeleted: boolean | null;

  constructor(params: IShiftTabletReviewProblemSearchModel) {
    this.id = params.id || 0;
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 2147483647; // Int32.MaxValue
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;

    this.shiftTabletId = params.shiftTabletId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IShiftTabletReviewProblemViewModel {
  id?: number;

  shiftTabletId?: number;
  roleTypeId?: number;
  description?: string;
  fileNumber?: string;
  programTitle?: string;
  problemDescription?: string;
  clacketNo?: number;
  reviewerCode?: string;
}
export class ShiftTabletReviewProblemViewModel
  implements IShiftTabletReviewProblemViewModel
{
  id: number;

  shiftTabletId: number;
  roleTypeId: number;
  description: string;
  fileNumber: string;
  programTitle: string;
  problemDescription: string;
  clacketNo: number;
  reviewerCode: string;

  constructor(params: IShiftTabletReviewProblemViewModel) {
    this.id = params.id || 0;

    this.shiftTabletId = params.shiftTabletId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.description = params.description || "";
    this.fileNumber = params.fileNumber || "";
    this.programTitle = params.programTitle || "";
    this.clacketNo = params.clacketNo || 0;
    this.problemDescription = params.problemDescription || "";
    this.reviewerCode = params.reviewerCode || "";
  }
}
