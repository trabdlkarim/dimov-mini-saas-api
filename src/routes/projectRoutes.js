import express from "express";
import controller from "../controllers/projectController.js";

const router = express.Router();

router.get("/", controller.listProjects);
router.post("/", controller.createProject);

router.get("/search", controller.searchProjects);

router.get("/filter", controller.filterProjects);

router.get("/:id", controller.getProject);
router.put("/:id", controller.updateProject);
router.delete("/:id", controller.deleteProject);

export default router;