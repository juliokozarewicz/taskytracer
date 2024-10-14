import { NextFunction, Request, Response } from 'express';
import { HelloWorldService } from '../c_services/HelloWorldService';


export class HelloWorldController {

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {

    try {

      const getMessage = (req.query.message as string) || 'Hello World!!!'; 
      const helloWorldService = new HelloWorldService();
      const message = await helloWorldService.execute(getMessage);
      res.json({ message });

    } catch (error) {
      
      next(error)

    }
  }

}