import { type AppElementOptions, initAppElement } from "@canva/design";
import { useState, useRef } from "react";
import * as styles from "styles/components.css";
import { HomePage } from "./home";
import { TemplatesPage } from "./templates";
import cat from "assets/images/cat.jpg";
import dog from "assets/images/dog.jpg";
import rabbit from "assets/images/rabbit.jpg";

export type Image = {
  imageId: string;
  width: number;
  height: number;
  content: string;
};

export type AppElementChangeEvent = {
  data: Image[];
  update?: (opts: AppElementOptions<Image>) => Promise<void>;
};

const initialTemplateState: AppElementChangeEvent = {
  data: [{ imageId: "dog", content: "", width: 400, height: 400}],
};

const initialUserImageState: AppElementChangeEvent = {
  data: [],
};
const initialTemplateUploadState: AppElementChangeEvent = {
  data: [],
};

const templateImages: Image[] = [
  {imageId: "Dog", content: dog, height: 200, width: 200},
  {imageId: "Cat", content: cat, height: 200, width: 200},  
  {imageId: "Rabbit", content: rabbit, height: 200, width: 200}
]; //TODO: update with real template content



type AppPage = "home" | "templates";

export const App = () => {
  const [page, setPage] = useState<AppPage>("home");
  const [userImagesState, setUserImagesState] = useState<AppElementChangeEvent>(initialUserImageState);
  const [templateImageState, setTemplateImageState] = useState<AppElementChangeEvent>(initialUserImageState);


  const renderPage = (page: AppPage) => {
    switch (page) {
      case "home":
        return (
          <HomePage userImagesState={userImagesState} setUserImagesState={setUserImagesState} templateImageState={templateImageState} setTemplateImageState={setTemplateImageState} enterTemplatesPage={() => setPage("templates")}/>
        );
        break;
      case "templates":
        return (
          <TemplatesPage templates = {templateImages} templateImageState={templateImageState} setTemplateImageState={setTemplateImageState} goBack={() => setPage("home")}/>
        );
      default:
        return;
    }
  };
  return <div className={styles.scrollContainer}>{renderPage(page)}</div>;
};
