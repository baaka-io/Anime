import app from "../app"
import request from "supertest"

const baseUrl = "/healthCheck"

describe(`${baseUrl}`, () => {
	test(`GET`, done => 
		request(app)
			.get(baseUrl)
			.expect(200, done)
	)
})

