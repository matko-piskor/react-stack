import { Image } from 'antd';
import { useRouteError } from 'react-router-dom';
import { Carousel } from '~/components/carousel/carousel';

export default function HomeRoute() {
    return (
        <div className='flex flex-col items-center py-16 px-8'>
            <h1 className='text-lg text-primary'>
                Template React stack with all neccessary (and optional) depenedencies Powered by Vite
            </h1>
            <div className='p-8'>
                <Image src='/biss-logo.png' />
            </div>
            <Carousel
                items={[
                    { imageSrc: '/antd-icon.png', title: 'Ant Design' },
                    { imageSrc: '/react-icon.png', title: 'React' },
                    { imageSrc: '/react-icons-icon.png', title: 'React icons' },
                    { imageSrc: '/redux-icon.png', title: 'Redux' },
                    { imageSrc: '/tailwind-icon.png', title: 'Tailwind' },
                    { imageSrc: '/typescript-icon.png', title: 'Typescript' },
                    { imageSrc: '/vite-icon.png', title: 'Vite' },
                ]}
            />
        </div>
    );
}

export function HomeErrorBoundary() {
    const error = useRouteError();
    return (
        <div>
            <h2>Dang!</h2>
            <h3>Here is an error</h3>
            <code>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </code>
        </div>
    );
}
