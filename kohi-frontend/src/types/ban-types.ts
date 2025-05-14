export class Ban {
  _id: string;
  userId: string;
  isActive: boolean = true;
   types: "account" | "post" | "comment";
  reason: string = "ban";
  createdAt: Date = new Date();
  expiresAt?: Date;
  banBy: string;
  unbanReason?: string; 
  unbanBy?: string;
  constructor(
    _id: string,
    userId: string,
    isActive: boolean,
    types: string,
    reason: string,
    createdAt: Date,
    expiresAt: Date,
    banBy: string,
    unbanReason?: string,
    unbanBy?: string
  ) {
    this._id = _id;
    this.userId = userId;
    this.isActive = isActive;
    this.types = types as "account" | "post" | "comment";
    this.reason = reason;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
    this.banBy = banBy;
    this.unbanReason = unbanReason;
    this.unbanBy = unbanBy;
  }
}
