// Utilities:
import { getItemPath, respondOkay, respondItemNotFound } from '../utilities/utilities';

// Dependencies:
import Directory from '../structure/Directory';

// Errors:
import tractorErrorHandler from 'tractor-error-handler';
import { TractorError } from 'tractor-error-handler';

export function createDeleteItemHandler (fileStructure) {
    return function deleteItem (request, response) {
        let { cleanup, rimraf } = request.query;
        let itemUrl = request.params[0];
        let itemPath = getItemPath(fileStructure, itemUrl);

        let toDelete = fileStructure.allFilesByPath[itemPath] || fileStructure.allDirectoriesByPath[itemPath];
        if (!toDelete) {
            return respondItemNotFound(itemPath, response);
        }

        let operation;
        if (rimraf && toDelete instanceof Directory) {
            operation = toDelete.rimraf();
        } else if (cleanup) {
            operation = toDelete.cleanup();
        } else {
            operation = toDelete.delete();
        }

        return operation
        .then(() => respondOkay(response))
        .catch(TractorError.isTractorError, error => tractorErrorHandler.handle(response, error))
        .catch(() => tractorErrorHandler.handle(response, new TractorError(`Could not delete "${itemPath}"`)));
    }
}
