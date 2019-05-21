import Home from "./Home";

import * as React from "react";
import { render } from "react-dom";
const styles = document.createElement("style");
styles.innerText = `@import url(https://unpkg.com/tachyons@4/css/tachyons.min.css);`;
document.head.appendChild(styles);
render(<Home />, document.getElementById("app"));
