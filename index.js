//database
const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  completed: Boolean,
  created_at: { type: Date, default: Date.now },
})

const Project = mongoose.model("Project", ProjectSchema)

//=======================================================
//admin bro
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

//use mongoose in adminbro
AdminBro.registerAdapter(AdminBroMongoose)

//config
const adminBro = new AdminBro({
  resources: [{
    resource: Project,
    options: {
      properties: {
        description: { type: 'richtext' },
        created_at: {
          isVisible: {
            edit: false, list: true, show: true,
            filter: true
          }
        }
      }
    }
  }],
  locale: {
    translations: {
      labels: {
        Project: 'Meus projetos'
      }
    }
  },
  rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(adminBro)

//=======================================================
//server
const express = require('express')
const app = express()

app.use(adminBro.options.rootPath, router)

const run = async () => {
  await mongoose.connect("mongodb+srv://adminjeff:jeffadmin@cluster0.lhanz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  await app.listen(8088, () => console.log('AdminBro is under localhost:8088/admin'))
}

run()
