/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

describe('filter', function () {
    beforeEach(module('sampleApp'));

    describe('reverse', function () {
        it('should reverse the string', inject(function (reverseFilter) {
            expect(reverseFilter('ABC')).toEqual('CBA');
        }));
    });
});