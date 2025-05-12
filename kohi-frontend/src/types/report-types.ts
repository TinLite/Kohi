export class Report {
  _id: string;
  userId: string;
  type: "post" | "comment";
  targetId: string;
  reason: string;
  timeStamp: Date;

  constructor(
    _id: string,
    userId: string,
    type: "post" | "comment",
    targetId: string,
    reason: string,
    timeStamp: Date
  ) {
    this._id = _id;
    this.userId = userId;
    this.type = type;
    this.targetId = targetId;
    this.reason = reason;
    this.timeStamp = timeStamp;
  }
}
