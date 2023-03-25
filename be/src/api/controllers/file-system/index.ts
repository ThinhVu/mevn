import Router from "routerex";
import file from "./file";
import folder from "./folder";

const router = Router();

router.use('/file', file);
router.use('/folder', folder);

export default router;
