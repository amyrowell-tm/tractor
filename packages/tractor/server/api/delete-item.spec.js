/* global describe:true, it:true */
'use strict';

// Utilities:
import chai from 'chai';
import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import errorHandler from '../errors/error-handler';
import fileStructure from '../file-structure';
import getFileStructure from './get-file-structure';
import TractorError from '../errors/TractorError';

// Under test:
import deleteItem from './delete-item';

describe('server/api: delete-item:', () => {
    it('should delete a item', () => {
        let path = 'some/path';
        let request = {
            query: { path }
        };

        sinon.stub(fileStructure, 'deleteItem').returns(Promise.resolve());
        sinon.stub(getFileStructure, 'handler').returns(Promise.resolve());

        return deleteItem.handler(request)
        .then(() => {
            expect(fileStructure.deleteItem).to.have.been.calledWith(path);
        })
        .finally(() => {
            fileStructure.deleteItem.restore();
            getFileStructure.handler.restore();
        });
    });

    it('should respond to the client with the current file structure', () => {
        let path = 'some/path';
        let request = {
            query: { path }
        };
        let response = {};

        sinon.stub(fileStructure, 'deleteItem').returns(Promise.resolve());
        sinon.stub(getFileStructure, 'handler').returns(Promise.resolve());

        return deleteItem.handler(request, response)
        .then(() => {
            expect(getFileStructure.handler).to.have.been.calledWith(request, response);
        })
        .finally(() => {
            fileStructure.deleteItem.restore();
            getFileStructure.handler.restore();
        });
    });

    it('should handle known TractorErrors', () => {
        let error = new TractorError();
        let path = 'some/path';
        let request = {
            query: { path }
        };
        let response = { };

        sinon.stub(fileStructure, 'deleteItem').returns(Promise.reject(error));
        sinon.stub(errorHandler, 'handler');

        return deleteItem.handler(request, response)
        .then(() => {
            expect(errorHandler.handler).to.have.been.calledWith(response, error);
        })
        .finally(() => {
            fileStructure.deleteItem.restore();
            errorHandler.handler.restore();
        });
    });

    it('should handle unknown errors', () => {
        let error = new Error();
        let path = 'some/path';
        let request = {
            query: { path }
        };
        let response = { };

        sinon.stub(fileStructure, 'deleteItem').returns(Promise.reject(error));
        sinon.stub(errorHandler, 'handler');

        return deleteItem.handler(request, response)
        .then(() => {
            expect(errorHandler.handler).to.have.been.calledWith(response, new TractorError('Could not delete "some/path"', 500));
        })
        .finally(() => {
            fileStructure.deleteItem.restore();
            errorHandler.handler.restore();
        });
    });
});
