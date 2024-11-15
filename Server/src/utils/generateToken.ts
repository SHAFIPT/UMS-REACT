import jwt from 'jsonwebtoken'
const generateToken = (id :string) => {
    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    return jwt.sign({id},secret ,{expiresIn : '1h'});
}
export default generateToken;