import { Image } from 'antd';
import Slider, { type Settings } from 'react-slick';
import './style.css';

interface Props extends Settings {
    items: Array<{ imageSrc: string; title: string }>;
}

export function Carousel({ items, ...props }: Props) {
    return (
        <div className='w-full p-8'>
            <Slider
                {...props}
                dots
                infinite
                slidesToShow={4}
                slidesToScroll={4}
                autoplay
                autoplaySpeed={2000}
                speed={500}
                responsive={[
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        },
                    },
                    {
                        breakpoint: 800,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        },
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: false,
                        },
                    },
                ]}
            >
                {items.map((item, index) => {
                    return (
                        <div key={index}>
                            <div className='flex flex-col items-center justify-center gap-4'>
                                <div className='h-[200px] w-[200px]'>
                                    <Image src={item.imageSrc} width='100%' height='100%' />
                                </div>
                                <h2 className='text-semibold text-base text-primary'>{item.title}</h2>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}
