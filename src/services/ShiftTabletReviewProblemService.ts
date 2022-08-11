import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletReviewProblemViewModel,
  ShiftTabletReviewProblemSearchModel,
  ShiftTabletReviewProblemInputModel,
} from "@/models/ShiftTabletReviewProblemModels";

export class ShiftTabletReviewProblemService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: ShiftTabletReviewProblemSearchModel) {
    return this.api
      .post<IApiResponseModel<ShiftTabletReviewProblemViewModel>>(
        "/ShiftTabletReviewProblem/GetAll",
        body
      )
      .then((response) => {
        if (response.data.success == false) {
          throw {
            message: response.data,
          };
        }

        return response.data;
      });
  }

  public create(body: ShiftTabletReviewProblemInputModel) {
    return this.api.post("/ShiftTabletReviewProblem/Create", body);
  }

  public update(body: ShiftTabletReviewProblemInputModel) {
    return this.api.post("/ShiftTabletReviewProblem/Update", body);
  }

  public deleteMultiple(ids: number[] | string) {
    if (typeof ids === "string") {
      return this.api.post(
        "/ShiftTabletReviewProblem/DeleteMultiple?ids=" + ids,
        null
      );
    } else {
      return this.api.post(
        "/ShiftTabletReviewProblem/DeleteMultiple?ids=" + JSON.stringify(ids),
        null
      );
    }
  }

  public delete(id: number) {
    return this.api.post("/ShiftTabletReviewProblem/Delete?id=" + id, null);
  }
}
