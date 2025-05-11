import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";
import person from "assets/images/person.jpeg";

const NUMBER_OF_IMAGES = 20;
const NUM_PAGES = 5;
const MIN_WIDTH_PX = 200;
const MAX_WIDTH_PX = 400;
const HEIGHT_PX = 400;
const WIDTH_PX = 400;

export type Image = {
  title: string;
  url: string;
  height: number;
  width: number;
};

export type PaginatedResponse = {
  nextPage?: number;
  pageCount: number;
  images: Image[];
};

const generateImages = ({
  numImages,
  minWidthPx,
  maxWidthPx,
}: {
  numImages: number;
  minWidthPx: number;
  maxWidthPx: number;
}) => {
  /*return Array.from({ length: numImages }, (_, i) => {
    const randomWidthPx = Math.floor(
      Math.random() * (maxWidthPx - minWidthPx + 1) + minWidthPx,
    );

    return {
      title: `image-${i}`,
      url: `https://picsum.photos/id/${i + 1}/${randomWidthPx}/${HEIGHT_PX}`,
      height: HEIGHT_PX,
      width: randomWidthPx,
    };
  });*/
  return  [{
      title: "Dog"+numImages,
      url: dog,
      height: HEIGHT_PX,
      width: WIDTH_PX,
    },
    {
      title: "Cat"+numImages,
      url: cat,
      height: HEIGHT_PX,
      width: WIDTH_PX,
    },
    {
      title: "Rabbit"+numImages,
      url: rabbit,
      height: HEIGHT_PX,
      width: WIDTH_PX,
    },
    {
      title: "Person"+numImages,
      url: person,
      height: HEIGHT_PX,
      width: WIDTH_PX,
    },
  ]
};

// Paginated api example to demo infinite scrolling.
// The same 50 images are returned each time.
// Please do not use this as a best practice example.
export const getImages = async (page: number): Promise<PaginatedResponse> => {
  // Wait 1 second to simulate a fetch request.
  await new Promise((res) => setTimeout(res, 1000));

  return {
    pageCount: NUM_PAGES,
    nextPage: page === NUM_PAGES ? undefined : page + 1,
    images: generateImages({
      numImages: NUMBER_OF_IMAGES,
      minWidthPx: MIN_WIDTH_PX,
      maxWidthPx: MAX_WIDTH_PX,
    }),
  };
};
