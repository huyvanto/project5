import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import * as attachmentUtils from '../fileStorage/attachmentUtils'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger('TodosAccess')

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
    ) {}

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info("Start get todos");

        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        logger.info("End get todos");

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        logger.info("Start create todo");

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        logger.info("End create todo");

        return todoItem
    }

    async updateTodo(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
        logger.info("Start update todo");

        var params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: "set #n = :r, dueDate=:p, done=:a",
            ExpressionAttributeValues: {
                ":r": todoUpdate.name,
                ":p": todoUpdate.dueDate,
                ":a": todoUpdate.done
            },
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ReturnValues: "UPDATED_NEW"
        };
        await this.docClient.update(params).promise()

        logger.info("End update todo");

        return todoUpdate

    }

    async deleteTodo(userId: string, todoId: string): Promise<String> {
        logger.info("Start Delete todo");

        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }).promise()

        logger.info("End delete todo");

        return "" as string;

    }

    async todoExists(userId: string, todoId: string) {

        const result = await this.docClient
            .get({
                TableName: this.todosTable,
                Key: {
                    userId: userId,
                    todoId: todoId
                }
            })
            .promise()

        return result.Item
    }

    async generateUploadUrl(todoId: string): Promise<String> {
        return attachmentUtils.generateUploadUrl(todoId);
    }
}