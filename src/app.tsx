import {
  ArrowUpIcon,
  Button,
  FileInput,
  FileInputItem,
  Masonry,
  MasonryItem,
  ImageCard,
  Rows,
  Text,
  Title,
  Placeholder,
} from "@canva/app-ui-kit";
import { type AppElementOptions, initAppElement } from "@canva/design";
import { useState, useRef } from "react";
import * as styles from "styles/components.css";
import type { QueuedImage } from "@canva/asset";
import { upload } from "@canva/asset";
import type { ImageDragConfig } from "@canva/design";
import { ui } from "@canva/design";
import type { Image } from "./fake_api";
import { getImages } from "./fake_api";
import InfiniteScroll from "react-infinite-scroller";
import { generatePlaceholders } from "./utils";
import { useAddElement } from "utils/use_add_element";
import { useFeatureSupport } from "utils/use_feature_support";

const TARGET_ROW_HEIGHT_PX = 100;
const NUM_PLACEHOLDERS = 4;

type AppElementData = {
  imageId: string;
  width: number;
  height: number;
  content: string;
};

type AppElementChangeEvent = {
  data: AppElementData;
  update?: (opts: AppElementOptions<AppElementData>) => Promise<void>;
};

const uploadImage = async (image: Image): Promise<QueuedImage> => {
  // This example uses Picsum image URLs, which undergo redirects to the final URL.
  // Since the `upload` method cannot handle redirect URLs, we fetch the image to resolve the final URL directly.
  // Skip this step if your API already returns the resolved URL.
  const { url } = await fetch(image.url);

  const queuedImage = await upload({
    type: "image",
    mimeType: "image/jpeg",
    url,
    thumbnailUrl: url,
    width: image.width,
    height: image.height,
    aiDisclosure: "none",
  });

  return queuedImage;
};

export const Placeholders = generatePlaceholders({
  numPlaceholders: NUM_PLACEHOLDERS,
  height: TARGET_ROW_HEIGHT_PX,
}).map((placeholder, index) => (
  <MasonryItem
    targetWidthPx={placeholder.width}
    targetHeightPx={placeholder.height}
    key={`placeholder-${index}`}
  >
    <Placeholder shape="rectangle" />
  </MasonryItem>
));

const initialTemplateState: AppElementChangeEvent = {
  data: { imageId: "dog",content: "", width: 400, height: 400},
};

const initialUserImageState: AppElementChangeEvent = {
  data: { imageId: "",content: "", width: 400, height: 400},
};
const initialTemplateUploadState: AppElementChangeEvent = {
  data: { imageId: "",content: "", width: 400, height: 400},
};


export const App = () => {
  const userImageInputRef = useRef<HTMLInputElement>(null);
  const templateImageInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState<number | undefined>(1);
  const scrollContainerRef = useRef(null);
  const [templateSelectState, setTemplateSelectState] = useState<AppElementChangeEvent>(initialTemplateState);
  const {
    data: { imageId, content, width, height },
  } = templateSelectState;
  const [userImageState, setUserImageState] = useState<AppElementChangeEvent>(initialUserImageState);
  const [templateUploadState, setTemplateUploadState] = useState<AppElementChangeEvent>(initialUserImageState);
  const [uploading, setUploading] = useState(false);
  
  const fetchImages = async () => {
    if (isFetching || !page) {
      return;
    }

    setIsFetching(true);

    try {
      const { images: newImages, nextPage } = await getImages(page);

      setImages([...images, ...newImages]);
      setPage(nextPage);
    } finally {
      setIsFetching(false);
    }
  };

  const addImageToDesign = async (image: Image) => {
    
  };

  const handleFileChange = async (files: File[], onloadend) => {
    const file = files?.[0]
    setUploading(true);
    // Create a FileReader to read the file
    const reader = new FileReader();

    reader.onloadend = () => {
      // Set the image preview URL
      onloadend(file, reader);
      setUploading(false)
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  }

  const Images = images.map((image, index) => (
    <MasonryItem
      targetWidthPx={image.width}
      targetHeightPx={image.height}
      key={`MasonryItem-${index}`}
    >
      <ImageCard
        ariaLabel="Select template image"
        key = {image.title}
        onClick={() => {
          setTemplateSelectState((prevState) => {
            return {
              ...prevState,
              data: {
                ...prevState.data,
                imageId: image.title,
              },
            };
          });
        }}
        thumbnailUrl={image.url}
        alt={image.title}
        selectable={true}
        selected={templateSelectState.data.imageId === image.title}
      />
    </MasonryItem>
  ));

  return (
    <div className={styles.scrollContainer} ref={scrollContainerRef}>
      <Rows spacing="2u">
        <Title size="xsmall">Your image</Title>
        {userImageState.data.content ? (
          <Rows spacing="2u">
            <FileInputItem
              label={userImageState.data.imageId}
              onDeleteClick={() => {setUserImageState(initialUserImageState)}}
            />
            <ImageCard thumbnailUrl={userImageState.data.content} alt="Preview" />
          </Rows>
        ) : (
          <FileInput
            multiple={false}
            onDropAcceptedFiles={(files)=>handleFileChange(files, (file, reader)=>{
              setUserImageState((prevState) => {
                return {
                  ...prevState,
                  data: {
                    ...prevState.data,
                    content: reader.result as string,
                    imageId: file.name,
                  },
                };
              })
            })}
            stretchButton={true}
            disabled={uploading} 
          />
        )}
        <Title size="xsmall">Select template</Title>
        <InfiniteScroll
          loadMore={fetchImages}
          hasMore={page != null}
          useWindow={false}
          getScrollParent={() => scrollContainerRef.current}
        >
          <Masonry targetRowHeightPx={TARGET_ROW_HEIGHT_PX}>
            {[...Images, ...(isFetching ? Placeholders : [])]}
          </Masonry>
        </InfiniteScroll>
        <Title size="xsmall">Or upload your template</Title>
        {templateUploadState.data.content ? (
          <Rows spacing="2u">
            <FileInputItem
              label={templateUploadState.data.imageId}
              onDeleteClick={() => {setTemplateUploadState(initialTemplateUploadState)}}
            />
            <ImageCard thumbnailUrl={templateUploadState.data.content} alt="Preview" />
          </Rows>
        ) : (
          <FileInput
            multiple={false}
            onDropAcceptedFiles={(files)=>handleFileChange(files, (file, reader)=>{
              setTemplateSelectState((prevState) => {
                return {
                  ...prevState,
                  data: {
                    ...prevState.data,
                    content: reader.result as string,
                    imageId: file.name,
                  },
                };
              })
            })}
            stretchButton={true}
            disabled={uploading} 
          />
        )}
        <Button
          alignment="center"
          ariaLabel="Label text"
          onClick={() => {}}
          variant="primary"
        >
          Generate Image
        </Button>
      </Rows>
    </div>
  );
};
