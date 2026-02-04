import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";

export default function Carousel({ images }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      style={{ height: 300 }}
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
