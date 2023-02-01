import { z } from 'zod';
import { faker } from '@faker-js/faker';
import { useState } from 'react';

export const schema = z.object({
    id: z.string(),
    name: z.string(),
    age: z.number(),
    active: z.boolean(),
    activeFrom: z.date().optional(),
    activeUntil: z.date().optional(),
});

export type Schema = z.infer<typeof schema>;

function createDatasource(range = 1000) {
    return Array.from({ length: range }, () => {
        const active = faker.datatype.boolean();
        return {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            age: faker.datatype.number({ max: 99, min: 18 }),
            active,
            activeFrom: active ? faker.datatype.datetime() : undefined,
            activeUntil: !active ? faker.datatype.datetime() : undefined,
        };
    });
}

export function useMockTableWithFilters() {
    const [datasource] = useState(createDatasource());
    const [data, setData] = useState(datasource);

    function filter(args?: { name?: string; age?: number }) {
        if (!args) {
            setData(datasource);
            return;
        }
        setData(
            datasource.filter((r) => {
                if (args.name && !r.name.includes(args.name)) return false;
                if (args.age && r.age !== args.age) return false;
                return true;
            }),
        );
    }
    return {
        data,
        filter,
    };
}
