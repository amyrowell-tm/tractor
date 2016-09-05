// Dependencies:
import fileStructure from '../file-structure';
import getFileStructure from './get-file-structure';

// Errors:
import { errorHandler, TractorError } from 'tractor-error-handler';

export default { handler };

function handler (request, response) {
    let { path } = request.query;

    return fileStructure.deleteItem(path)
    .then(() => getFileStructure.handler(request, response))
    .catch(TractorError, error => errorHandler.handler(response, error))
    .catch(() => errorHandler.handler(response, new TractorError(`Could not delete "${path}"`)));
}
