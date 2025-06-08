import {
  Button,
  FileInput,
  FileInputItem,
  ImageCard,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";

import {AppElementChangeEvent} from "./app"
import { useState } from "react";

type HomePageProps = {
  userImagesState: AppElementChangeEvent;
  setUserImagesState: (appElementChangeEvent :any) => void;
  templateImageState: AppElementChangeEvent;
  setTemplateImageState: (appElementChangeEvent :any) => void;
  enterTemplatesPage: () => void;
};

/**
 * Home Page component containing page controls
 **/
export const HomePage = (props: HomePageProps) => {
  const [uploading, setUploading] = useState(false);
  const handleFileChange = async (files: File[], onloadend) => {
    for (const file of files) {
      setUploading(true);
      const reader = new FileReader();

      reader.onloadend = () => {
        // Set the image preview URL
        onloadend(file, reader);
        setUploading(false)
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  }

  return (
    <Rows spacing="2u">
      <Title size="xsmall">Your images</Title>
      {props.userImagesState.data.length > 0 ? (
        props.userImagesState.data.map((item, index) => (
          <div key={"image_" + item.imageId}>
            <FileInputItem
              label={item.imageId} 
              onDeleteClick={() => {
                props.setUserImagesState((prevState) => {
                  return {
                    ...prevState,
                    data: prevState.data.filter(i => i.imageId !== item.imageId),
                  }
                });
              }}
            />
            <ImageCard
              thumbnailUrl={item.content} 
              alt={`Preview of ${item.imageId}`}
            />
          </div>
        ))
      ) : (
        <FileInput
          accept={[
            'image/*'
          ]}
          multiple={true}
          onDropAcceptedFiles={(files) => handleFileChange(files, (file, reader) => {
            props.setUserImagesState((prevState) => {
              return {
                ...prevState, 
                data: [         
                  ...prevState.data,
                  {
                    width: 400,
                    height: 400,
                    content: reader.result as string,
                    imageId: file.name,
                  }, 
                ],
              }
            })
          })}
          stretchButton={true}
          disabled={uploading}
        />
      )}
      <Title size="xsmall">Your template</Title>
      {props.templateImageState.data.length > 0 ? (
        <Rows spacing="2u">
          {
            props.templateImageState.data.map((item, index) => (
              <div key={"template_" + item.imageId}>
                <FileInputItem
                  label={item.imageId}
                  onDeleteClick={() => {
                    props.setTemplateImageState((prevState) => ({
                      ...prevState,
                      data: prevState.data.filter(i => i.imageId !== item.imageId),
                    }));
                  }}
                />
                <ImageCard
                  thumbnailUrl={item.content} 
                  alt={`Preview of ${item.imageId}`}
                />
              </div>
            ))
          }
        </Rows>
      ) : (
        <Rows spacing="2u">
          <FileInput
            accept={[
              'image/*'
            ]}
            multiple={false}
            onDropAcceptedFiles={(files) => handleFileChange(files, (file, reader) => {
              props.setTemplateImageState((prevState) => {
                return {
                  ...prevState,
                  data: [     
                    {
                      width: 400,
                      height: 400,
                      content: reader.result as string,
                      imageId: file.name,
                    }, 
                  ],
                }
              })
            })}
            stretchButton={true}
            disabled={uploading}
          />
          <Text
            alignment="start"
            capitalization="default"
            size="medium"
            variant="regular"
          >
            Or
          </Text>
          <Button
                ariaLabel="Label text"
                onClick={props.enterTemplatesPage}
                variant="secondary"
              >
              Or select from templates provided
          </Button>
        </Rows>
      )}
      <Button
        alignment="center"
        ariaLabel="Label text"
        onClick={() => { }} // TODO: need to be updated with when api is availabel 
        variant="primary">
        Generate Image
      </Button>
    </Rows>
  );
};
