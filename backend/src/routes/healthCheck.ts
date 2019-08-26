import { Router } from "express"

const router = Router()
	.get("/", async (_, res) => {
		res.status(200).end()
	})

export default router
