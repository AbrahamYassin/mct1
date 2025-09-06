import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.mjs'
import Cv from '../models/Cv.mjs'
import bcrypt from 'bcryptjs'

await mongoose.connect(process.env.MONGODB_URI)
const email = 'demo@mycvtop.com'
let user = await User.findOne({ email })
if (!user) user = await User.create({ name: 'Demo User', email, passwordHash: await bcrypt.hash('demo1234', 10) })
const sample = await Cv.create({
  userId: user._id,
  personal: { fullName: 'Yassin Brahim', title:'Contrôleur de gestion', email:'yassin@example.com', phone:'+212 6 12 34 56 78', location:'Oujda, Maroc', summary:'Contrôleur de gestion orienté résultats.' },
  skills: ['Gestion budgétaire', 'SQL', 'PHP', 'React', 'Excel avancé'],
  languages: ['Arabe', 'Français', 'Anglais'],
  experiences: [{ title:'Contrôleur de gestion', company:'Enabel', startDate:'2023', endDate:'Présent', description:'Suivi, dashboards, automatisation.' }],
  education: [{ degree:'Master Finance', school:'UMI', startDate:'2019', endDate:'2021', description:'Contrôle de gestion et audit.' }],
  projects: [{ name:'DigiCard+', link:'https://digicardplus.com', description:'Cartes de visite numériques & CRM.' }],
  template: 'modern', themeColor:'#2563eb'
})
console.log('Seed OK', sample._id.toString())
await mongoose.disconnect()
