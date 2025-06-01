const exp = require('express');
const adminApp = exp.Router();
const userAuthor = require('../MODELS/userAuthorModel');
const createUserOrAuthor = require('../createUserOrAuthor');
const expressAsyncHandler = require("express-async-handler");
const Article = require('../MODELS/articleModel');
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
    await Article.updateMany(
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
    await Article.updateMany(
        { "authorData.authorId": userId },
        { $set: { isArticleActive: true } }
    );

    res.status(200).send({ message: "User and related articles restored", payload: updatedUser });
}));

// counts
adminApp.get("/user-counts", expressAsyncHandler(async (req, res) => {
    const usersCount = await userAuthor.countDocuments({ role: 'user' });
    const authorsCount = await userAuthor.countDocuments({ role: 'author' });
    const totalArticles = await Article.countDocuments({ isArticleActive: true });

    res.status(200).send({
        users: usersCount,
        authors: authorsCount,
        articles: totalArticles
    });
}));

// make admin 
adminApp.post("/make-admin", requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const currentAdminEmail = req.auth.user.email;

    // 1. Promote the target user to admin
    const promotedUser = await userAuthor.findOneAndUpdate(
        { email },
        { role: 'admin' },
        { new: true }
    );

    if (!promotedUser) {
        return res.status(404).send({ message: "Target user not found" });
    }

    // 2. Delete the current admin from the DB
    const deletedSelf = await userAuthor.findOneAndDelete({ email: currentAdminEmail });

    if (!deletedSelf) {
        return res.status(500).send({ message: "Promoted user, but failed to delete current admin" });
    }

    res.status(200).send({
        message: "Admin role assigned to new user. Current admin deleted successfully.",
        payload: promotedUser
    });
}));



adminApp.get("/unauthorized", (req, res) => {
    res.status(200).send({ message: "unauthorised request ... plz login", payload: updatedUser });
});

adminApp.put("/unauthorized", (req, res) => {
    res.status(200).send({ message: "unauthorised request ... plz login", payload: updatedUser });
});

module.exports = adminApp;