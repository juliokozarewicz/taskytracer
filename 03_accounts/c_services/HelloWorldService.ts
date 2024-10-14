import { StandardResponse } from "../f_utils/StandardResponse";

export class HelloWorldService {

    async execute(message: string): Promise<StandardResponse> {

        return {
            "status": 'success',
            "code": 200,
            "message": `${message}`,
            "links": {
                "self": '/helloworld/helloworld',
            }
        }
    }

}