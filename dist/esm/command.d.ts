import { QueryCommand } from './commands/query';
import { LogicCommand } from './commands/logic';
import { UpdateCommand } from './commands/update';
import Aggregation from './aggregate';
export declare type IQueryCondition = Record<string, any> | LogicCommand;
export declare const Command: {
    eq(val: any): QueryCommand;
    neq(val: any): QueryCommand;
    lt(val: any): QueryCommand;
    lte(val: any): QueryCommand;
    gt(val: any): QueryCommand;
    gte(val: any): QueryCommand;
    in(val: any): QueryCommand;
    nin(val: any): QueryCommand;
    all(val: any): QueryCommand;
    elemMatch(val: any): QueryCommand;
    exists(val: boolean): QueryCommand;
    size(val: number): QueryCommand;
    mod(val: number[]): QueryCommand;
    geoNear(val: any): QueryCommand;
    geoWithin(val: any): QueryCommand;
    geoIntersects(val: any): QueryCommand;
    and(...__expressions__: import("./serializer/datatype").IQueryCondition[]): LogicCommand;
    nor(...__expressions__: import("./serializer/datatype").IQueryCondition[]): LogicCommand;
    or(...__expressions__: import("./serializer/datatype").IQueryCondition[]): LogicCommand;
    set(val: any): UpdateCommand;
    remove(): UpdateCommand;
    inc(val: number): UpdateCommand;
    mul(val: number): UpdateCommand;
    push(...args: any[]): UpdateCommand;
    pull(values: any): UpdateCommand;
    pullAll(values: any): UpdateCommand;
    pop(): UpdateCommand;
    shift(): UpdateCommand;
    unshift(...__values__: any[]): UpdateCommand;
    addToSet(values: any): UpdateCommand;
    rename(values: any): UpdateCommand;
    bit(values: any): UpdateCommand;
    max(values: any): UpdateCommand;
    min(values: any): UpdateCommand;
    aggregate: {
        pipeline(): Aggregation;
        abs: (param: any) => AggregationOperator;
        add: (param: any) => AggregationOperator;
        ceil: (param: any) => AggregationOperator;
        divide: (param: any) => AggregationOperator;
        exp: (param: any) => AggregationOperator;
        floor: (param: any) => AggregationOperator;
        ln: (param: any) => AggregationOperator;
        log: (param: any) => AggregationOperator;
        log10: (param: any) => AggregationOperator;
        mod: (param: any) => AggregationOperator;
        multiply: (param: any) => AggregationOperator;
        pow: (param: any) => AggregationOperator;
        sqrt: (param: any) => AggregationOperator;
        subtract: (param: any) => AggregationOperator;
        trunc: (param: any) => AggregationOperator;
        arrayElemAt: (param: any) => AggregationOperator;
        arrayToObject: (param: any) => AggregationOperator;
        concatArrays: (param: any) => AggregationOperator;
        filter: (param: any) => AggregationOperator;
        in: (param: any) => AggregationOperator;
        indexOfArray: (param: any) => AggregationOperator;
        isArray: (param: any) => AggregationOperator;
        map: (param: any) => AggregationOperator;
        range: (param: any) => AggregationOperator;
        reduce: (param: any) => AggregationOperator;
        reverseArray: (param: any) => AggregationOperator;
        size: (param: any) => AggregationOperator;
        slice: (param: any) => AggregationOperator;
        zip: (param: any) => AggregationOperator;
        and: (param: any) => AggregationOperator;
        not: (param: any) => AggregationOperator;
        or: (param: any) => AggregationOperator;
        cmp: (param: any) => AggregationOperator;
        eq: (param: any) => AggregationOperator;
        gt: (param: any) => AggregationOperator;
        gte: (param: any) => AggregationOperator;
        lt: (param: any) => AggregationOperator;
        lte: (param: any) => AggregationOperator;
        ne: (param: any) => AggregationOperator;
        cond: (param: any) => AggregationOperator;
        ifNull: (param: any) => AggregationOperator;
        switch: (param: any) => AggregationOperator;
        dateFromParts: (param: any) => AggregationOperator;
        dateFromString: (param: any) => AggregationOperator;
        dayOfMonth: (param: any) => AggregationOperator;
        dayOfWeek: (param: any) => AggregationOperator;
        dayOfYear: (param: any) => AggregationOperator;
        isoDayOfWeek: (param: any) => AggregationOperator;
        isoWeek: (param: any) => AggregationOperator;
        isoWeekYear: (param: any) => AggregationOperator;
        millisecond: (param: any) => AggregationOperator;
        minute: (param: any) => AggregationOperator;
        month: (param: any) => AggregationOperator;
        second: (param: any) => AggregationOperator;
        hour: (param: any) => AggregationOperator;
        week: (param: any) => AggregationOperator;
        year: (param: any) => AggregationOperator;
        literal: (param: any) => AggregationOperator;
        mergeObjects: (param: any) => AggregationOperator;
        objectToArray: (param: any) => AggregationOperator;
        allElementsTrue: (param: any) => AggregationOperator;
        anyElementTrue: (param: any) => AggregationOperator;
        setDifference: (param: any) => AggregationOperator;
        setEquals: (param: any) => AggregationOperator;
        setIntersection: (param: any) => AggregationOperator;
        setIsSubset: (param: any) => AggregationOperator;
        setUnion: (param: any) => AggregationOperator;
        concat: (param: any) => AggregationOperator;
        dateToString: (param: any) => AggregationOperator;
        indexOfBytes: (param: any) => AggregationOperator;
        indexOfCP: (param: any) => AggregationOperator;
        split: (param: any) => AggregationOperator;
        strLenBytes: (param: any) => AggregationOperator;
        strLenCP: (param: any) => AggregationOperator;
        strcasecmp: (param: any) => AggregationOperator;
        substr: (param: any) => AggregationOperator;
        substrBytes: (param: any) => AggregationOperator;
        substrCP: (param: any) => AggregationOperator;
        toLower: (param: any) => AggregationOperator;
        toUpper: (param: any) => AggregationOperator;
        meta: (param: any) => AggregationOperator;
        addToSet: (param: any) => AggregationOperator;
        avg: (param: any) => AggregationOperator;
        first: (param: any) => AggregationOperator;
        last: (param: any) => AggregationOperator;
        max: (param: any) => AggregationOperator;
        min: (param: any) => AggregationOperator;
        push: (param: any) => AggregationOperator;
        stdDevPop: (param: any) => AggregationOperator;
        stdDevSamp: (param: any) => AggregationOperator;
        sum: (param: any) => AggregationOperator;
        let: (param: any) => AggregationOperator;
    };
    project: {
        slice: (param: any) => ProjectionOperator;
        elemMatch: (param: any) => ProjectionOperator;
    };
};
declare class AggregationOperator {
    constructor(name: any, param: any);
}
declare class ProjectionOperator {
    constructor(name: any, param: any);
}
export default Command;
