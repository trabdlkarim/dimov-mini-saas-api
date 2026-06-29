import express from "express";
import controller from "../controllers/teamController.js";

const router = express.Router();

router.get("/", controller.listTeams);
router.post("/", controller.createTeam);

router.get("/:id", controller.getTeam);
router.put("/:id", controller.updateTeam);
router.delete("/:id", controller.deleteTeam);

router.post("/:id/leave", controller.leaveTeam);
router.post("/:id/join", controller.joinTeam);


export default router;