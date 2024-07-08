
const { Router } =require ("express");
const { contactUs, stats } =require ("../controllers/miscellaneousController.js");
const { authorizedRoles, isLoggedIn }=require ("../middlewares/authMiddleware.js");

const router = Router();

router.post("/contact", contactUs);

router.get("/admin/stats/users", isLoggedIn, authorizedRoles("ADMIN"), stats);

module.exports= router;
