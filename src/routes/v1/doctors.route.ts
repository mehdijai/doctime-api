import { Request, Response, Router } from "express";

const DoctorsRoutes = Router();

DoctorsRoutes.post("/", (req: Request, res: Response) => {});
DoctorsRoutes.get("/:patientId", (req: Request, res: Response) => {});
DoctorsRoutes.get("/:patientId/:docId", (req: Request, res: Response) => {});
DoctorsRoutes.get("/me", (req: Request, res: Response) => {});
DoctorsRoutes.put("/:id", (req: Request, res: Response) => {});
DoctorsRoutes.delete("/:id", (req: Request, res: Response) => {});

export default DoctorsRoutes;
