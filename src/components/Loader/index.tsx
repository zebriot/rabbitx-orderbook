import Lottie from "lottie-react";
import loaderAnimation from "../../assets/lottie/loader.json";

const Loader = () => {
  return (
    <Lottie
      animationData={loaderAnimation}
      loop
      style={{
        height: "100px",
        width: "100px",
        placeSelf: "center",
      }}
    />
  );
};

export default Loader;
