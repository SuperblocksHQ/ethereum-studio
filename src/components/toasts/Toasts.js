import {IconInformation} from "../icons";
import React from "react";
import style from "../topbar/style.less";

export const ProjectLoadedSuccess = () => (
    <div className={"messageContainer"}>
        <IconInformation/>
        Project downloaded and opened!
    </div>
);

export const ForkSuccessMessage = () => (
    <div className={"messageContainer"}>
        <IconInformation/>
        Project Forked!
    </div>
);
