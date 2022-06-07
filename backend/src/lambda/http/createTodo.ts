import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing Event ", event);

    const userId = getUserId(event);
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const todoItem = await createTodo(newTodo, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({item: todoItem})
    }
  })

  handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
