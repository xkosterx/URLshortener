import { Router, Request } from 'express';
import {LinkType} from "../models/Link";
import {UserType} from "../models/User";
import {AuthReqBody} from "../middleware/auth.middleware";
const Link = require("../models/Link");
const auth = require("../middleware/auth.middleware");
const config = require("config");
const shortid = require("shortid");
const router = Router();


router.post("/generate", auth, async (req:AuthReqBody & Request, res) => {
  try {
    const baseUrl:string = config.get("baseUrl");
    const { from }:LinkType = req.body;

    const code:string = shortid.generate();

    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({ link: existing });
    }

    const to = `${baseUrl}/t/${code}`;

    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId,
    });

    await link.save();

    res.status(201).json({ link });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", auth, async (req:AuthReqBody & Request, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const links:Array<LinkType> = await Link.findById(req.params.id);
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
