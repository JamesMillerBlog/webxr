import { NestFactory } from '@nestjs/core';
import { AppModule } from "app/app.module";
import { UserService } from "./user.service";
import { LambdaResponse, User } from '@shared/types';
import { UserDto } from './user.dto';

export const userService = async(): Promise<UserService> => {
    // try with the UserModule
    const app = await NestFactory.create(AppModule);
    return app.get(UserService);
}

interface GetParams {
    query: { uuid: string }
}

export const getHandler = async (event: GetParams ): Promise<LambdaResponse> => {
    const {findOne, findAll} = await userService();
    
    const uid = event.query.uuid;
    const data = uid ? await findOne({uid}) : await findAll();
    const body = JSON.stringify(data);
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body,
    };
};
  
interface UserData {
    query: { user: UserDto }
}

export const postHandler = async (event: UserData): Promise<LambdaResponse> => {
    const {create} = await userService();
    
    const user = event.query.user;
    const data = await create(user);
    const body = JSON.stringify(data);
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body,
    };
};

export const putHandler = async (event: UserData): Promise<LambdaResponse> => {
    const {update} = await userService();
    
    const user = event.query.user;
    const key = {uid: user.uid}
    const data = await update(key, user);
    const body = JSON.stringify(data);
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body,
    };
};
