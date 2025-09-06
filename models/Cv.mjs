import mongoose from 'mongoose'
const sectionOpts = { _id: false }
const experienceSchema = new mongoose.Schema({ title:String, company:String, startDate:String, endDate:String, description:String }, sectionOpts)
const educationSchema = new mongoose.Schema({ degree:String, school:String, startDate:String, endDate:String, description:String }, sectionOpts)
const projectSchema = new mongoose.Schema({ name:String, link:String, description:String }, sectionOpts)

const CvSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personal: { fullName:String, title:String, email:String, phone:String, location:String, summary:String, avatarUrl:String },
  skills: [String],
  languages: [String],
  experiences: [experienceSchema],
  education: [educationSchema],
  projects: [projectSchema],
  template: { type: String, enum: ['basic','modern','clean'], default: 'modern' },
  themeColor: { type: String, default: '#2563eb' }
}, { timestamps: true })

export default mongoose.models.Cv || mongoose.model('Cv', CvSchema)
