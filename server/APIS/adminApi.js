const exp = require('express');
const adminApp = exp.Router();
const userAuthor = require('../MODELS/userAuthorModel');
const createUserOrAuthor = require('../createUserOrAuthor');
const expressAsyncHandler = require("express-async-handler");
const { requireAuth } = require('@clerk/express');
require('dotenv').config();

adminApp.get("/users",expressAsyncHandler(async (req, res) => {
    const users = await userAuthor.find({});
    res.status(200).send({ message: "Users fetched", payload: users});
}));

adminApp.get("/articles",requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    const listOfArticles = await Article.find({isArticleActive:true});
    console.log(listOfArticles);
    res.status(200).send({message:"articles",payload:listOfArticles})
}))

adminApp.put("/users/:userId/delete", expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Deactivate user
    const updatedUser = await userAuthor.findByIdAndUpdate(
        userId,
        { isActive: false },
        { returnOriginal: false }
    );

    if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
    }

    // Soft delete all related articles
    await articleCollection.updateMany(
        { "authorData.authorId": userId },
        { $set: { isArticleActive: false } }
    );

    res.status(200).send({ message: "User and related articles deactivated", payload: updatedUser });
}));

adminApp.put("/users/:userId/restore", expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Reactivate user
    const updatedUser = await userAuthor.findByIdAndUpdate(
        userId,
        { isActive: true },
        { returnOriginal: false }
    );

    if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
    }

    // Reactivate all related articles
    await articleCollection.updateMany(
        { "authorData.authorId": userId },
        { $set: { isArticleActive: true } }
    );

    res.status(200).send({ message: "User and related articles restored", payload: updatedUser });
}));


adminApp.get("/unauthorized", (req, res) => {
    res.send({ message: "Unauthorized request... Please login" });
});

adminApp.put("/unauthorized", (req, res) => {
    res.send({ message: "Unauthorized request... Please login" });
});

module.exports = adminApp;