import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Table } from 'antd';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    schema as dataSchema,
    useMockTableWithFilters,
    type Schema as DataSchema,
} from '~/mocks/table-with-filters.mock';
import { schemaToColumns } from '~/utils/misc';

const schema = z.object({
    name: z.string().optional(),
    age: z.number().min(18, { message: 'Age to low (min 18)' }).max(99, { message: 'Age to high (max 99)' }).optional(),
});

type Schema = z.infer<typeof schema>;

const columns = schemaToColumns<DataSchema>(dataSchema);

export default function TableWithFiltersRoute() {
    const { filter, data } = useMockTableWithFilters();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Schema>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: Schema) => {
        filter(data);
    };

    const onReset = () => {
        reset();
        filter();
    };

    return (
        <div className='mx-auto flex w-full max-w-[1000px] flex-col justify-center gap-16 p-8'>
            <div className='flex flex-col gap-4'>
                <h2 className='block text-2xl'>Filters</h2>
                <form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className='flex flex-col gap-8'>
                    <div className='flex justify-between gap-8'>
                        <div className='flex flex-1 flex-col gap-3'>
                            <label htmlFor='name'>Name</label>
                            <input
                                {...register('name')}
                                className='h-8 w-full'
                                aria-invalid={errors.name ? 'true' : 'false'}
                            />
                            {errors.name && <p role='alert'>{errors.name.message}</p>}
                        </div>
                        <div className='flex flex-1 flex-col gap-3'>
                            <label htmlFor='age'>Age</label>
                            <input
                                type='number'
                                {...register('age', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
                                className='h-8 w-full'
                                aria-invalid={errors.age ? 'true' : 'false'}
                            />
                            {errors.age && <p role='alert'>{errors.age.message}</p>}
                        </div>
                    </div>
                    <div className='flex justify-end gap-2'>
                        <Button htmlType='submit'>Submit</Button>
                        <Button htmlType='reset'>Clear</Button>
                    </div>
                </form>
            </div>
            <div>
                <Table columns={columns} dataSource={data} rowKey='id' />
            </div>
        </div>
    );
}
