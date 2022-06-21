import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { getWeatherInfo } from '../../weatherInfor/weatherInfo'

import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateTodo')
const middy = require('middy')


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing Event ", event);

    const newTodo: CreateTodoRequest = JSON.parse(event.body);

    const location = newTodo.location;

    const name = newTodo.name;

    const weatherJson = await getWeatherInfo(location)

    const dayTemp = fToC(weatherJson.DailyForecasts[2].Temperature.Maximum.Value);

    const nightTemp = fToC(weatherJson.DailyForecasts[2].Temperature.Minimum.Value);

    const dayForecast = weatherJson.DailyForecasts[2].Day.IconPhrase

    const nightForecast = weatherJson.DailyForecasts[2].Night.IconPhrase

    const userId = getUserId(event);
    
    const todoItem = await createTodo(location, name, dayTemp, nightTemp, dayForecast, nightForecast, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({item: todoItem})
    }
  })

  function fToC(f) {
    return Math.round((f - 32) * 5 / 9);
  }

  handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
