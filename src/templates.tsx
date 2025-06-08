import { Box, Rows, Text, ArrowLeftIcon, Button, ImageCard, Grid } from "@canva/app-ui-kit";
import {AppElementChangeEvent, Image} from "./app"

type InteractionPageProps = {
  goBack: () => void;
  templateImageState: AppElementChangeEvent;
  setTemplateImageState: (appElementChangeEvent :any) => void;
  templates: Image[];
};

/**
 * A page component containing various buttons to interact with the design.
 **/
export const TemplatesPage = (props: InteractionPageProps) => {
  return (
    <Rows spacing="2u">
      <Box display="flex">
        <Button
          size="small"
          type="button"
          variant="tertiary"
          icon={ArrowLeftIcon}
          onClick={props.goBack}
        />
        <Text size="large" variant="bold">
          Templates
        </Text>
      </Box>
      <Grid alignX="stretch" alignY="stretch" columns={2} spacing="1u">
        {props.templates.map((item, index) => (
          <ImageCard
            alt={item.imageId}
            ariaLabel="Select the"
            onClick={() => {
              props.setTemplateImageState((prevState) => {
                return {
                  ...prevState, // Copy all other top-level properties from prevState
                  data: [         // Create a NEW array for 'data'
                    {
                      width: 400,
                      height: 400,
                      content: item.content,
                      imageId: item.imageId,
                    },  // Add the new item to the end
                  ],
                }
              });
              props.goBack();
            }}
            borderRadius="standard"
            thumbnailHeight={item.height}
            thumbnailUrl={item.content}/>
        ))}
      </Grid>
    </Rows>
  );
};
