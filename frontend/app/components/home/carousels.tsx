import Carousel from 'react-bootstrap/Carousel';

export const CarouselsHome = () => {
  return (
    <div className="max-w-6xl mx-auto my-9 rounded-2xl overflow-hidden shadow-md">
      <Carousel data-bs-theme="dark">
        <Carousel.Item>
          <img
            className="w-full h-[400px] object-cover"
            src="https://www.thebesthalifax.com/wp-content/uploads/2025/02/event-spaces-halifax.jpg"
            alt="First slide"
            width={1600}
            height={400}
            loading="lazy"
            decoding="async"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="w-full h-[400px] object-cover"
            src="https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-d98e8d7/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg"
            alt="Second slide"
            width={1600}
            height={400}
            loading="lazy"
            decoding="async"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="w-full h-[400px] object-cover"
            src="https://halifaxevents.ca/wp-content/uploads/2023/10/HE-Link-Preview.png"
            alt="Third slide"
            width={1600}
            height={400}
            loading="lazy"
            decoding="async"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}