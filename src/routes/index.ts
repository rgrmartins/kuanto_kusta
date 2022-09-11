import { Router } from 'express'

import api from './api'
import health from './health'

const router = Router()

router.use('/api', api)
router.use(health)

export default router
