import React from "react";
import ContentLoader from "react-content-loader";

const ContentLoaderCompo = () => (
  <ContentLoader
    speed={2}
    width={1120}
    height={860}
    viewBox="0 20 300 200"
    backgroundColor="#E8EAE6"
    foregroundColor="#CDD0CB"
  >
    <rect x="0" y="0" rx="3" ry="3" width="400" height="45" />
    <rect x="0" y="50" rx="3" ry="3" width="400" height="45" />
    <rect x="0" y="100" rx="3" ry="3" width="400" height="600" />
  </ContentLoader>
);

export default ContentLoaderCompo;
