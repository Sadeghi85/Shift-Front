interface IShiftTypeViewModel {
  id: number;
  title: string;
}
export class ShiftTypeViewModel implements IShiftTypeViewModel {
  id: number;
  title: string;

  constructor(params: IShiftTypeViewModel) {
    this.id = params.id;
    this.title = params.title;
  }
}
