import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

import { createLogger } from '../../utils/logger'

const logger = createLogger('GetTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("processing event: ", event)
    const userId = getUserId(event);
    const items = await getTodosForUser(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })

handler.use(
    cors({
      credentials: true
    })
)
