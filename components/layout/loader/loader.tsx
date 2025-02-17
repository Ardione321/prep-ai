import { Spinner } from "@heroui/react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner color="default" label="loading" />
    </div>
  );
};

export default Loader;
