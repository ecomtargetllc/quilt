import {compileToIR} from 'apollo-codegen/lib/compilation';

export const compile = compileToIR as ((...args: any[]) => any);
