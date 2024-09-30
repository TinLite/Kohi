
export class User {
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    following?: string[];
    followers?: string[];
    bookmarks?: string[];
    createAt?: Date;
    sdt?: string;
    email?: string;
    constructor(_id: string, username: string, displayName?: string, avatar?: string, bio?: string, following?: string[], followers?: string[], bookmarks?: string[], createAt?: Date, sdt?: string,email?: string) {
        this._id = _id;
        this.username = username;
        this.displayName = displayName;
        this.avatar = avatar;
        this.bio = bio;
        this.following = following;
        this.followers = followers;
        this.bookmarks = bookmarks;
        this.createAt = createAt;
        this.sdt = sdt;
        this.email = email;
    }
}