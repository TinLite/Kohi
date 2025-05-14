import { User } from "./user-type";

export class Report {
  _id: string;
  userId: User;
  type: "post" | "comment";
  targetId: string;
  reason: string;
  timeStamp: Date;
  handleResult?: "arroved" | "reject";
  handleBy?: string;
  handleReason?: string;
  handled: boolean = false;
  constructor(
    _id: string,
    userId: User,
    type: "post" | "comment",
    targetId: string,
    reason: string,
    timeStamp: Date,
    handleResult?: "arroved" | "reject",
    handleBy?: string,
    handleReason?: string,
    handled: boolean = false
  ) {
    this._id = _id;
    this.userId = userId;
    this.type = type;
    this.targetId = targetId;
    this.reason = reason;
    this.timeStamp = timeStamp;
    this.handleResult = handleResult;
    this.handleBy = handleBy;
    this.handleReason = handleReason;
    this.handled = handled;
  }
}
