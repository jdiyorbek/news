const express = require("express")
const app = express()
const expressEdge = require("express-edge")
const mongoose = require("mongoose")
const ArticleModel = require("./models/article")
const AdModel = require("./models/ad")
const AdminModel = require("./models/admin")
const security = require("./security/data")
const expressSession = require("express-session")


// const MongoUrl = "mongodb+srv://jdiyorbek:rosALPrR8ji63w25@cluster0.h2d06qj.mongodb.net/node-blog"


const MongoUrl = "mongodb+srv://Admin:adminjon@sam24.oipdrdw.mongodb.net/Sam24"
mongoose.connect(MongoUrl)
mongoose.connection.on("connected", () => {
    console.log("MongoDB connected succesfully");
})

app.use(express.static("public"))
app.use(expressEdge.engine)
app.set("views", `${__dirname}/views`)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressSession({
    secret: "jdiyorbek",
}))




app.get("/", async(req, res) => {
    const lastArticles = await ArticleModel.find({}, [], {
        limit: 6
    }).sort({ date: -1 })
    const popularArticles = await ArticleModel.find({}, [], {
        limit: 6
    }).sort({ view: -1 })
    res.render("index", { lastArticles, popularArticles })
})

app.get("/economy", async(req, res) => {
    const articles = await ArticleModel.find({
        type: "economy"
    }, [])
    res.render("posts", { articles })
})

app.get("/sport", async(req, res) => {
    const articles = await ArticleModel.find({
        type: "sport"
    }, [])
    res.render("posts", { articles })
})

app.get("/policy", async(req, res) => {
    const articles = await ArticleModel.find({
        type: "policy"
    }, [])
    res.render("posts", { articles })
})

app.get("/article", (req, res) => {
    res.redirect("/")
})

app.get("/article/:id", async(req, res) => {
    const article = await ArticleModel.findById(req.params.id)
    res.render("article", { article })
    await ArticleModel.findByIdAndUpdate(req.params.id, {
        view: article.view + 1
    })
})

app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/admin", async(req, res) => {
    const adminData = await AdminModel.findOne()
    console.log(req.session)
    if (req.session.userID == adminData._id) {
        res.redirect("/admin/dashboard")
    } else {
        res.render("admin")
    }
})

app.post("/admin", async(req, res) => {
    const adminData = await AdminModel.findOne()
    if (adminData.login == req.body.login && adminData.password == req.body.password) {
        req.session.userID = adminData.id
        res.redirect("/admin/dashboard")
    } else {
        res.redirect("/")
    }

})

app.get("/admin/dashboard", async(req, res) => {
    const adminData = await AdminModel.findOne()
    if (req.session.userID == adminData._id) {
        res.render("dashboard")
    } else {
        res.redirect("/admin")
    }
})

app.get("/admin/add-ads", async(req, res) => {
    const adminData = await AdminModel.findOne()
    if (req.session.userID == adminData._id) {
        res.render("addAds")
    } else {
        res.redirect("/admin")
    }

})

app.post("/admin/add-ads", async(req, res) => {
    const adminData = await AdminModel.findOne()
    if (req.session.userID == adminData._id) {
        AdModel.create({
            url: req.body.url,
            view: req.body.view
        })
        res.redirect("/")
    } else {
        res.redirect("/admin")
    }
})

app.get("/admin/create-article", async(req, res) => {
    const adminData = await AdminModel.findOne()
    if (req.session.userID == adminData._id) {
        res.render("createPost")
    } else {
        res.redirect("/admin")
    }

})

app.post("/admin/create-article", async(req, res) => {
    const adminData = await AdminModel.findOne()
    if (req.session.userID == adminData._id) {
        ArticleModel.create({
            title: req.body.title,
            description: req.body.text.slice(0, 200),
            text: req.body.text,
            type: req.body.type,
            view: 0,
            date: Date.now()
        })
        res.redirect("/")
    } else {
        res.redirect("/admin")
    }
})

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin")
    })

})

app.use((req, res) => {
    res.render("404")
})

app.listen(5000, () => {
    console.log("Server ishga tushdi...");
})