import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuid } from 'uuid';

async function createAuction(event) {
  const now = new Date();
  const db = new DynamoDBClient({});
  const response = { statusCode: 201 };

  try {
    const { title } = JSON.parse(event.body);
    const auction = {
      id: uuid(),
      title,
      status: 'OPEN',
      createdAt: now.toISOString(),
    };
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(auction || {}),
    };
    const createResult = await db.send(new PutItemCommand(params));
    response.body = JSON.stringify({
      message: 'sucess',
      data: createResult,
    });
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: 'Could not create the item',
      error: error.message,
      errorStack: error.stack,
    });
  }

  return response;
}

export const handler = createAuction;
