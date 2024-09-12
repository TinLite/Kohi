export class User {
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    constructor(_id: string, username: string, displayName?: string, avatar?: string, bio?: string) {
        this._id = _id;
        this.username = username;
        this.displayName = displayName;
        this.avatar = avatar;
        this.bio = bio;
    }
}