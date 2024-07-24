import { Request, Response, Router } from "express";

const AppointmentsRoutes = Router();

AppointmentsRoutes.post("/", (req: Request, res: Response) => {});
AppointmentsRoutes.get("/", (req: Request, res: Response) => {});
AppointmentsRoutes.get("/:id", (req: Request, res: Response) => {});
AppointmentsRoutes.put("/:id", (req: Request, res: Response) => {});
AppointmentsRoutes.delete("/:id", (req: Request, res: Response) => {});

export default AppointmentsRoutes;
