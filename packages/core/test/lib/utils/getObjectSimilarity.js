"use strict";

const test = require("eater/runner").test;
const getObjectSimilarity = require(`${process.cwd()}/lib/utils/getObjectSimilarity`);
const assert = require("power-assert");

test('', ()=>{
        const obj1 = {
            key: "foo"
        };

        const obj2 = {
            key: "bar"
        };

        const result = getObjectSimilarity(obj1,obj2)

        assert.deepEqual(result,[1,1])
    }
)

test('', ()=>{
    const obj1 = {
        key: {foo: "foo"}
    }

    const obj2 = {
        key: {bar: "bar"}
    }

    const result = getObjectSimilarity(obj1,obj2)

    assert.deepEqual(result,[2,1])

    }

)

test('', ()=>{
    const obj1 = {
        key1: "foo",
        key2: {
            key2_1: "bar",
            key2_2: "barbar"
        },
        key3: {
            key3_1: {
                key3_1_1:"baz",
                key3_1_2:"bazbaz"
            }
        }
    }

    const obj2 = {
        key1: "foo",
        key2: {
            key2_1: "bar"
        },
        key3: {
            key3_1: {
                key3_1_1:"baz"
            }
        }
    }

    const result = getObjectSimilarity(obj1,obj2)

    assert.deepEqual(result,[8,6])


    }

)