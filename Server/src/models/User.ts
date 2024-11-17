import mongoose , {Document ,Schema} from "mongoose";
// import bcryptjs from "bcryptjs";

interface IUser extends Document {
    name : string;
    email : string;
    password : string;
    isAdmin : boolean;
    image: string;
}

export interface IUserDocument extends IUser , Document {
    _id : mongoose.Types.ObjectId;
}

const userSchema:Schema<IUserDocument> = new mongoose.Schema({
    name  : {type : String , required : true}, 
    email  : {type : String , required : true , unique : true}, 
    password  : {type : String , required : true},
    isAdmin : {type : Boolean ,default : false},
    image : {type : String}
})

const User = mongoose.model<IUserDocument>("User", userSchema);
export default User