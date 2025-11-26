import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    key: {type: String, require: true},
    name: {type: String, require: true},
    founder: {type: String, require: true},
    year: {type: Number, require: true},
    address: {type: String, require: true},
});

// CompanySchema.methods.increaseSalary = salary => {
//     return salary += 0.2 * salary;
// }

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);