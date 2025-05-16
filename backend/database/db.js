import mongoose from "mongoose";
const connectToDB = async () => {


    const MONGO_URI = process.env.MONGO_URL
    try {

        await mongoose.connect(`${MONGO_URI}`)
        console.log("Databse Connected")



    } catch (error) {
        console.log("Error in connecting Database", error)
    }


}
export default connectToDB