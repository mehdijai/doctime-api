import { Request, Response, Router } from "express";

const PatientsRoutes = Router();

PatientsRoutes.post("/", (req: Request, res: Response) => {});
PatientsRoutes.get("/:docId", (req: Request, res: Response) => {});
PatientsRoutes.get("/:docId/:patientId", (req: Request, res: Response) => {});
PatientsRoutes.get("/me", (req: Request, res: Response) => {});
PatientsRoutes.put("/:id", (req: Request, res: Response) => {});
PatientsRoutes.delete("/:id", (req: Request, res: Response) => {});

export default PatientsRoutes;
