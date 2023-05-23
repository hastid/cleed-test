import { Toaster } from "react-hot-toast";
import { Card, CardBody, CardTitle } from "reactstrap";
import "./App.css";

import Header from "./components/NavBar";
import UploadBox from "./components/UploadBox";

function App() {
  return (
    <div className="app">
      <Toaster position="top-right" />
      <Header />
      <div className="main">
        <Card>
          <CardTitle tag="h3">Upload Your File</CardTitle>
          <CardBody>
            <UploadBox />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default App;
