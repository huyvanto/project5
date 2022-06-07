import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { todoExists } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing Event: ", event)

    const todoId = event.pathParameters.todoId
    
    const userId = getUserId(event);
    const validTodoId = await todoExists(userId, todoId)

    if (!validTodoId) {
      logger.error("No todo found with id ", todoId)
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Todo item does not exist'
        })
      }
    }

    let url = await createAttachmentPresignedUrl(todoId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
