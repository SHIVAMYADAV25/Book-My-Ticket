import bcrypt from "bcrypt"


const hashPassword = async (password) =>{
    return await bcrypt.hash(password, 12);
}

const comparePassword = async (candidatePassword,password) =>{
    return await bcrypt.compare(candidatePassword, password);
}

export {
    hashPassword,
    comparePassword
}