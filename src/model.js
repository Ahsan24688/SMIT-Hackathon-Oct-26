import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    id: { type: Number, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'HR', 'Employee'], default: 'Employee' }
},

    {
        timestamps: true
    }
)

const usermodel = mongoose.model("user", userschema);


const settingSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    officeStartTime: { type: String, default: "09:00" },
    graceTimeMinutes: { type: Number, default: 15 },
    weekendDays: { type: [String], default: ["Saturday", "Sunday"] },
    officeLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        radiusMeters: { type: Number, default: 150 }
    }
}, { timestamps: true });
const SettingModel = mongoose.model("Setting", settingSchema);



const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    designations: { type: [String], required: true }
}, { timestamps: true });
const DepartmentModel = mongoose.model("Department", departmentSchema);



const EmployeeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
})

export { usermodel, SettingModel, DepartmentModel };
export default usermodel;